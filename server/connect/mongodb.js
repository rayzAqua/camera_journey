import mongoose from "mongoose";
import colors from "colors";

colors.enable();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_CONNECT_STRING);
    console.log(colors.blue(`Connected to MongoDB at ${conn.connection.host}`));
  } catch (err) {
    console.log(colors.red(`Error in mongoDB: ${err}`));
  }
};

export default connectDB;
