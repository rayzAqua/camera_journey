import { Route, Routes, Navigate } from "react-router";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import Login from "./pages/Auth/Login";
import ConfirmEmail from "./pages/Auth/ConfirmEmail";
import { useAuthContext } from "./contexts/auth";
import Product from "./pages/Product/Product";
import SingleProduct from "./pages/Single/Product/SingleProduct";
import Order from "./pages/Order/Order";
import User from "./pages/User/User";
import Category from "./pages/Category/Category";
import Brand from "./pages/Brand/Brand";
import Customer from "./pages/Customer/Customer";
import Home from "./pages/Home/Home";
import PersonalInfo from "./pages/Single/User/SingleUser";
import ChangePassword from "./pages/Auth/ChangePassword";

function App() {
  const ProtectedRoute = ({ children }) => {
    const [auth, setAuth] = useAuthContext();

    if (!auth.user || !auth.token) {
      console.log("Ok");
      return <Navigate to="/login" />;
    }

    return children;
  };

  return (
    <Routes>
      <Route path="/">
        <Route
          index
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        ></Route>
        <Route path="login" element={<Login />}></Route>
        <Route path="forgotpassword" element={<ConfirmEmail />}></Route>

        <Route path="profile">
          <Route
            index
            element={
              <ProtectedRoute>
                <PageNotFound />
              </ProtectedRoute>
            }
          />
          <Route
            path=":userid"
            element={
              <ProtectedRoute>
                <PersonalInfo />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="change-password">
          <Route
            index
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="product">
          <Route
            index
            element={
              <ProtectedRoute>
                <Product />
              </ProtectedRoute>
            }
          />
          <Route
            path=":productid"
            element={
              <ProtectedRoute>
                <SingleProduct />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="brand">
          <Route
            index
            element={
              <ProtectedRoute>
                <Brand />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="category">
          <Route
            index
            element={
              <ProtectedRoute>
                <Category />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="customer">
          <Route
            index
            element={
              <ProtectedRoute>
                <Customer />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="staff">
          <Route
            index
            element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="order">
          <Route
            index
            element={
              <ProtectedRoute>
                <Order />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="/*" element={<PageNotFound />}></Route>
      </Route>
    </Routes>
  );
}

export default App;
