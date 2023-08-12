import mongoose from "mongoose";
import { Types } from "mongoose";

const BrandSchema = new mongoose.Schema({
  brand_name: {
    type: String,
    unique: true,
    required: true,
  },
  // Vừa để tối ưu truy vấn, vừa để sử dụng để cập nhật lại brand_name của product khi có sự thay đổi về brand_name
  products: {
    type: [Types.ObjectId],
    ref: "Product",
    default: [],
  },
});

export default mongoose.model("Brand", BrandSchema);
