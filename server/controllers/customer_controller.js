import Customer from "../models/Customer.js";
import { createError } from "../utils/error.js";
import { createRegex } from "../utils/regex.js";

// UPDATE
export const updateInformation = async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findById(customerId).where({
      status: "active",
    });
    if (!customer) {
      throw createError(400, "Customer isn't existed");
    }
    // Validate (email can't change, password, status will process in other module, role, verified only manager can impact)
    if (req.body.email) {
      throw createError(400, "Email update can't allowed");
    }
    if (req.body.password) {
      throw createError(400, "Password update can't allowed");
    }
    if (req.body.role) {
      throw createError(400, "Role isn't existed");
    }
    console.log(req.user);
    if (req.body.verified && (!req.user || req.user.role !== "manager")) {
      throw createError(400, "You don't have permission to update verified");
    }
    if (req.body.status) {
      throw createError(400, "Status update can't allowed");
    }

    // Loại bỏ các trường có giá trị "" (rỗng) khỏi req.body
    const cleanedBody = {};
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] !== "") {
        cleanedBody[key] = req.body[key];
      }
    });

    const updatedCustomer = await Customer.findByIdAndUpdate(
      customer._id,
      { $set: cleanedBody },
      { new: true }
    );

    if (!updatedCustomer) {
      throw createError(500, "Something is wrong when update customer!");
    }

    res.status(200).json({
      success: true,
      message: "Update customer successfully",
      customer: updatedCustomer,
    });
  } catch (err) {
    next(err);
  }
};

// DELETE
export const deleteCustomerAccount = async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw createError(400, "Customer isn't existed");
    }

    if (customer.status === "inactive") {
      throw createError(400, "Customer already deleted");
    }

    const deletedCustomer = await Customer.findByIdAndUpdate(
      customer._id,
      { $set: { status: "inactive" } },
      { new: true }
    );

    if (!deletedCustomer) {
      throw createError(500, "Something is wrong when delete customer!");
    }

    res.status(200).json({
      success: true,
      message: "Delete customer successfully",
      customer: deletedCustomer,
    });
  } catch (err) {
    next(err);
  }
};

// RECOVER
export const recoverCustomerAccount = async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw createError(400, "Customer isn't existed");
    }

    if (customer.status === "active") {
      throw createError(400, "User already recovered");
    }

    const activedCustomer = await Customer.findByIdAndUpdate(
      customer._id,
      { $set: { status: "active" } },
      { new: true }
    );

    if (!activedCustomer) {
      throw createError(500, "Something is wrong when recover customer!");
    }

    res.status(200).json({
      success: true,
      message: "Recover customer successfully",
      customer: activedCustomer,
    });
  } catch (err) {
    next(err);
  }
};

// GET ONE
export const getCustomer = async (req, res, next) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findById(customerId).where({
      status: "active",
    });
    if (!customer) {
      throw createError(400, "Customer isn't existed");
    }

    const { __v, status, password, ...others } = customer._doc;

    res.status(200).json({
      success: true,
      message: "Get customer successfully",
      customer: others,
    });
  } catch (err) {
    next(err);
  }
};

// GET ALL
export const getCustomers = async (req, res, next) => {
  try {
    // Key for search
    const key = createRegex(req.query.key);
    const limit = parseInt(req.query.limit);

    if (limit <= 0) {
      throw createError(400, "Limit must be positive number");
    }

    const customers = await Customer.find({
      $or: [
        { fname: { $regex: key, $options: "im" } },
        { lname: { $regex: key, $options: "im" } },
        { email: { $regex: key, $options: "im" } },
        { sexual: { $regex: key, $options: "im" } },
        { phone: { $regex: key, $options: "im" } },
      ],
    }).limit(limit);

    const customerArray = Array.isArray(customers) ? customers : [customers];

    const response = {
      success: true,
      message: "Get all customer successfully",
    };

    if (customerArray.length !== 0) {
      const customerLists = customerArray.map((customer) => {
        const { __v, status, password, ...others } = customer._doc;
        return others;
      });

      response.customer = customerLists;
    } else {
      response.message = "No customer found";
      response.customer = customerArray;
    }

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
