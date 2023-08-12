import mongoose from "mongoose";
import { Types } from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    customer: {
      fname: { type: String, required: true },
      lname: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      image: { type: String, required: true },
    },
    products: {
      type: [Types.ObjectId],
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      min: 1,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", CartSchema);
