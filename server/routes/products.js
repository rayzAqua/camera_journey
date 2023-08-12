import express from "express";
import {
  recoverProduct,
  deleteProduct,
  getProduct,
  getProducts,
  newProduct,
  updateProduct,
} from "../controllers/product_controller.js";
import {
  verifyStaff,
  verifyManager,
  verifyToken,
} from "../middlewares/verifyToken.js";

const router = express.Router();

// CREATE
router.post("/:userid/", verifyManager, newProduct);

// UPDATE
router.put("/:userid/:productid", verifyManager, updateProduct);

// SOFT DELETE
router.delete("/:userid/:productid", verifyManager, deleteProduct);

// RE-ACTIVE PRODUCT
router.patch("/:userid/:productid", verifyManager, recoverProduct);

// GET ONE
router.get("/:productid", getProduct);

// GET ALL
router.get("/", getProducts);

export default router;
