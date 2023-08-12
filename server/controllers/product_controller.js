import Brand from "../models/Brand.js";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { createError } from "../utils/error.js";
import { caculateSkipCount, caculateTotalPage } from "../utils/page.js";
import { createRegex } from "../utils/regex.js";

// CREATE
export const newProduct = async (req, res, next) => {
  // Khi tạo sản phẩm, một thương hiệu có nhiều sản phẩm, nhưng cùng một thương hiệu mỗi sản phẩm là độc nhất.
  // Ví dụ: Brand A: Áo sơ mi trắng: Nếu thêm một sản phẩm là áo sơ mi trắng thì lúc này không thể thêm được
  //                                 áo sơ mì trắng nữa vì áo sơ mi trắng đã tồn tại.
  //        Brand B: Aó sơ mì trắng: Thêm được vì áo sơ mình trắng chỉ tồn tại ở brand A còn brand B thì chưa
  //                                 có sản phẩm áo sơ mì trắng.
  try {
    const {
      product_name,
      product_thumbnails,
      product_brand,
      product_category,
      price,
      quantity,
      desc,
      ...others
    } = req.body;

    // Validate
    if (!product_name || product_name === "") {
      throw createError(400, "Name of product is Required");
    }
    if (!product_thumbnails || product_thumbnails.length === 0) {
      throw createError(400, "Thumbnail is Required");
    }
    if (!product_brand || product_brand === "") {
      throw createError(400, "Brand is Required");
    }
    if (
      !product_category ||
      product_category === "" ||
      product_category.length === 0
    ) {
      throw createError(400, "Category is Required");
    }
    if (!price || price === "") {
      throw createError(400, "Price is Required");
    }
    console.log(!String(quantity));
    if (!String(quantity) || quantity === "") {
      throw createError(400, "Quantity is Required");
    }
    if (!desc || desc === "") {
      throw createError(400, "Describle is Required");
    }

    // Check existed product (check index)
    const isExisted = await Product.findOne({
      product_brand: product_brand,
      product_name: product_name,
    });

    // console.log(isExisted);

    if (isExisted) {
      throw createError(400, "Product is existed");
    }

    const isThumbnailExisted = await Product.findOne({
      product_thumbnails: { $in: product_thumbnails },
    });

    // console.log(isThumbnailExisted);

    if (isThumbnailExisted) {
      throw createError(400, "Thumbnail is existed");
    }

    const newProduct = new Product({
      product_name: product_name,
      product_thumbnails: product_thumbnails,
      product_brand: product_brand,
      product_category: product_category,
      price: price,
      quantity: quantity,
      desc: desc,
      ...others,
    });

    // Saved product
    const savedProduct = await newProduct.save();

    res.status(200).json({
      success: true,
      message: "Create new product successfully",
      product: savedProduct,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE
export const updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.productid;

    // Check product
    const product = await Product.findById(productId).where({
      status: "active",
    });
    if (!product) {
      throw createError(400, "Product isn't existed");
    }

    // Check existed category
    if (req.body.product_category) {
      const isExistedCategory = await Category.find({
        category_name: { $in: req.body.product_category },
      });
      if (isExistedCategory.length != req.body.product_category.length) {
        throw createError(400, "There are existed category");
      }
    }

    // Check brand
    if (req.body.product_brand) {
      const isExistedBrand = await Brand.findOne({
        brand_name: req.body.product_brand,
      });
      if (!isExistedBrand) {
        throw createError(400, "Brand isn't existed");
      }
    }

    // Check index brand and name
    if (
      product.product_name !== req.body.product_name ||
      product.product_brand !== req.body.product_brand
    ) {
      const isProductExistedInBrand = await Product.findOne({
        product_name: product.product_name,
        product_brand: req.body.product_brand,
      });
      if (isProductExistedInBrand) {
        throw createError(
          400,
          `${req.body.product_name} is existed in ${req.body.product_brand}`
        );
      }
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { _id: product._id },
      { $set: req.body },
      {
        new: true,
        old_category: product.product_category,
        old_brand: product.product_brand,
      }
    );

    if (!updatedProduct) {
      throw createError(500, "Something is wrong when update product");
    }

    const { __v, status, ...others } = updatedProduct._doc;

    res.status(200).json({
      success: true,
      message: "Update product successfully",
      product: others,
    });
  } catch (err) {
    next(err);
  }
};

// SOFT DELETE
export const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.productid;
    const product = await Product.findById(productId);
    if (!product) {
      throw createError(400, "Product isn't existed");
    }

    if (product.status === "inactive") {
      throw createError(400, "Product already deleted");
    }

    const deletedProduct = await Product.findByIdAndUpdate(
      product._id,
      { $set: { status: "inactive" } },
      { new: true, query_method: "findByIdAndUpdate" }
    );

    if (!deletedProduct) {
      throw createError(500, "Something is wrong when delete product!");
    }

    res.status(200).json({
      success: true,
      message: "Delete product successfully",
      product: deletedProduct,
    });
  } catch (err) {
    next(err);
  }
};

// RECOVER PRODUCT
export const recoverProduct = async (req, res, next) => {
  try {
    const productId = req.params.productid;
    const product = await Product.findById(productId);
    if (!product) {
      throw createError(400, "Product isn't existed");
    }

    if (product.status === "active") {
      throw createError(400, "Product already recovered");
    }

    const activedProduct = await Product.findByIdAndUpdate(
      product._id,
      { $set: { status: "active" } },
      { new: true, query_method: "findByIdAndUpdate" }
    );

    if (!activedProduct) {
      throw createError(500, "Something is wrong when recover product!");
    }

    res.status(200).json({
      success: true,
      message: "Recover product successfully",
      product: activedProduct,
    });
  } catch (err) {
    next(err);
  }
};

// GET ONE
export const getProduct = async (req, res, next) => {
  try {
    const productId = req.params.productid;
    const product = await Product.findById(productId).where({
      status: "active",
    });

    if (!product) {
      throw createError(400, "Product isn't existed");
    }

    const { __v, status, ...others } = product._doc;

    res.status(200).json({
      success: true,
      message: "Get product successfully",
      product: others,
    });
  } catch (err) {
    next(err);
  }
};

// GET ALL
export const getProducts = async (req, res, next) => {
  try {
    /* 
      Page process
      VD: page = 1; 1 - 1 x 9 = 0 => Don't skip,
          page = 2; 2 - 1 x 9 = 9 => Skip 9 docs.
    */

    const page = parseInt(req.query.page);
    const limitPerPage = parseInt(req.query.perPage);

    if (page <= 0 || limitPerPage <= 0) {
      throw createError(400, "Page or Limit must be positive number");
    }
    // Caculate doc need to skip.
    const skipCount = caculateSkipCount(page, limitPerPage);

    /* 
      Search process
    */

    // Key for search by name, brand or category (find by regex).
    const key = createRegex(req.query.key);

    // Sort
    const sort = req.query.sort;
    const sortOptions = ["createdAt", "product_name", "product_brand", "price"];
    let sortBy = {};
    if (sort && sort === "asc") {
      sortBy[sortOptions[0]] = 1;
    } else if (sort && sort === "desc") {
      sortBy[sortOptions[0]] = -1;
    }

    const products = await Product.find({
      $or: [
        { product_name: { $regex: key, $options: "im" } },
        { product_brand: { $regex: key, $options: "im" } },
        { product_category: { $regex: key, $options: "im" } },
      ],
    })
      .skip(skipCount)
      .limit(limitPerPage)
      .sort(sortBy);

    const productArray = Array.isArray(products) ? products : [products];

    // Caculate total page by count doc find by regex.
    const docQuantities =
      products.length !== 0
        ? await Product.countDocuments({
            $or: [
              { product_name: { $regex: key, $options: "im" } },
              { product_brand: { $regex: key, $options: "im" } },
              { product_category: { $regex: key, $options: "im" } },
            ],
          })
        : 0;

    const totalPages = caculateTotalPage(docQuantities, limitPerPage);

    /* 
      Response process
    */

    const response = {
      success: true,
      message: "Get all product successfully",
      total: docQuantities,
    };

    if (productArray.length !== 0) {
      const productLists = productArray.map((product) => {
        const {
          __v,
          quantity,
          desc,
          details,
          status,
          createdAt,
          updatedAt,
          ...others
        } = product._doc;
        return others;
      });
      // Find with page and without page
      if (page && limitPerPage) {
        // With page
        response.totalPages = totalPages;
        response.page = page;
        response.perPage = limitPerPage;
        response.product = productLists;
      } else {
        // Without page
        response.product = productLists;
      }
    } else {
      response.message = "No product found";
      response.product = productArray;
    }

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};
