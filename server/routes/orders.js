import express from "express";
import {
  verifyStaff,
  verifyManager,
  verifyToken,
} from "../middlewares/verifyToken.js";

const router = express.Router();

// CREATE
router.post("/:userid/", verifyManager);

// UPDATE
router.put("/:userid/", verifyManager);

// GET ONE
router.get("/:userid/", verifyManager);

// GET ALL
router.get("/:userid/", verifyManager);

export default router;
