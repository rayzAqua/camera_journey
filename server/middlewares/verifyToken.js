import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
  const token_string = req.headers.authorization;

  // Check existed token: undefine or ""
  if (!token_string || token_string === "") {
    return next(createError(400, "Empty access token"));
  }

  // if token is not empty
  const jwt_token = token_string.split(" ")[1];

  // Check valid token
  jwt.verify(jwt_token, process.env.JWT_SECRET, (err, userInfo) => {
    // if token isn't correct
    if (err) return next(createError(400, "Invalid token"));

    // Check id before check role
    const userIdFromToken = userInfo._id; // id from jwt
    const userIdFromRequest = req.params.userid; // id from req
    if (!(userIdFromRequest === userIdFromToken)) {
      return next(
        createError(400, "You don't have permission to access this resource")
      );
    }

    // If id is correct - next to role middleware
    req.user = userInfo;
    console.log("Verify Token (ALL ROLE)");
    next();
  });
};

export const verifyStaff = (req, res, next) => {
  verifyToken(req, res, (err) => {
    // If have error from previous middleware
    if (err) {
      return next(err);
    }

    // Manager can do what ever staff do
    if (req.user.role === "staff" || req.user.role === "manager") {
      console.log("Staff verified!");
      next();
    } else {
      return next(createError(400, "You aren't authorized to staff"));
    }
  });
};

export const verifyManager = (req, res, next) => {
  verifyToken(req, res, (err) => {
    // If have error from previous middleware
    if (err) {
      return next(err);
    }

    // Only manager can do
    if (req.user.role === "manager") {
      console.log("Manager verified!");
      next();
    } else {
      return next(createError(400, "You aren't authorized to manager"));
    }
  });
};
