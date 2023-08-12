import React, { useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout/Layout.js";
import { styled } from "styled-components";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  isAlphaNumbericSpecialString,
  isAlphaNumbericString,
  isAlphaNumbericWithSlashString,
  isNumericString,
} from "../../utils/checkInput.js";

const RegisterForm = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 90vh;
`;

const CustomeForm = styled.form``;

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

const Register = () => {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Hook
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!isAlphaNumbericString(fname)) {
        toast.warn("Họ chứa ký tự không hợp lệ");
        return;
      }

      if (!isAlphaNumbericString(lname)) {
        toast.warn("Tên chứa ký tự không hợp lệ");
        return;
      }

      if (password.length < 6) {
        toast.warn("Độ dài mật khẩu yêu cầu 6 ký tự");
        return;
      }

      // Check confirm password
      if (password !== confirmPassword) {
        toast.warn("Xác nhận mật khẩu không khớp");
        return;
      }

      if (!isNumericString(phone)) {
        toast.warn("Số điện thoại chỉ chứa ký tự số");
        return;
      }

      if (!(phone.length === 10)) {
        toast.warn("Số điện thoại phải là 10 ký tự");
        return;
      }

      if (!isAlphaNumbericWithSlashString(street)) {
        toast.warn("Địa chỉ có chứa ký tự không hợp lệ");
        return;
      }

      if (!isAlphaNumbericString(district)) {
        toast.warn("Quận/Huyện có chứa ký tự không hợp lệ");
        return;
      }

      if (!isAlphaNumbericString(city)) {
        toast.warn("Tỉnh/Thành có chứa ký tự không hợp lệ");
        return;
      }

      if (!isAlphaNumbericString(country)) {
        toast.warn("Đất nước có chứa ký tự không hợp lệ");
        return;
      }

      setIsLoading(true);

      // Call API
      const res = await axios.post("/auth/customer-register", {
        fname,
        lname,
        email,
        password,
        phone,
        address: {
          street: street,
          district: district,
          city: city,
          country: country,
        },
      });
      // Handle data
      if (res && res.data.success) {
        toast.success(`${res.data.message}, please wait`);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        toast.error(res.data.message);
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
      <RegisterForm>
        <CustomeForm
          className="text-center bg-light border border-white rounded-3 p-5 shadow col-8 col-sm-6 col-md-6 col-lg-4"
          onSubmit={handleSubmit}
        >
          <Title>Đăng ký</Title>
          <CustomeDiv className="mb-3 input-group">
            <CustomeInput
              type="text"
              className="form-control rounded-0 border-0 border-bottom bg-light"
              placeholder="Họ"
              required
              autoFocus
              value={fname}
              onChange={(e) => setFname(e.target.value)}
            />
            <CustomeInput
              type="text"
              className="form-control rounded-0 border-0 border-bottom bg-light ms-4"
              placeholder="Tên"
              required
              autoFocus
              value={lname}
              onChange={(e) => setLname(e.target.value)}
            />
          </CustomeDiv>
          <CustomeDiv className="mb-3">
            <CustomeInput
              type="email"
              className="form-control rounded-0 border-0 border-bottom bg-light"
              placeholder="Email"
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
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </CustomeDiv>
          <CustomeDiv className="mb-3">
            <CustomeInput
              type="password"
              className="form-control rounded-0 border-0 border-bottom bg-light"
              placeholder="Xác nhận mật khẩu"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </CustomeDiv>
          <CustomeDiv className="mb-3">
            <CustomeInput
              type="text"
              className="form-control rounded-0 border-0 border-bottom bg-light"
              placeholder="Số điện thoại"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </CustomeDiv>
          <CustomeDiv className="mb-3 input-group">
            <CustomeInput
              type="text"
              className="form-control rounded-0 border-0 border-bottom bg-light"
              placeholder="Địa chỉ"
              required
              autoFocus
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
            <CustomeInput
              type="text"
              className="form-control rounded-0 border-0 border-bottom bg-light ms-4"
              placeholder="Quận/Huyện"
              required
              autoFocus
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />
          </CustomeDiv>
          <CustomeDiv className="mb-3 input-group">
            <CustomeInput
              type="text"
              className="form-control rounded-0 border-0 border-bottom bg-light"
              placeholder="Tỉnh/Thành"
              required
              autoFocus
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <CustomeInput
              type="text"
              className="form-control rounded-0 border-0 border-bottom bg-light ms-4"
              placeholder="Đất nước"
              required
              autoFocus
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </CustomeDiv>
          <CustomeDiv className="d-grid gap-2">
            <CustomeButton
              type="submit"
              className="btn btn-warning mb-3"
              disabled={isLoading}
            >
              {!isLoading ? "Đăng ký" : "Đang tải"}
            </CustomeButton>
            <CustomeDiv className="border-bottom"></CustomeDiv>
            <Link
              to="/login"
              className="btn btn-success col-12 col-sm-12 col-md-6 col-lg-5 ms-auto me-auto mt-3"
              disabled={isLoading}
            >
              Đã có tài khoản ?
            </Link>
          </CustomeDiv>
        </CustomeForm>
      </RegisterForm>
    </Layout>
  );
};

export default Register;
