import React, { useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout/Layout.js";
import { styled } from "styled-components";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ComfirmForm = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 90vh;
`;

const CustomeForm = styled.form``;

const Title = styled.h4`
  margin-bottom: 25px;
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

const ConfirmEmail = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

      const res = await axios.post("/auth/forget-password?role=customer", {
        email,
      });
      if (res && res.data.success) {
        toast.success(`${res.data.message}`);
      } else {
        toast.warn(`${res.data.message}`);
      }
      setTimeout(() => {
        navigate("/login");
      }, 2000);
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
      <ComfirmForm>
        <CustomeForm
          className="bg-light border border-white rounded-3 p-5 shadow col-8 col-sm-6 col-md-6 col-lg-4"
          onSubmit={handleSubmit}
        >
          <Title>Xác nhận email</Title>
          <hr className="divider" />
          <CustomeDiv className="mb-3">
            Vui lòng nhập email để tìm kiếm tài khoản của bạn.
          </CustomeDiv>
          <CustomeDiv className="mb-4">
            <CustomeInput
              type="email"
              className="form-control rounded-2 border-1 border-bottom bg-light p-2"
              placeholder="Email"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </CustomeDiv>
          <hr className="divider" />
          <CustomeDiv className="btn-group-sm text-end">
            <Link
              to="/login"
              className="btn btn-secondary col-12 col-sm-12 col-md-3 col-lg-3 ms-auto p-2 mt-2"
            >
              Huỷ
            </Link>
            <CustomeButton
              type="submit"
              className="btn btn-warning col-12 col-sm-12 col-md-4 ms-md-2 col-lg-4 ms-lg-2 p-2 mt-2"
              disabled={isLoading}
            >
              {!isLoading ? "Xác nhận" : "Đang tải"}
            </CustomeButton>
          </CustomeDiv>
        </CustomeForm>
      </ComfirmForm>
    </Layout>
  );
};

export default ConfirmEmail;
