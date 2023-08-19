import express from "express";
import {
  verifyStaff,
  verifyManager,
  verifyToken,
} from "../middlewares/verifyToken.js";
import {
  deleteUserAccount,
  getUser,
  getUsers,
  recoverUserAccount,
  updateInformation,
} from "../controllers/user_controllers.js";

const router = express.Router();

// UPDATE
router.put("/:userid/:id", verifyStaff, updateInformation);

// SOFT DELETE
router.delete("/:userid/:id", verifyManager, deleteUserAccount);

// RE-ACTIVE PRODUCT
router.patch("/:userid/:id", verifyManager, recoverUserAccount);

// GET ONE
router.get("/:userid/:id", verifyStaff, getUser);

// GET ALL
router.get("/:userid/", verifyStaff, getUsers);

export default router;
