import Cart from "../models/Cart.js";
import Customer from "../models/Customer.js";
import Product from "../models/Product.js";
import { createError } from "../utils/error.js";

// CREATE CART
export const createCart = async (req, res, next) => {
  try {
    // Validate
    if (!req.body.product || req.body.product === "") {
      throw createError(400, "Cần thông tin sản phẩm");
    }
    if (!req.body.quantity || req.body.quantity === "") {
      throw createError(400, "Cần số lượng sản phẩm");
    }

    // Check user
    const userId = req.params.userid;
    const user = await Customer.findById(userId).where({ status: "active" });
    if (!user) {
      throw createError(400, "Không tìm thấy khách hàng");
    }

    // Check cart, only one cart create on one times
    const isCartExisted = await Cart.find({ customer: user._id }).where({
      status: "active",
    });
    if (isCartExisted.length > 0) {
      return res.status(200).json({
        success: false,
        message: "Khách hàng đã có giỏ hàng",
        cart: isCartExisted[0],
      });
    }

    // Check product
    const productId = req.body.product;
    const product = await Product.findById(productId).where({
      status: "active",
    });
    if (!product) {
      throw createError(400, "Sản phẩm không tồn tại hoặc không khả dụng");
    }
    if (!product.stocking) {
      throw createError(400, "Sản phẩm đã hết hàng");
    }

    const cart_quantity = req.body.quantity;

    // Save data
    const newCart = new Cart({
      customer: user._id,
      items: [
        {
          product_id: product._id,
          product_name: product.product_name,
          product_thumbnails: product.product_thumbnails,
          product_brand: product.product_brand,
          price: product.price,
          quantity: cart_quantity,
        },
      ],
    });

    const savedCart = await newCart.save();

    if (!savedCart) {
      throw createError(400, "Có gì đó xảy ra trong lúc tạo giỏ hàng");
    }

    res.status(200).json({
      success: true,
      message: "Tạo giỏ hàng thành công",
      cart: savedCart,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE CART
export const updateCart = async (req, res, next) => {
  try {
    // Validate
    if (!req.body.product || req.body.product === "") {
      throw createError(400, "Cần thông tin sản phẩm");
    }
    if (!String(req.body.quantity) || req.body.quantity === "") {
      throw createError(400, "Cần số lượng sản phẩm");
    }

    // Check user
    const userId = req.params.userid;
    const user = await Customer.findById(userId).where({ status: "active" });
    if (!user) {
      throw createError(400, "Không tìm thấy khách hàng");
    }

    // Check cart
    const cartId = req.params.cartid;
    const cart = await Cart.findById(cartId).where({
      status: "active",
    });
    if (!cart) {
      throw createError(400, "Không tìm thấy giỏ hàng");
    }

    // Check product
    const productId = req.body.product;
    const product = await Product.findById(productId).where({
      status: "active",
    });
    if (!product) {
      throw createError(400, "Sản phẩm không tồn tại hoặc không khả dụng");
    }
    if (!product.stocking) {
      throw createError(400, "Sản phẩm đã hết hàng");
    }

    // Start update
    // Nếu product đã tồn tại trong cart thì update số lượng.
    // Nếu product chưa tồn tại thì thêm mới.
    const cart_quantity = req.body.quantity;

    const checkProductExistedInCart = cart.items.some(
      (item, index) => item.product_id.toString() === product._id.toString()
    );

    let updateData;
    if (checkProductExistedInCart) {
      // Same product -> update quantity
      updateData = await Cart.findOneAndUpdate(
        { _id: cart._id, "items.product_id": product._id },
        { $inc: { "items.$.quantity": cart_quantity } },
        { new: true }
      );

      // If quantity after update <= 0 -> remove it
      if (updateData && updateData.items.some((item) => item.quantity <= 0)) {
        updateData = await Cart.findOneAndUpdate(
          { _id: cart._id, "items.product_id": product._id },
          { $pull: { items: { product_id: product._id } } },
          { new: true }
        );
      }
    } else {
      // Add new product to cart
      if (cart_quantity <= 0) {
        throw createError(400, "Số lượng phải lớn hơn 0");
      }
      updateData = await Cart.findOneAndUpdate(
        { _id: cart._id },
        {
          $push: {
            items: {
              product_id: product._id,
              product_name: product.product_name,
              product_thumbnails: product.product_thumbnails,
              product_brand: product.product_brand,
              price: product.price,
              quantity: cart_quantity,
            },
          },
        },
        { new: true }
      );
    }

    if (!updateData) {
      throw createError(400, "Có gì đó xảy ra trong lúc cập nhập giỏ hàng");
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật giỏ hàng thành công",
      cart: updateData,
    });
  } catch (err) {
    next(err);
  }
};

// REMOVE CART
export const removeCart = async (req, res, next) => {
  try {
    // Validate
    if (!req.body.product || req.body.product === "") {
      throw createError(400, "Cần thông tin sản phẩm");
    }

    // Check user
    const userId = req.params.userid;
    const user = await Customer.findById(userId).where({ status: "active" });
    if (!user) {
      throw createError(400, "Không tìm thấy khách hàng");
    }

    // Check cart
    const cartId = req.params.cartid;
    const cart = await Cart.findById(cartId).where({
      status: "active",
    });
    if (!cart) {
      throw createError(400, "Không tìm thấy giỏ hàng");
    }

    // Check product
    const productId = req.body.product;
    const product = await Product.findById(productId).where({
      status: "active",
    });
    if (!product) {
      throw createError(400, "Sản phẩm không tồn tại hoặc không khả dụng");
    }

    // Start remove.
    const checkProductExistedInCart = cart.items.some((item, index) =>
      item.product_id.equals(product._id)
    );

    let updateData;
    if (checkProductExistedInCart) {
      updateData = await Cart.findOneAndUpdate(
        { "items.product_id": product._id },
        { $pull: { items: { product_id: product._id } } },
        { new: true }
      );
    } else {
      throw createError(400, "Sản phẩm không tồn tại trong giỏ hàng");
    }

    if (!updateData) {
      throw createError(400, "Có gì đó xảy ra trong lúc cập nhật giỏ hàng");
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật giỏ hàng thành công",
      cart: updateData,
    });
  } catch (err) {
    next(err);
  }
};

// GET ONE CART
export const getCart = async (req, res, next) => {
  try {
    // Check user
    const userId = req.params.userid;
    const user = await Customer.findById(userId).where({ status: "active" });
    if (!user) {
      throw createError(400, "Không tìm thấy khách hàng");
    }

    // Check cart
    const cart = await Cart.findOne({ status: "active" }).populate({
      path: "customer",
      select: ["fname", "lname", "email", "address", "phone"],
    });
    if (!cart) {
      return res
        .status(200)
        .json({ success: false, message: "Không tìm thấy giỏ hàng" });
    }
    if (cart.items.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "Giỏ hàng trống" });
    }

    const { __v, ...others } = cart._doc;

    res.status(200).json({
      success: true,
      message: "Lấy giỏ hàng thành công",
      cart: others,
    });
  } catch (err) {
    next(err);
  }
};
