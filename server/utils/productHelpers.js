import Brand from "../models/Brand.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import ProductPriceHistory from "../models/ProductPriceHistory.js";

// Delete product - only use when error in create method.
export const deleteProduct = async function (productId) {
  await Product.findOneAndDelete(productId);
};

// Create new price history.
export const newPriceHistory = async function (productId, price) {
  await new ProductPriceHistory({
    product: productId,
    price: price,
    modified_at: new Date(),
  }).save();
};

// Delete price history - only use when error in create method.
export const deletePriceHistory = async function (productId) {
  await ProductPriceHistory.findOneAndDelete({ product: productId });
};

// Update new product id to product category.
export const insertProductToCategory = async function (categories, productId) {
  await Category.updateMany(
    { category_name: { $in: categories } },
    { $push: { products: productId } }
  );
};

// Update new product id to product brand.
export const insertProductToBrand = async function (brand, productId) {
  await Brand.findOneAndUpdate(
    { brand_name: brand },
    { $push: { products: productId } }
  );
};

// Update new product id to product category.
export const deleteProductFromCategory = async function (
  categories,
  productId
) {
  await Category.updateMany(
    { category_name: { $in: categories } },
    { $pull: { products: productId } }
  );
};

// Update new product id to product brand.
export const deleteProductFromBrand = async function (brand, productId) {
  await Brand.findOneAndUpdate(
    { brand_name: brand },
    { $pull: { products: productId } }
  );
};

//Check new quantity is 0
export const caculateNewQuantityFromInc = async function (
  newQuantity,
  productId
) {
  const product = await Product.findOne({ _id: productId });
  return product.quantity + newQuantity;
};
