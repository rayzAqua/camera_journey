import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
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
      enum: ["male", "female", "other"],
    },
    birthDate: {
      type: Date,
    },
    phone: {
      type: String,
    },
    address: {
      street: { type: String },
      district: { type: String },
      city: { type: String },
      country: { type: String },
    },
    image: {
      type: String,
      default:
        "https://i0.wp.com/thatnhucuocsong.com.vn/wp-content/uploads/2022/09/avatar-hai-1.jpg?ssl=1",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    role: {
      type: String,
      enum: ["staff", "manager"],
      default: "staff",
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("find", function (next) {
  this.where({ status: "active" });
  next();
});

export default mongoose.model("User", UserSchema);
