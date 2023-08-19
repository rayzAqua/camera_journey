import React, { useState } from "react";
import Layout from "../../components/Layout/Layout.js";
import { styled } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useAuthContext } from "../../context/auth.js";

const LoginForm = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 90vh;
`;

const Form = styled.form``;

const Title = styled.h4`
  text-align: center;
  margin-bottom: 35px;
  font-weight: 700;
  font-family: "Poppins", sans-serif;
`;

const CustomeDiv = styled.div``;

const CustomeInput = styled.input`
  &:hover {
    box-shadow: 0px 0px 4px 0.5px rgba(0, 0, 0, 0.2);
  }
`;

const CustomeButton = styled.button``;

const Login = () => {
  // AuthContext
  const [auth, setAuth] = useAuthContext();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      // Call API.
      // Depend on status code for handle error.
      // If status code is 2xx, it will be Handle by if {} else {}.
      // If status is 4xx or 5xx, it will be Handle by try {} cactch {}.
      const res = await axios.post("/auth/customer-login", {
        email,
        password,
      });
      // Handle data
      if (res && res.data.success) {
        toast.success(`${res.data.message}, đợi một lát`);
        const token = res.headers["authorization"];
        localStorage.setItem("user", JSON.stringify(res.data.customer));
        localStorage.setItem("token", JSON.stringify(token));
        setAuth({
          ...auth,
          user: res.data.customer,
          token: token,
        });
        setTimeout(() => {
          navigate(-1);
        }, 1500);
      } else {
        toast.warn(res.data.message);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else if (error.response && error.response.status === 500) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có gì đó không đúng");
      }
    }
  };

  return (
    <Layout>
      <LoginForm>
        <Form
          className="text-center bg-light border border-white rounded-3 p-5 shadow col-8 col-sm-6 col-md-6 col-lg-4"
          onSubmit={handleSubmit}
        >
          <Title>Đăng nhập</Title>
          <CustomeDiv className="mb-3">
            <CustomeInput
              type="email"
              className="form-control rounded-0 border-0 border-bottom bg-light"
              placeholder="Email"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </CustomeDiv>
          <CustomeDiv className="mb-3">
            <CustomeInput
              type="password"
              className="form-control rounded-0 border-0 border-bottom bg-light"
              placeholder="Mật khẩu"
              id="exampleInputPassword1"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </CustomeDiv>
          <CustomeDiv className="d-grid gap-2">
            <CustomeDiv
              className="d-grid gap-2 border-bottom"
              disabled={isLoading}
            >
              <CustomeButton type="submit" className="btn btn-warning">
                {!isLoading ? "Đăng nhập" : "Đang tải"}
              </CustomeButton>
              <Link
                to="/forgotpassword"
                className="btn btn-link text-decoration-none text-body-primary mb-3"
              >
                Quên mật khẩu?
              </Link>
            </CustomeDiv>
            <Link
              to="/register"
              className="btn btn-success mt-3 col-12 col-sm-12 col-md-6 col-lg-5 ms-auto me-auto"
            >
              Tạo tài khoản mới
            </Link>
          </CustomeDiv>
        </Form>
      </LoginForm>
    </Layout>
  );
};

export default Login;
