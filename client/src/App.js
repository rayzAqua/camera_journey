import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./context/auth.js";
import Home from "./pages/Home/Home.js";
import PageNotFound from "./pages/PageNotFound.js";
import About from "./pages/About.js";
import Contract from "./pages/Contract.js";
import Register from "./pages/Auth/Register.js";
import Login from "./pages/Auth/Login.js";
import ConfirmEmail from "./pages/Auth/ConfirmEmail.js";
import Category from "./pages/Category/Category.js";
import Cart from "./pages/Cart/Cart.js";
import Shopping from "./pages/Shopping/Shopping.js";
import SingleProduct from "./pages/Single/SingleProduct.js";
import OrderHistory from "./pages/Order/OrderHistory.js";
import UpdateCustomer from "./pages/Update/UpdateCustomer.js";
import PersonalInfo from "./pages/Single/SingleCustomer.js";
import ChangePassword from "./pages/Auth/ChangePassword.js";
import Search from "./pages/Search/Search.js";
import Brand from "./pages/Brand/Brand.js";

function App() {
  const ProtectedRoute = ({ children }) => {
    const [auth, setAuth] = useAuthContext();

    if (!auth.user) {
      console.log("Ok");
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <Routes>
      <Route path="/">
        <Route index element={<Home />}></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="register" element={<Register />}></Route>
        <Route path="forgotpassword" element={<ConfirmEmail />}></Route>
        {/* Search route */}
        <Route path="search" element={<Search />}></Route>
        {/* Profile route */}
        <Route path="profile">
          <Route
            index
            element={
              <ProtectedRoute>
                <PageNotFound />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path=":customerid"
            element={
              <ProtectedRoute>
                <PersonalInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path="update/:customerid"
            element={
              <ProtectedRoute>
                <UpdateCustomer />
              </ProtectedRoute>
            }
          />
          <Route
            path="change-password/:customerid"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
        </Route>
        {/* Order route */}
        <Route path="order">
          <Route
            index
            element={
              <ProtectedRoute>
                <PageNotFound />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path=":customerid"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />
        </Route>
        {/* Category route */}
        <Route path="category">
          <Route index element={<PageNotFound />} />
          <Route path=":categoryid" element={<Category />}></Route>
        </Route>
        {/* Brand route */}
        <Route path="brand">
          <Route index element={<PageNotFound />} />
          <Route path=":brand" element={<Brand />}></Route>
        </Route>
        {/* Cart route */}
        <Route path="cart">
          <Route
            index
            element={
              <ProtectedRoute>
                <PageNotFound />
              </ProtectedRoute>
            }
          />
          <Route
            path=":customerid"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          ></Route>
        </Route>
        {/* Shop route */}
        <Route path="shop">
          <Route index element={<Shopping />}></Route>
          <Route path=":productid" element={<SingleProduct />} />
        </Route>
        {/* Not found route */}
        <Route path="/*" element={<PageNotFound />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
