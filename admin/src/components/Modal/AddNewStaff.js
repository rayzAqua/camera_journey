import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { styled } from "styled-components";
import axios from "axios";
import { useAuthContext } from "../../contexts/auth";
import { useNavigate } from "react-router-dom";
import { convertFileToBase64, imgBBUpload } from "../../utils/upLoadImage";
import {
  isAlphaNumbericSpecialString,
  isAlphaNumbericString,
  isAlphabeticString,
  isNumericString,
} from "../../utils/checkInput";

const Container = styled.div``;

const Dialog = styled.div``;

const Content = styled.div``;

const Header = styled.div``;

const Title = styled.h1``;

const CloseButton = styled.button``;

const Body = styled.div``;

const Padding = styled.div``;

const NormalText = styled.span`
  font-weight: 500;
`;

const CustomeDiv = styled.div``;

const CustomeInput = styled.input`
  &:hover {
    box-shadow: 0px 0px 4px 0.5px rgba(0, 0, 0, 0.2);
  }
`;
const Footer = styled.div``;

const EndTaskButton = styled.button``;

const UpdateButton = styled.button``;

const AddNewStaffModal = ({ product, index, cart }) => {
  // Context
  const [auth, setAuth] = useAuthContext();
  const navigate = useNavigate();

  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  // Nếu không có thì mật khẩu mặc định = email
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleAddNew = async () => {
    try {
      // Validate
      if (!fname) {
        toast.warn("Không được bỏ trống họ, tên đệm");
        return;
      }
      if (!isAlphabeticString(fname)) {
        toast.warn("Họ, tên đệm có chứa ký tự không hợp lệ");
        return;
      }
      if (!lname) {
        toast.warn("Không được bỏ trống tên");
        return;
      }
      if (!isAlphabeticString(lname)) {
        toast.warn("Tên có chứa ký tự không hợp lệ");
        return;
      }
      if (!email) {
        toast.warn("Email không được bỏ trống");
        return;
      }
      if (password && password.length !== 6) {
        toast.warn("Mật khẩu cần 6 ký tự");
        return;
      }
      if (password && password !== confirmPassword) {
        toast.warn("Xác nhận mật khẩu không khớp");
        return;
      }
      setIsLoading(true);

      const newData = { password: password };
      if (fname !== "") {
        newData.fname = fname;
      }
      if (lname !== "") {
        newData.lname = lname;
      }
      if (email !== "") {
        newData.email = email;
      }

      if (role !== "") {
        newData.role = role;
      }

      const res = await axios.post(
        `/auth/${auth.user._id}/staff-register`,
        newData,
        {
          headers: {
            Authorization: `${auth.token}`,
          },
        }
      );
      if (res && res.data.success) {
        toast.success(`${res.data.message}`);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.warning(`${res.data.message}`);
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
    <Container
      className="modal fade"
      id="AddNewStaffModal"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <Dialog className="modal-dialog modal-lg">
        <Content className="modal-content">
          <Header className="modal-header">
            <Title className="modal-title fs-5" id="exampleModalLabel">
              Thêm mới nhân viên
            </Title>
            <CloseButton
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => window.location.reload()}
            />
          </Header>
          <Body className="modal-body">
            <Padding className="ps-3 pe-3 pt-2 pb-2">
              <CustomeDiv className="mb-3 input-group">
                <div className="col-6 pe-2">
                  <NormalText>Họ</NormalText>
                  <CustomeInput
                    type="text"
                    className="form-control rounded-0 border-0 border-bottom bg-light"
                    placeholder="Họ"
                    required
                    autoFocus
                    value={fname}
                    onChange={(e) => setFname(e.target.value)}
                  />
                </div>
                <div className="col-6 ps-2">
                  <NormalText>Tên</NormalText>
                  <CustomeInput
                    type="text"
                    className="form-control rounded-0 border-0 border-bottom bg-light"
                    placeholder="Tên"
                    required
                    autoFocus
                    value={lname}
                    onChange={(e) => setLname(e.target.value)}
                  />
                </div>
              </CustomeDiv>
              <CustomeDiv className="mb-3">
                <NormalText>Email</NormalText>
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
                <NormalText>
                  Mật khẩu (Nếu không nhập thì mặc định là email)
                </NormalText>
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
                <NormalText>Xác nhận mật khẩu</NormalText>

                <CustomeInput
                  type="password"
                  className="form-control rounded-0 border-0 border-bottom bg-light"
                  placeholder="Xác nhận mật khẩu"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </CustomeDiv>
              <CustomeDiv>
                <NormalText>
                  Chức vụ (Nếu không chọn mặc định là staff)
                </NormalText>
                <div className="form-control input-group rounded-0 border-0 bg-light">
                  <label className="input-group-text rounded-0" htmlFor="role">
                    Chức vụ
                  </label>
                  <select
                    className="form-select rounded-0"
                    id="role"
                    onChange={(e) =>
                      e.target.value !== "" && setRole(e.target.value)
                    }
                    value={role}
                  >
                    <option value={""}>Chọn...</option>
                    <option value={"staff"}>Nhân viên</option>
                    <option value={"manager"}>Quản lý</option>
                  </select>
                </div>
              </CustomeDiv>
            </Padding>
          </Body>
          <Footer className="modal-footer">
            <EndTaskButton
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={() => window.location.reload()}
            >
              Đóng
            </EndTaskButton>

            <UpdateButton
              type="button"
              className="btn btn-primary"
              onClick={handleAddNew}
              disabled={isLoading}
            >
              {!isLoading ? "Thêm mới" : "Đang tải"}
            </UpdateButton>
          </Footer>
        </Content>
      </Dialog>
    </Container>
  );
};

export default AddNewStaffModal;
