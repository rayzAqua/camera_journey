import Brand from "../models/Brand.js";
import Product from "../models/Product.js";
import { createError } from "../utils/error.js";

// CREATE
export const newBrand = async (req, res, next) => {
  try {
    const brand_name = req.body.brand_name;

    // Validate
    if (!brand_name || brand_name === "") {
      throw createError(400, "Brand of product is Required");
    }

    // Check existed product
    const isExisted = await Brand.findOne({
      brand_name: brand_name,
    });

    // console.log(isExisted);

    if (isExisted) {
      throw createError(400, "Brand is existed");
    }

    const newBrand = new Brand({
      brand_name: brand_name,
    });

    const savedBrand = await newBrand.save();

    res.status(200).json({
      success: true,
      message: "Create new brand successfully",
      brand: savedBrand,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE
export const updateBrand = async (req, res, next) => {
  try {
    const brandId = req.params.brandid;

    if (req.body.brand_name === "") {
      throw createError(400, "Empty string");
    }

    const brand = await Brand.findById(brandId);
    if (!brand) {
      throw createError(400, "Brand isn't existed");
    }
    const isDuplicate = await Brand.findOne({
      brand_name: req.body.brand_name,
    });
    if (isDuplicate) {
      throw createError(400, "Brand is existed");
    }

    const updatedBrand = await Brand.findOneAndUpdate(
      { _id: brand._id },
      { $set: req.body },
      { new: true }
    );

    if (!updatedBrand) {
      throw createError(500, "Something is wrong when update brand");
    }

    // push update Category to Products
    await Product.updateMany(
      { _id: { $in: brand.products } },
      { $set: { product_brand: updatedBrand.brand_name } }
    );

    res.status(200).json({
      success: true,
      message: "Update brand successfully",
      brand: updatedBrand,
    });
  } catch (err) {
    next(err);
  }
};

// GET ONE
export const getBrand = async (req, res, next) => {
  try {
    const brandId = req.params.brandid;

    const brand = await Brand.findById(brandId).populate({
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
    if (!brand) {
      throw createError(400, "Brand isn't existed");
    }

    res.status(200).json({
      success: true,
      message: "Get brand successfully",
      brand: brand,
    });
  } catch (err) {
    next(err);
  }
};

// GET ALL
export const getBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find().populate({
      path: "products",
      select: ["_id", "product_name", "product_brand", "product_category"],
      match: { status: "active" },
    });
    if (brands.length === 0) {
      throw createError(400, "No brand found");
    }

    res.status(200).json({
      success: true,
      message: "Get all brand successfully",
      brand: brands,
    });
  } catch (err) {
    next(err);
  }
};
