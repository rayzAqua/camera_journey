import mongoose from "mongoose";

const TokenSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
    required: true,
  },
  create_at: {
    type: Date,
    default: Date.now(),
    expires: 180,
  },
});

export default mongoose.model("Token", TokenSchema);
