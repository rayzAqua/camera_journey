import express from "express";
import {
  changePassword,
  customerLogin,
  customerRegister,
  forgetPassword,
  recoverManagerAccount,
  resetPasswordForget,
  staffLogin,
  staffRegister,
  verifyAccount,
} from "../controllers/auth_controllers.js";
import {
  verifyStaff,
  verifyManager,
  verifyToken,
} from "../middlewares/verifyToken.js";

const router = express.Router();

// LOGIN FOR CUSTOMER
router.post("/customer-login", customerLogin);

// REGISTER FOR CUSTOMER
router.post("/customer-register", customerRegister);

// lOGIN FOR STAFF
router.post("/staff-login", staffLogin);

// REGISTER FOR STAFF
router.post("/:userid/staff-register", verifyManager, staffRegister);

// RECOVERMANGER ACCOUNT
router.post("/recover-manager", recoverManagerAccount);

// VERIFIED ACCOUNT
router.get("/:id/verify/:token", verifyAccount);

// CHANGE PASSWORD
router.post("/change-password", changePassword);

// FORGET PASSWORD
router.post("/forget-password", forgetPassword);

// RESET PASSWORD
router.get("/:id/reset-password/:token", resetPasswordForget);

export default router;
