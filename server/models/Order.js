import mongoose from "mongoose";
import { Types } from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    customer: {
      fname: { type: String, required: true },
      lname: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
    },
    shipping_address: {
      type: Object,
    },
    cart: {
      type: Types.ObjectId,
      required: true,
    },
    products: {
      type: [Object],
      required: true,
    },
    payment: {
      type: Object,
      // required: true,
    },
    status: {
      type: String,
      enum: ["pending", "process", "complete", "cancel"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
