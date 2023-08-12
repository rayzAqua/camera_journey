import bcrypt from "bcrypt";
import crypto from "crypto";
import Token from "../models/Token.js";
import { sendEmail } from "./sendEmail.js";

// Hash password before store it to db
export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

// Encode and compare password before login
export const comparePassword = async (password, hashedPassword) => {
  try {
    return bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.log(error);
  }
};

// For verified account
export const verifiedEmail = async (userId, email, role) => {
  try {
    // Gửi email xác thực tài khoản.
    // Tạo một token để xác thực tài khoản.
    const newToken = new Token({
      userId: userId,
      token: crypto.randomBytes(32).toString("hex"),
    });

    // Lưu token xác thực vào db.
    const savedToken = await newToken.save();

    // Tạo một đường link để xác thực tài khoản.
    const url = `${process.env.BASE_URL}/api/auth/${userId}/verify/${savedToken.token}?role=${role}`;

    // Gửi đi email kèm đường link xác thực trên.
    await sendEmail(email, url, "Link to verify email");
  } catch (err) {
    console.error(err);
  }
};

// For reset password
export const resetPassword = async (userId, email, role) => {
  try {
    // Gửi email xác thực tài khoản.
    // Tạo một token để xác thực tài khoản.
    const newToken = new Token({
      userId: userId,
      token: crypto.randomBytes(32).toString("hex"),
    });

    // Lưu token xác thực vào db.
    const savedToken = await newToken.save();

    // Tạo một đường link để xác thực tài khoản.
    const url = `http://localhost:3001/api/auth/${userId}/reset-password/${savedToken.token}?role=${role}`;

    // Gửi đi email kèm đường link xác thực trên.
    await sendEmail(email, url, "Link to reset password");
  } catch (err) {
    console.error(err);
  }
};

// Generate random password for reset password
export const generateRandomPassword = async () => {
  return crypto.randomBytes(3).toString("hex");
};
