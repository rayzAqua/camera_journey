import mongoose from "mongoose";
import { Types } from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      trim: true,
      required: true,
    },
    lname: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    sexual: {
      type: String,
      enum: ["Nam", "Nữ", "Khác"],
    },
    birthDate: {
      type: Date,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      street: { type: String, required: true },
      district: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
    },
    image: {
      type: String,
      default:
        "https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2022/09/avatar-hai-1.jpg?ssl=1",
    },
    payments: {
      type: Object,
      default: {},
    },
    orders: {
      type: [Types.ObjectId],
      ref: "Order",
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

CustomerSchema.pre("find", function (next) {
  this.where({ status: "active" });
  next();
});

export default mongoose.model("Customer", CustomerSchema);
