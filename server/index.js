import colors from "colors";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./connect/mongodb.js";
import allRoutes from "./routes/all_routes.js";
import cors from "cors";

// Configure colors
colors.enable();
// Configure dotevn
dotenv.config();
// Configure port
const PORT = process.env.PORT || 3001;

// Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// RESTFUL API
app.get("/", (req, res) => {
  res.send("<h1>Hello World From Server!</h1>");
});

allRoutes(app);

// Handle Error
app.use((err, req, res, next) => {
  const errStatus = err.status || 500;
  const errMessage = err.message || "Undetermined error!";
  return res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMessage,
    stack: err.stack,
  });
});

// Run listen
app.listen(PORT, () => {
  connectDB();
  console.log(colors.yellow(`Connected to server at ${PORT}`));
});
