import User from "../models/User.js";
import { createError } from "../utils/error.js";
import { createRegex } from "../utils/regex.js";

// UPDATE
export const updateInformation = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).where({
      status: "active",
    });
    if (!user) {
      throw createError(400, "User isn't existed");
    }
    // Validate (email can't change, password, status will process in other module, role, verified only manager can impact)
    if (req.body.email) {
      throw createError(400, "Email update can't allowed");
    }
    if (req.body.password) {
      throw createError(400, "Password update can't allowed");
    }
    if (req.body.role && req.user.role === "staff") {
      throw createError(400, "You don't have permission to update role");
    }
    if (req.body.verified && req.user.role === "staff") {
      throw createError(400, "You don't have permission to update verified");
    }
    if (req.body.status) {
      throw createError(400, "Status update can't allowed");
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedUser) {
      throw createError(500, "Something is wrong when update user!");
    }

    res.status(200).json({
      success: true,
      message: "Update user successfully",
      user: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE
export const deleteUserAccount = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      throw createError(400, "User isn't existed");
    }

    if (user.status === "inactive") {
      throw createError(400, "User already deleted");
    }

    if (String(user._id) === req.params.userid) {
      throw createError(400, "You can't delete yourself");
    }

    const deletedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: { status: "inactive" } },
      { new: true }
    );

    if (!deletedUser) {
      throw createError(500, "Something is wrong when delete user!");
    }

    res.status(200).json({
      success: true,
      message: "Delete user successfully",
      user: deletedUser,
    });
  } catch (err) {
    next(err);
  }
};

// RECOVER
export const recoverUserAccount = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      throw createError(400, "User isn't existed");
    }

    if (user.status === "active") {
      throw createError(400, "User already recovered");
    }

    const activedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: { status: "active" } },
      { new: true }
    );

    if (!activedUser) {
      throw createError(500, "Something is wrong when recover user!");
    }

    res.status(200).json({
      success: true,
      message: "Recover user successfully",
      user: activedUser,
    });
  } catch (err) {
    next(err);
  }
};

// GET ONE
export const getUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).where({
      status: "active",
    });
    if (!user) {
      throw createError(400, "User isn't existed");
    }

    const { __v, status, password, ...others } = user._doc;

    res.status(200).json({
      success: true,
      message: "Get user successfully",
      user: others,
    });
  } catch (err) {
    next(err);
  }
};

// GET ALL
export const getUsers = async (req, res, next) => {
  try {
    // Key for search
    const key = createRegex(req.query.key);
    const limit = parseInt(req.query.limit);

    if (limit <= 0) {
      throw createError(400, "Limit must be positive number");
    }

    const users = await User.find({
      $or: [
        { fname: { $regex: key, $options: "im" } },
        { lname: { $regex: key, $options: "im" } },
        { email: { $regex: key, $options: "im" } },
        { sexual: { $regex: key, $options: "im" } },
        { phone: { $regex: key, $options: "im" } },
        { role: { $regex: key, $options: "im" } },
      ],
    }).limit(limit);

    const userArray = Array.isArray(users) ? users : [users];

    const response = {
      success: true,
      message: "Get all user successfully",
    };

    if (userArray.length !== 0) {
      const userLists = userArray.map((user) => {
        const { __v, status, updatedAt, password, ...others } = user._doc;
        return others;
      });

      response.user = userLists;
    } else {
      response.message = "No user found";
      response.user = userArray;
    }

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
