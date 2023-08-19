import mongoose from "mongoose";
import {
  deleteProductFromBrand,
  deleteProductFromCategory,
  insertProductToBrand,
  insertProductToCategory,
  newPriceHistory,
  deleteProduct,
  deletePriceHistory,
  caculateNewQuantityFromInc,
} from "../utils/productHelpers.js";
import { createError } from "../utils/error.js";

const ProductSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumbnails: {
      type: [String],
      required: true,
    },
    product_brand: {
      type: String,
      required: true,
    },
    product_category: {
      type: [String],
      required: true,
    },
    // Nếu kịp thì làm thêm bảng kế hoạch giá
    price: {
      type: String,
      min: 0,
      required: true,
    },
    quantity: {
      type: Number,
      min: 0,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    details: {
      type: Object,
    },
    stocking: {
      type: Boolean,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Create index for db
ProductSchema.index({ product_brand: 1, product_name: 1 }, { unique: true });

// Check quantity before save product into db
ProductSchema.pre("save", async function () {
  if (this.quantity === 0) {
    this.stocking = false;
  } else {
    this.stocking = true;
  }
});

// Update other infomation into other collections after create successful
ProductSchema.post("save", async function (results) {
  try {
    // Saved price to history after saved product success
    await newPriceHistory(results._id, results.price);
    // Insert new product id to category and brand document
    await Promise.all([
      insertProductToCategory(results.product_category, results._id),
      insertProductToBrand(results.product_brand, results._id),
    ]);
  } catch (err) {
    // Remove Product and PriceInHistory if having error
    await Promise.all([
      deleteProduct(results._id),
      deletePriceHistory(results._id),
    ]);

    // Remove new product id from category and brand document if having error
    await Promise.all([
      deleteProductFromCategory(results.product_category, results._id),
      deleteProductFromBrand(results.product_brand, results._id),
    ]);
    throw createError(400, err.message);
  }
});

// Update quantity before complete update session
ProductSchema.pre("findOneAndUpdate", async function () {
  let new_quantity;

  if (this.getUpdate().$set && this.getUpdate().$set.quantity !== undefined) {
    new_quantity = this.getUpdate().$set.quantity;
  } else if (
    this.getUpdate().$inc &&
    this.getUpdate().$inc.quantity !== undefined
  ) {
    new_quantity = await caculateNewQuantityFromInc(
      this.getUpdate().$inc.quantity,
      this.getFilter()._id
    );
  }

  console.log(new_quantity);

  if (new_quantity !== undefined) {
    console.log("okkkkk");
    this._update.$set.stocking = String(new_quantity) !== "0";
    console.log(this._update.$set);
  }
});

// Update product id in category and brand after update product successfully with category and brand existed
ProductSchema.post("findOneAndUpdate", async function (results) {
  if (this.getOptions().query_method !== "findByIdAndUpdate") {
    // Get product id from result of update
    const productId = results._id;

    // Get new category and brand from result of update
    const new_category = results.product_category;
    const new_brand = results.product_brand;
    console.log(new_category);
    console.log(new_brand);

    // Get old category and brand from options of update
    const old_category = this.getOptions().old_category;
    const old_brand = this.getOptions().old_brand;
    console.log(old_category);
    console.log(old_brand);

    // If is category update update product id to new and remove from old
    if (
      new_category.length !== 0 &&
      old_category.length !== 0 &&
      (!new_category.every((item, index) => item === old_category[index]) ||
        new_category.length !== old_category.length)
    ) {
      console.log("Category");
      await deleteProductFromCategory(old_category, productId);
      await insertProductToCategory(new_category, productId);
    }

    // If is brand update, update product id to new and remove from old
    if (new_brand && old_brand && new_brand !== old_brand) {
      console.log("Brand");
      await deleteProductFromBrand(old_brand, productId);
      await insertProductToBrand(new_brand, productId);
    }
  }
});

// Check status before find products - only find product having status equal to active
ProductSchema.pre("find", function (next) {
  this.where({ status: "active" });
  next();
});

export default mongoose.model("Product", ProductSchema);
