import React, { useState } from "react";
import axios from "axios";
import Layout from "../../components/Layout/Layout.js";
import { styled } from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomerSideBar from "../../components/Sidebar/CustomerSideBar.js";
import { useAuthContext } from "../../context/auth.js";

const Row = styled.div``;

const CustomeForm = styled.form`
  width: 50%;
  margin-top: 20vh;
  margin-bottom: 20vh;
`;

const Title = styled.h4`
  margin-bottom: 35px;
  font-weight: 700;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const CustomeDiv = styled.div``;

const CustomeInput = styled.input`
  &:hover {
    box-shadow: 0px 0px 4px 0.5px rgba(0, 0, 0, 0.2);
  }
`;

const CustomeButton = styled.button``;

const ChangePassword = () => {
  const [auth, setAuth] = useAuthContext();

  const location = useLocation();
  const customerid = location.pathname.split("/")[3];
  const navigate = useNavigate();

  console.log(customerid);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (newPassword.length < 6) {
        toast.warn("Độ dài mật khẩu yêu cầu 6 ký tự");
        return;
      }
      // Check confirm newPassword
      if (newPassword !== confirmPassword) {
        toast.warn("Xác nhận mật khẩu không khớp");
        return;
      }

      setIsLoading(true);

      const res = await axios.post(`/auth/change-password?role=customer`, {
        id: customerid,
        old_password: oldPassword,
        new_password: newPassword,
      });

      if (res && res.data.success) {
        toast.success(`${res.data.message}`);
        setTimeout(() => {
          setAuth({
            user: null,
            token: null,
          });
          navigate("/login");
        }, 2000);
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
      <div className="container pt-4 pb-4">
        <Row className="row">
          <div className="col-lg-3">
            <CustomerSideBar customeid={auth.user._id} />
          </div>
          <div className="col-lg-9">
            <CustomeForm
              className="bg-light border border-white rounded-3 p-5 shadow ms-auto me-auto"
              onSubmit={handleSubmit}
            >
              <Title>Chọn mật khẩu mới</Title>
              <hr className="divider" />
              <CustomeDiv className="mb-3">
                Tạo mật khẩu mới có tối thiểu 6 ký tự. Mật khẩu mạnh là mật khẩu
                được kết hợp từ các ký tự, số và dấu câu.
              </CustomeDiv>
              <CustomeDiv className="mb-3">
                <CustomeInput
                  type="password"
                  className="form-control rounded-1 border-1 border-bottom bg-light"
                  placeholder="Mật khẩu hiện tại"
                  id="exampleInputPassword1"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
              </CustomeDiv>
              <CustomeDiv className="mb-3">
                <CustomeInput
                  type="password"
                  className="form-control rounded-1 border-1 border-bottom bg-light"
                  placeholder="Mật khẩu mới"
                  id="exampleInputPassword1"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </CustomeDiv>
              <CustomeDiv className="mb-4">
                <CustomeInput
                  type="password"
                  className="form-control rounded-1 border-1 border-bottom bg-light"
                  placeholder="Xác nhận mật khẩu"
                  id="exampleInputPassword2"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </CustomeDiv>
              <hr className="divider" />
              <CustomeDiv className="btn-group-sm text-end">
                <Link
                  onClick={() => navigate(-1)}
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
          </div>
        </Row>
      </div>
    </Layout>
  );
};

export default ChangePassword;
