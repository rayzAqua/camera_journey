import mongoose from "mongoose";
import { Types } from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    customer: {
      type: Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    items: [
      {
        product_id: { type: Types.ObjectId, required: true },
        product_name: { type: String, required: true },
        product_thumbnails: { type: [String], default: [] },
        product_brand: { type: String, required: true },
        price: { type: String, min: 0, required: true },
        quantity: { type: Number, min: 1, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", CartSchema);
