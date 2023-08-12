import express from "express";
import {
  getCategories,
  getCategory,
  newCategory,
  updateCategory,
} from "../controllers/category_controller.js";
import {
  verifyStaff,
  verifyManager,
  verifyToken,
} from "../middlewares/verifyToken.js";

const router = express.Router();

// CREATE
router.post("/:userid/", verifyManager, newCategory);

// UPDATE
router.put("/:userid/:categoryid", verifyManager, updateCategory);

// GET ONE
router.get("/:categoryid", getCategory);

// GET ALL
router.get("/", getCategories);

export default router;
