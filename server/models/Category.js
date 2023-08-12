import mongoose from "mongoose";
import { Types } from "mongoose";

const CategorySchema = new mongoose.Schema({
  category_name: {
    type: String,
    unique: true,
    required: true,
  },
  // Vừa để tối ưu truy vấn, vừa để sử dụng để cập nhật lại category cảu product khi có sự thay đổi về category_names
  products: {
    type: [Types.ObjectId],
    ref: "Product",
    default: [],
  },
});

export default mongoose.model("Category", CategorySchema);
