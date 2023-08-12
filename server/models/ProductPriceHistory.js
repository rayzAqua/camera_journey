import mongoose from "mongoose";
import { Types } from "mongoose";

// Lưu lại lịch sử thay đổi giá của một sản phẩm
const ProductPriceHistorySchema = new mongoose.Schema({
  product: {
    type: Types.ObjectId,
    ref: "Product",
  },
  price: {
    type: String,
    required: true,
  },
  modified_at: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("ProductPriceHistory", ProductPriceHistorySchema);
