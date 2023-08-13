import Cart from "../models/Cart.js";
import Customer from "../models/Customer.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { createError } from "../utils/error.js";

export const createOrder = async (req, res, next) => {
  try {
    // Validate
    if (!req.body.cartId || req.body.cartId === "") {
      throw createError(400, "Cần thông tin giỏ hàng");
    }

    // Check user
    const userId = req.params.userid;
    const user = await Customer.findById(userId).where({ status: "active" });
    if (!user) {
      throw createError(400, "Không tìm thấy khách hàng");
    }

    // Check cart - find cart with inactive statuc because it is not payment
    const cartId = req.body.cartId;
    const cart = await Cart.findById(cartId).where({ status: "active" });
    if (!cart) {
      throw createError(400, "Không tìm thấy giỏ hàng");
    }

    // Process quantity
    await Promise.all(
      cart.items.map(async (item) => {
        const productInCart = await Product.findById(item.product_id);
        if (productInCart.quantity < item.quantity) {
          throw createError(
            400,
            `Số lượng sản phẩm ${productInCart.product_name} không đủ. Hiện chỉ còn ${productInCart.quantity}`
          );
        }
      })
    );

    // Save start
    const customer = {
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      phone: user.phone,
    };

    // Total price
    const total = cart.items.reduce((accu, curr) => {
      return accu + curr.quantity * Number(curr.price);
    }, 0);

    console.log(total);

    const newOrder = new Order({
      customer: customer,
      cart: cart._id,
      shipping_address: user.address,
      total: total,
    });

    const savedOrder = await newOrder.save();

    // Update cart status to inactive
    await Cart.findByIdAndUpdate(cart._id, { $set: { status: "inactive" } });
    // update to customer
    await Customer.findByIdAndUpdate(user._id, {
      $push: { orders: savedOrder._id },
    });

    // Update product quantity
    await Promise.all(
      cart.items.map(async (item) => {
        const { product_id, quantity } = item;
        // Assuming the Product model has a field named "quantity"
        await Product.updateOne(
          { _id: product_id },
          { $inc: { quantity: -quantity } }
        );
      })
    );

    res.status(200).json({
      success: true,
      message: "Đặt hàng thành công",
      order: savedOrder,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE ORDER
export const updateOrder = async (req, res, next) => {
  try {
    if (!req.body.status || req.body.status === "") {
      throw createError(400, "Cần thông tin trạng thái");
    }

    // Check user
    const userId = req.params.userid;
    const user = await User.findById(userId).where({ status: "active" });
    if (!user) {
      throw createError(400, "Không tìm thấy nhân viên");
    }

    // Check order
    const orderId = req.params.orderid;
    const order = await Order.findOne({
      _id: orderId,
    }).where({ status: { $nin: ["complete", "cancel"] } });
    if (!order) {
      throw createError(400, "Không tìm thấy đơn đặt");
    }

    const status = req.body.status;

    const statusTransition = {
      pending: ["process", "cancel"],
      process: ["shipping", "cancel"],
      shipping: ["complete", "cancel"],
    };

    if (
      !statusTransition[order.status] ||
      !statusTransition[order.status].includes(status)
    ) {
      throw createError(
        400,
        `Không thể thay đổi trạng thái từ ${order.status} đến ${status}`
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      { _id: order._id },
      {
        $set: { status: status },
        $push: {
          staff: {
            fname: user.fname,
            lname: user.lname,
          },
        },
      },
      { new: true }
    );

    if (!updatedOrder) {
      throw createError(400, "Có gì đó xảy ra trong lúc sửa đơn hàng");
    }

    res.status(200).json({
      success: true,
      message: "Cập nhật trạng thái đơn hàng thành công",
      order: updatedOrder,
    });
  } catch (err) {
    next(err);
  }
};

// GET ONE ORDER
export const getOrder = async (req, res, next) => {
  try {
    // Check role
    const role = req.query.role;
    if (!role || role === "") {
      throw createError(400, "Cần thông tin chức danh người dùng");
    }

    // Check user
    const userId = req.params.userid;
    let user;
    if (role === "customer") {
      user = await Customer.findById(userId).where({ status: "active" });
      if (!user) {
        throw createError(400, "Không tìm thấy khách hàng");
      }
    }
    if (role === "staff") {
      user = await User.findById(userId).where({ status: "active" });
      if (!user) {
        throw createError(400, "Không tìm thấy nhân viên");
      }
    }

    // Check order
    const orderId = req.params.orderid;
    const order = await Order.findById({ _id: orderId }).populate({
      path: "cart",
      select: "items",
    });
    if (!order) {
      throw createError(400, "Không tìm thấy đơn đặt");
    }

    const cartDetails = order.cart.items.map((item) => item);
    const {
      __v,
      cart,
      _id,
      customer,
      shipping_address,
      staff,
      payment,
      ...others
    } = order._doc;
    const orderDetails = {
      _id: _id,
      customer: customer,
      shipping_address: shipping_address,
      cart: cartDetails,
      payment: payment,
      ...others,
    };

    res.status(200).json({
      success: true,
      message: "Lấy thông tin đơn đặt thành công",
      order: orderDetails,
    });
  } catch (err) {
    next(err);
  }
};

// GET ALL
export const getOrders = async (req, res, next) => {
  try {
    // Check user
    const userId = req.params.userid;
    const user = await User.findById(userId).where({ status: "active" });
    if (!user) {
      throw createError(400, "Không tìm thấy nhân viên");
    }

    const orders = await Order.find().populate({
      path: "cart",
      select: "items",
    });
    if (orders.length === 0) {
      throw createError(400, "Không tìm thấy đơn đặt nào cả");
    }

    const orderLists = orders.map((order) => {
      const cartDetails = order.cart.items.map((item) => {
        const { _id, product_thumbnails, product_brand, ...others } = item._doc;
        return others;
      });
      const {
        __v,
        cart,
        _id,
        customer,
        shipping_address,
        staff,
        payment,
        ...others
      } = order._doc;
      const staffDetails = staff.map((item) => {
        const { _id, ...staff } = item._doc;
        return staff;
      });
      return {
        _id: _id,
        customer: {
          fname: customer.fname,
          lname: customer.lname,
        },
        cart: cartDetails,
        payment: payment,
        staff: staffDetails,
        ...others,
      };
    });

    res.status(200).json({
      success: true,
      message: "Lấy toàn bộ thông tin đơn đặt thành công",
      order: orderLists,
    });
  } catch (err) {
    next(err);
  }
};

// GET ALL ORDER OF CUSTOMER
export const getCustomerOrders = async (req, res, next) => {
  try {
    // Check user
    const userId = req.params.customerid;
    const user = await Customer.findById(userId).where({ status: "active" });
    if (!user) {
      throw createError(400, "Không tìm thấy khách hàng");
    }

    const customerOrders = await Customer.findById(user._id).populate({
      path: "orders",
      select: [
        "_id",
        "cart",
        "total",
        "staff",
        "status",
        "createdAt",
        "updatedAt",
      ],
    });
    if (customerOrders.orders.length === 0) {
      throw createError(400, "Không tìm thấy đơn đặt nào cả");
    }

    // Định dạng lại dữ liệu customer
    const {
      password,
      sexual,
      phone,
      image,
      status,
      verified,
      createdAt,
      updatedAt,
      __v,
      birthDate,
      address,
      _id,
      orders,
      ...otherDetails
    } = customerOrders._doc;

    const orderLists = await Promise.all(
      customerOrders.orders.map(async (order) => {
        // Truy vấn đến tất cả order có trong orders của Customer.
        const orderDetails = await Order.findById(order._id).populate({
          path: "cart",
          select: "items",
        });
        // Check query results.
        if (orderDetails.length === 0) {
          throw createError(400, "Không tìm thấy đơn đặt nào cả");
        }
        // Duyệt qua từng item trong giỏ hàng và định dạng lại dữ liệu.
        const cartDetails = orderDetails.cart.items.map((item) => {
          const { _id, product_thumbnails, product_brand, ...others } =
            item._doc;
          return others;
        });
        // Detruction dữ liệu của mỗi order và tổ chức lại.
        const {
          __v,
          cart,
          _id,
          customer,
          shipping_address,
          staff,
          payment,
          createdAt,
          updatedAt,
          ...others
        } = orderDetails._doc;
        // Loại bỏ trường _id khỏi thông tin nhân viên.
        const staffDetails = staff.map((item) => {
          const { _id, ...staff } = item._doc;
          return staff;
        });
        // Tổ chức lại dữ liệu.
        return {
          _id: _id,
          cart: cartDetails,
          staff: staffDetails,
          ...others,
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Lấy toàn bộ thông tin đơn đặt của khách hàng thành công",
      order: {
        _id: _id,
        ...otherDetails,
        address: address,
        orders: orderLists,
      },
    });
  } catch (err) {
    next(err);
  }
};
