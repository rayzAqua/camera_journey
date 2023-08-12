import express from "express";
import {
  verifyManager,
  verifyStaff,
  verifyToken,
} from "../middlewares/verifyToken.js";
import {
  deleteCustomerAccount,
  getCustomer,
  getCustomers,
  recoverCustomerAccount,
  updateInformation,
} from "../controllers/customer_controller.js";

const router = express.Router();

// UPDATE
router.put("/:userid/:id", verifyToken, updateInformation);

// SOFT DELETE
router.delete("/:userid/:id", verifyManager, deleteCustomerAccount);

// RE-ACTIVE PRODUCT
router.patch("/:userid/:id", verifyManager, recoverCustomerAccount);

// GET ONE
router.get("/:userid/:id", verifyToken, getCustomer);

// GET ALL
router.get("/:userid/", verifyStaff, getCustomers);

export default router;
