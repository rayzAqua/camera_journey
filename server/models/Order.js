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
    cart: {
      type: Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    payment: {
      type: Object,
      default: {},
    },
    shipping_address: {
      type: Object,
      required: true,
    },
    total: {
      type: String,
      required: true,
    },
    staff: [
      {
        id: { type: Types.ObjectId, required: true },
        fname: { type: String, required: true },
        lname: { type: String, required: true },
        modifiedAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "process", "shipping", "complete", "cancel"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
