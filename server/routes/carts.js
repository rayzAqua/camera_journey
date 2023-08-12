import express from "express";
import { createCart } from "../controllers/cart_controllers.js";
import {
  verifyStaff,
  verifyManager,
  verifyToken,
} from "../middlewares/verifyToken.js";

const router = express.Router();

// CREATE
router.post("/:userid/", verifyToken, createCart);

// UPDATE
router.put("/:userid/:cartid", verifyToken);

// GET ONE
router.get("/:userid/:cartid", verifyToken);

// GET ALL
router.get("/:userid/", verifyStaff);

export default router;
