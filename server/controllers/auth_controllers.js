import Customer from "../models/Customer.js";
import jwt from "jsonwebtoken";
import {
  hashPassword,
  comparePassword,
  verifiedEmail,
  resetPassword,
  generateRandomPassword,
} from "../utils/authHelpers.js";
import { createError } from "../utils/error.js";
import User from "../models/User.js";
import Token from "../models/Token.js";
import { sendNewPasswordEmail } from "../utils/sendEmail.js";

// CUSTOMER REGISTER
export const customerRegister = async (req, res, next) => {
  try {
    const { lname, fname, email, password, phone, address, ...others } =
      req.body;

    // Validate
    if (!lname || lname == "") {
      throw createError(400, "Lastname is Required");
    }
    if (!fname || fname == "") {
      throw createError(400, "Firstname is Required");
    }
    if (!email || email === "") {
      throw createError(400, "Email is Required");
    }
    if (!password || password === "") {
      throw createError(400, "Password is Required");
    }
    if (!phone || phone === "") {
      throw createError(400, "Phone is Required");
    }
    // If address isnt existed
    if (!address || address === "") {
      throw createError(400, "Address is Required");
    }
    // If address is existed
    else {
      if (!address.street || address.street === "") {
        throw createError(400, "Street is Required");
      }
      if (!address.district || address.district === "") {
        throw createError(400, "District is Required");
      }
      if (!address.city || address.city === "") {
        throw createError(400, "City is Required");
      }
      if (!address.country || address.country === "") {
        throw createError(400, "Country is Required");
      }
    }

    // Existed Customer
    const isExisted = await Customer.findOne({ email: email });
    if (isExisted) {
      return res.status(201).json({
        success: true,
        message: "Email đã được đăng ký, hãy đăng nhập",
      });
    }

    // Register Customer
    const hashedPassword = await hashPassword(password);
    const newCustomer = new Customer({
      lname: lname,
      fname: fname,
      email: email,
      password: hashedPassword,
      phone: phone,
      address: address,
      ...others,
    });

    // Save Customer
    const savedCustomer = await newCustomer.save();

    // Send a email to customer email for verify.
    await verifiedEmail(savedCustomer._id, savedCustomer.email, "customer");

    res.status(200).json({
      success: true,
      message: "Đăng ký thành công. Một Email xác thực đã được gửi đến cho bạn",
    });
  } catch (err) {
    next(err);
  }
};

// CUSTOMER LOGIN
export const customerLogin = async (req, res, next) => {
  try {
    const loginEmail = req.body.email;
    const loginPassword = req.body.password;

    // Validate
    if (!loginEmail || loginEmail === "") {
      throw createError(400, "Email is Required");
    }
    if (!loginPassword || loginPassword === "") {
      throw createError(400, "Password is Required");
    }

    // Check existed Customer, Staff and Manager
    const customer = await Customer.findOne({ email: loginEmail });

    if (!customer) {
      throw createError(400, "Email chưa được đăng ký");
    }

    if (customer.status === "inactive") {
      throw createError(400, "Tài khoản này đã bị khoá");
    }

    // Compare password
    const isPwCompare = await comparePassword(loginPassword, customer.password);
    if (!isPwCompare) {
      throw createError(400, "Sai mật khẩu");
    }

    // Check email verified
    if (!customer.verified) {
      // Check this staff had an verified token.
      const token = await Token.findOne({ userId: customer._id });

      // If this staff haven't verifed token, resend it.
      if (!token) {
        await verifiedEmail(customer._id, customer.email, "customer");
      }

      return res.status(200).json({
        success: false,
        message:
          "Tài khoản của bạn chưa được xác thực. Hãy xác thực trước khi đăng nhập",
      });
    }

    // Generate a jwt
    const jwt_token = jwt.sign(
      {
        _id: customer._id,
        lname: customer.lname,
        fname: customer.fname,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    // Format Infomation before response
    const { __v, status, password, ...others } = customer._doc;

    res
      .status(200)
      .header("Authorization", "Bearer " + jwt_token)
      .json({
        success: true,
        message: "Đăng nhập thành công",
        customer: others,
      });
  } catch (err) {
    next(err);
  }
};

// STAFF REGISTER (ONLY MANAGER CAN USE)
export const staffRegister = async (req, res, next) => {
  try {
    const { lname, fname, email, password, ...others } = req.body;

    // Validate
    if (!lname || lname == "") {
      throw createError(400, "Lastname is Required");
    }
    if (!fname || fname == "") {
      throw createError(400, "Firstname is Required");
    }
    if (!email || email === "") {
      throw createError(400, "Email is Required");
    }
    if (password === undefined) {
      console.log(password);
      throw createError(400, "Password is Required");
    }

    // Existed User
    const isExisted = await User.findOne({ email: email });
    if (isExisted) {
      return res.status(201).json({
        success: true,
        message: "Địa chỉ email này đã tồn tại, hãy thử lại",
      });
    }

    // Register User
    // If input haven't password, password will equal to staff email
    const hashedPassword = await hashPassword(
      password !== "" || password ? password : email
    );
    const newUser = new User({
      lname: lname,
      fname: fname,
      email: email,
      password: hashedPassword,
      ...others,
    });

    // Save User
    const savedUser = await newUser.save();

    // Send a email to staff email for verify.
    await verifiedEmail(savedUser._id, savedUser.email, "staff");

    res.status(200).json({
      success: true,
      message: "Đăng ký cho nhân viên thành công. Hãy thực hiện việc xác thực",
    });
  } catch (err) {
    next(err);
  }
};

// STAFF, MANAGER LOGIN
export const staffLogin = async (req, res, next) => {
  try {
    const loginEmail = req.body.email;
    const loginPassword = req.body.password;

    // Validate
    if (!loginEmail || loginEmail === "") {
      throw createError(400, "Email is Required");
    }
    if (!loginPassword || loginPassword === "") {
      throw createError(400, "Password is Required");
    }

    // Check existed Staff and Manager
    const staff = await User.findOne({ email: loginEmail });

    if (!staff) {
      throw createError(400, "Email chưa được đăng ký");
    }

    if (staff.status === "inactive") {
      throw createError(400, "Tài khoản này đã bị khoá");
    }

    // Compare password
    const isPwCompare = await comparePassword(loginPassword, staff.password);
    if (!isPwCompare) {
      throw createError(400, "Sai mật khẩu");
    }

    // Check email verified
    if (!staff.verified) {
      // Check this staff had an verified token.
      const token = await Token.findOne({ userId: staff._id });

      // If this staff haven't verifed token, resend it.
      if (!token) {
        await verifiedEmail(staff._id, staff.email, "staff");
      }

      return res.status(400).json({
        success: false,
        message: "Một Email xác thực đã được gửi đến bạn, hãy kiểm tra",
      });
    }

    // Generate a jwt
    const jwt_token = jwt.sign(
      {
        _id: staff._id,
        lname: staff.lname,
        fname: staff.fname,
        role: staff.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );

    // Format infomation before response
    const { password, ...others } = staff._doc;

    res
      .status(200)
      .header("Authorization", "Bearer " + jwt_token)
      .json({
        success: true,
        message: "Đăng nhập thành công",
        user: others,
      });
  } catch (err) {
    next(err);
  }
};

// SPECIAL REGISTER FOR MANAGER WHEN USER COLLECTIONS IS EMPTY
export const recoverManagerAccount = async (req, res, next) => {
  try {
    const { lname, fname, email, password, ...others } = req.body;

    // Validate
    if (!fname || fname == "") {
      throw createError(400, "Firstname is Required");
    }
    if (!lname || lname == "") {
      throw createError(400, "Lastname is Required");
    }
    if (!email || email === "") {
      throw createError(400, "Email is Required");
    }
    if (!password) {
      throw createError(400, "Password is Required");
    }

    // Existed User
    const isExisted = await User.findOne({ email: email });
    if (isExisted) {
      return res.status(201).json({
        success: true,
        message: "This User already existed, please login",
      });
    }

    // Recover Manager
    // If input haven't password, password will equal to staff email
    const hashedPassword = await hashPassword(
      password !== "" ? password : email
    );
    const recoverManager = new User({
      lname: lname,
      fname: fname,
      email: email,
      password: hashedPassword,
      role: "manager",
      ...others,
    });

    // Save User
    const savedManager = await recoverManager.save();

    res.status(200).json({
      success: true,
      message: "Manager Recovery Successfully",
      data: savedManager,
    });
  } catch (err) {
    next(err);
  }
};

// VERIFY ACCOUNT
export const verifyAccount = async (req, res, next) => {
  try {
    const isStaffOrCustomer = req.query.role;
    console.log(isStaffOrCustomer);

    if (!isStaffOrCustomer) {
      throw createError(400, "Cần thông tin là khách hàng hay nhân viên");
    }

    const userId = req.params.id;
    const verifyToken = req.params.token;

    // Check user existed.
    let user;
    if (isStaffOrCustomer === "staff") {
      user = await User.findById(userId).where({ status: "active" });
      if (!user) {
        throw createError(
          400,
          "Nhân viên không tồn tại hoặc chưa được đăng ký"
        );
      }
    }
    if (isStaffOrCustomer === "customer") {
      user = await Customer.findById(userId).where({ status: "active" });
      if (!user) {
        throw createError(
          400,
          "Khách hàng không tồn tại hoặc chưa được đăng ký"
        );
      }
    }

    // Chech token existed.
    const token = await Token.findOne({
      userId: user._id,
      token: verifyToken,
    });
    if (!token) {
      throw createError(400, "Đường dẫn xác thực không hợp lệ");
    }

    // Verified.
    if (isStaffOrCustomer === "staff") {
      await User.findByIdAndUpdate(user._id, { $set: { verified: true } });
    }
    if (isStaffOrCustomer === "customer") {
      await Customer.findByIdAndUpdate(user._id, { $set: { verified: true } });
    }

    // After verified delete token.
    await Token.deleteOne({
      userId: token.userId,
      token: token.token,
    });

    console.log("I do it verify account!");

    res.status(200).send(
      `<html>
          <head>
              <title>Xác thực tài khoản thành công</title>
              <style>
                  body {
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      height: 100vh;
                  }
          
                  .container {
                      width: 400px;
                      padding: 20px;
                      border: 1px solid #ccc;
                      background-color: #f9f9f9;
                      text-align: center;
                  }
          
                  .success-message {
                      color: #008000;
                      font-size: 24px;
                      font-weight: bold;
                      margin-bottom: 20px;
                  }
          
                  .check-mark {
                      display: inline-block;
                      width: 60px;
                      height: 60px;
                      border-radius: 50%;
                      background-color: #008000;
                      color: white;
                      font-size: 36px;
                      font-weight: bold;
                      line-height: 60px;
                      margin-bottom: 20px;
                  }
              </style>
          </head>
          <body>
              <div class="container">
                  <span class="check-mark">✓</span>
                  <h2 class="success-message">Xác thực tài khoản thành công!</h2>
                  <p>Cảm ơn bạn đã xác thực tài khoản. Bây giờ bạn có thể truy cập vào tài khoản của mình.</p>
              </div>
          </body>
          </html>`
    );
  } catch (err) {
    next(err);
  }
};

// CHANGE PASSWORD
export const changePassword = async (req, res, next) => {
  try {
    const isStaffOrCustomer = req.query.role;
    console.log(isStaffOrCustomer);

    if (!isStaffOrCustomer) {
      throw createError(400, "Cần thông tin là khách hàng hay nhân viên");
    }

    const userId = req.body.id;

    // Check email or userId
    if (!userId || userId === "") {
      throw createError(400, "Thông tin người dùng không được để trống");
    }

    let user;
    // Check user is existed
    if (isStaffOrCustomer === "staff") {
      user = await User.findOne({ _id: userId }).where({
        status: "active",
      });
      if (!user) {
        throw createError(
          400,
          "Nhân viên không tồn tại hoặc chưa được đăng ký"
        );
      }
    }
    if (isStaffOrCustomer === "customer") {
      user = await Customer.findOne({ _id: userId }).where({
        status: "active",
      });
      if (!user) {
        throw createError(
          400,
          "Khách hàng không tồn tại hoặc chưa được đăng ký"
        );
      }
    }

    // Check old password
    const old_password = req.body.old_password;
    if (!old_password || old_password === "") {
      throw createError(400, "Old password is required");
    }
    const isCompare = await comparePassword(old_password, user.password);
    if (!isCompare) {
      throw createError(400, "Mật khẩu cũ không khớp");
    }

    // Get and encode new password and update to user
    const new_password = req.body.new_password;
    if (!new_password || new_password === "") {
      throw createError(400, "New password is required");
    }

    if (new_password === old_password) {
      throw createError(400, "Mật khẩu mới không được giống mật khẩu cũ");
    }

    const hashedPassword = await hashPassword(new_password);

    if (isStaffOrCustomer === "staff") {
      await User.findByIdAndUpdate(user._id, {
        $set: { password: hashedPassword },
      });
    }
    if (isStaffOrCustomer === "customer") {
      await Customer.findByIdAndUpdate(user._id, {
        $set: { password: hashedPassword },
      });
    }

    return res.status(200).json({
      success: true,
      message: "Thay đổi mật khẩu thành công",
    });
  } catch (err) {
    next(err);
  }
};

// FORGET PASSWORD
export const forgetPassword = async (req, res, next) => {
  try {
    const isStaffOrCustomer = req.query.role;
    console.log(isStaffOrCustomer);

    if (!isStaffOrCustomer) {
      throw createError(
        400,
        "Cần thông tin là khách hàng hay nhân viên (role)"
      );
    }

    const email = req.body.email;
    if (!email || email === "") {
      throw createError(400, "Cần thông tin Email");
    }

    let user;
    // Check user existed
    if (isStaffOrCustomer === "staff") {
      user = await User.findOne({ email: email }).where({
        status: "active",
      });
    }
    if (isStaffOrCustomer === "customer") {
      user = await Customer.findOne({ email: email }).where({
        status: "active",
      });
    }
    if (!user) {
      throw createError(400, "Email không tồn tại");
    }

    await resetPassword(user._id, user.email, isStaffOrCustomer);

    res.status(200).json({
      success: true,
      message: "Một email đã gửi đến cho bạn, hãy kiểm tra",
    });
  } catch (err) {
    next(err);
  }
};

// RESET PASSWORD
export const resetPasswordForget = async (req, res, next) => {
  try {
    const isStaffOrCustomer = req.query.role;
    console.log(isStaffOrCustomer);

    if (!isStaffOrCustomer) {
      throw createError(
        400,
        "Cần thông tin là khách hàng hay nhân viên (role)"
      );
    }

    const userId = req.params.id;
    const verifyToken = req.params.token;

    let user;
    // Check user existed.
    if (isStaffOrCustomer === "staff") {
      user = await User.findById(userId).where({ status: "active" });
      if (!user) {
        throw createError(
          400,
          "Nhân viên không tồn tại hoặc chưa được đăng ký"
        );
      }
    }
    if (isStaffOrCustomer === "customer") {
      user = await Customer.findById(userId).where({ status: "active" });
      if (!user) {
        throw createError(
          400,
          "Khách hàng không tồn tại hoặc chưa được đăng ký"
        );
      }
    }

    // Chech token existed.
    const token = await Token.findOne({
      userId: user._id,
      token: verifyToken,
    });
    if (!token) {
      throw createError(400, "Đường dẫn không hợp lệ");
    }

    // Change password
    const newPassword = await generateRandomPassword();
    const hashedNewPassword = await hashPassword(newPassword);
    if (isStaffOrCustomer === "staff") {
      await User.findByIdAndUpdate(user._id, {
        $set: { password: hashedNewPassword },
      });
    }
    if (isStaffOrCustomer === "customer") {
      await Customer.findByIdAndUpdate(user._id, {
        $set: { password: hashedNewPassword },
      });
    }

    // After reset delete token.
    await Token.deleteOne({
      userId: token.userId,
      token: token.token,
    });

    await sendNewPasswordEmail(user.email, newPassword);

    console.log("I do it reset password!");

    res
      .status(200)
      .send(
        "<div><h1>Đăng lại mật khẩu thành công</h1><p>Hãy kiểm tra email</p></div>"
      );
  } catch (err) {
    next(err);
  }
};
