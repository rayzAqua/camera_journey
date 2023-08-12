import Cart from "../models/Cart.js";
import Customer from "../models/Customer.js";
import Product from "../models/Product.js";
import { createError } from "../utils/error.js";

export const createCart = async (req, res, next) => {
  try {
    const userId = req.params.userid;
    const user = await Customer.findById(userId).where({ status: "active" });
    if (!user) {
      throw createError(400, "Không tìm thấy khách hàng");
    }

    if (user.carts.length > 0) {
      // Nếu người dùng đã có giỏ hàng và giỏ hàng đó có trang thái là active (giỏ hàng chưa thanh toán thì không cho tạo mới)
      const isCartExisted = await Cart.find({ customer: user._id }).where({
        status: "active",
      });
      if (isCartExisted.length > 0) {
        return res.status(200).json({
          success: false,
          message: "Khách hàng đã có giỏ hàng",
          cart: isCartExisted,
        });
      }
    }

    // Lấy dữ liệu từ request body
    const productId = req.body.product;
    const cart_quantity = req.body.quantity;
    const product = await Product.findById(productId).where({
      status: "active",
    });
    if (!product) {
      throw createError(400, "Sản phẩm không tồn tại");
    }
    if (!product.stocking || product.quantity < cart_quantity) {
      throw createError(400, "Sản phẩm đã hết hàng hoặc không đủ số lượng");
    }

    // Tạo một đối tượng Cart mới sử dụng schema
    const newCart = new Cart({
      customer: {
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        phone: user.phone,
        image: user.image,
      },
      products: [product._id],
      quantity: cart_quantity,
    });

    // Lưu đối tượng Cart vào cơ sở dữ liệu
    const savedCart = await newCart.save();

    if (!savedCart) {
      throw createError(400, "Có gì đó xảy ra trong lúc tạo giỏ hàng");
    }

    // Lưu thành công thì cập nhật lại số lượng sản phẩm tồn kho.
    const updateStocking = await Product.findOneAndUpdate(
      { _id: product._id },
      { $set: { quantity: product.quantity - cart_quantity } },
      {
        new: true,
        old_category: [],
        old_brand: null,
      }
    );

    if (!updateStocking) {
      throw createError(
        400,
        "Có gì đó xảy ra trong lúc cập nhập số lượng tồn kho"
      );
    }

    // Cập nhật giỏ hàng vừa tạo cho khách hàng.
    const savedCartToCustomer = await Customer.findByIdAndUpdate(
      user._id,
      { $push: { carts: savedCart._id } },
      { new: true }
    );

    if (!savedCartToCustomer) {
      throw createError(
        400,
        "Có gì đó xảy ra trong lúc thêm giỏ hàng cho khách hàng"
      );
    }

    res.status(200).json({
      success: true,
      message: "Tạo giỏ hành thành công",
      cart: savedCart,
    });
  } catch (err) {
    next(err);
  }
};
