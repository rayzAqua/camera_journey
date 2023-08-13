import express from "express";
import {
  createCart,
  getCart,
  removeCart,
  updateCart,
} from "../controllers/cart_controllers.js";
import {
  verifyStaff,
  verifyManager,
  verifyToken,
} from "../middlewares/verifyToken.js";

const router = express.Router();

// CREATE
router.post("/:userid/", verifyToken, createCart);

// UPDATE
router.put("/:userid/:cartid", verifyToken, updateCart);

// REMOVE
router.delete("/:userid/:cartid", verifyToken, removeCart);

// GET ONE
router.get("/:userid/", verifyToken, getCart);

export default router;
