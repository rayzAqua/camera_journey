import express from "express";
import {
  getBrand,
  getBrands,
  newBrand,
  updateBrand,
} from "../controllers/brand_controllers.js";
import {
  verifyStaff,
  verifyManager,
  verifyToken,
} from "../middlewares/verifyToken.js";

const router = express.Router();

// CREATE
router.post("/:userid/", verifyManager, newBrand);

// UPDATE
router.put("/:userid/:brandid", verifyManager, updateBrand);

// GET ONE
router.get("/:brandid", getBrand);

// GET ALL
router.get("/", getBrands);

export default router;
