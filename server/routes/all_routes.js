import authRoutes from "./auths.js";
import userRoutes from "./users.js";
import customerRouters from "./customers.js";
import productRoutes from "./products.js";
import priceRoutes from "./prices.js";
import categoryRoutes from "./categories.js";
import brandRoutes from "./brands.js";
import cartRoutes from "./carts.js";
import orderRoutes from "./orders.js";

const allRoutes = (app) => {
  app.use("/api/auth", authRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/customer", customerRouters);
  app.use("/api/product", productRoutes);
  app.use("/api/price", priceRoutes);
  app.use("/api/category", categoryRoutes);
  app.use("/api/brand", brandRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/order", orderRoutes);
};

export default allRoutes;
