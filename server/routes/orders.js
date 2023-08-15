import express from "express";
import {
  createOrder,
  getCustomerOrders,
  getOrder,
  getOrders,
  updateOrder,
} from "../controllers/order_controllers.js";
import {
  verifyStaff,
  verifyManager,
  verifyToken,
} from "../middlewares/verifyToken.js";

const router = express.Router();

// CREATE
router.post("/:userid/", verifyToken, createOrder);

// UPDATE
router.put("/:userid/:orderid", verifyStaff, updateOrder);

// GET ONE
router.get("/:userid/id=:orderid", verifyStaff, getOrder);

// GET ALL
router.get("/:userid/", verifyStaff, getOrders);

// GET ALL OF CUSTOMER
router.get("/:userid/:customerid/", verifyToken, getCustomerOrders);

export default router;
