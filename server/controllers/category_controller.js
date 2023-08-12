import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { createError } from "../utils/error.js";

// CREATE
export const newCategory = async (req, res, next) => {
  try {
    const category_name = req.body.category_name;

    // Validate
    if (!category_name || category_name === "") {
      throw createError(400, "Category of product is Required");
    }

    // Check existed product
    const isExisted = await Category.findOne({
      category_name: category_name,
    });

    // console.log(isExisted);

    if (isExisted) {
      throw createError(400, "Category is existed");
    }

    const newCategory = new Category({
      category_name: category_name,
    });

    const savedCategory = await newCategory.save();

    res.status(200).json({
      success: true,
      message: "Create new category successfully",
      category: savedCategory,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE
export const updateCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryid;

    if (req.body.category_name === "") {
      throw createError(400, "Empty string");
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      throw createError(400, "Category isn't existed");
    }
    const isDuplicate = await Category.findOne({
      category_name: req.body.category_name,
    });
    if (isDuplicate) {
      throw createError(400, "Category is existed");
    }

    // pull current Category to Products

    await Product.updateMany(
      { _id: { $in: category.products } },
      { $pull: { product_category: category.category_name } }
    );

    const updatedCategory = await Category.findOneAndUpdate(
      { _id: category._id },
      { $set: req.body },
      { new: true }
    );

    if (!updatedCategory) {
      throw createError(500, "Something is wrong when update category");
    }

    // push update Category to Products
    await Product.updateMany(
      { _id: { $in: category.products } },
      { $push: { product_category: updatedCategory.category_name } }
    );

    res.status(200).json({
      success: true,
      message: "Update category successfully",
      category: updatedCategory,
    });
  } catch (err) {
    next(err);
  }
};

// GET ONE
export const getCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.categoryid;

    const category = await Category.findById(categoryId).populate({
      path: "products",
      select: [
        "_id",
        "product_name",
        "product_thumbnails",
        "product_brand",
        "product_category",
        "price",
        "stocking",
      ],
      match: { status: "active" },
    });
    if (!category) {
      throw createError(400, "Category isn't existed");
    }

    res.status(200).json({
      success: true,
      message: "Get category successfully",
      category: category,
    });
  } catch (err) {
    next(err);
  }
};

// GET ALL
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().populate({
      path: "products",
      select: [
        "_id",
        "product_name",
        "product_thumbnails",
        "product_brand",
        "product_category",
        "price",
        "stocking",
      ],
      match: { status: "active" },
    });
    if (categories.length === 0) {
      throw createError(400, "No category found");
    }

    res.status(200).json({
      success: true,
      message: "Get all category successfully",
      category: categories,
    });
  } catch (err) {
    next(err);
  }
};
