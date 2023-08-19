import React, { useEffect, useState } from "react";
import axios from "axios";
import { styled } from "styled-components";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  isAlphaNumbericSpecialString,
  isAlphaNumbericString,
  isAlphaNumbericWithSlashString,
  isNumericString,
} from "../../utils/checkInput.js";
import Layout from "../../components/Layout/Layout.js";
import { useAuthContext } from "../../contexts/auth.js";

const CustomeForm = styled.form`
  width: 100%;
  height: 100%;
`;

const Title = styled.h4`
  text-align: center;
  margin-bottom: 35px;
  font-weight: 700;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const AvatarContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 20px;
`;

const UploadButton = styled.label`
  border-radius: 4px;
  cursor: pointer;
`;

const CustomeDiv = styled.div``;

const CustomeInput = styled.input``;

const CustomeButton = styled.button``;

const UpdateButton = styled.div`
  width: 50%;
  margin: 0 auto;
`;

const Loading = styled.h4`
  text-align: start;
  margin-bottom: 35px;
  font-weight: 700;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const UpdateStaff = () => {
  // Get token from context
  const [auth, setAuth] = useAuthContext();

  // Get customer id
  const location = useLocation();

  const { data, loading, error } = useFetch(
    `/user/${auth.user._id}/${auth.user._id}`,
    {
      headers: {
        Authorization: `${auth.token}`,
      },
    }
  );

  // Storage input data
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [sexual, setSexual] = useState("");
  const [files, setFiles] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate
      if (fname && !isAlphaNumbericString(fname)) {
        toast.warn("Họ chứa ký tự không hợp lệ");
        return;
      }
      if (lname && !isAlphaNumbericString(lname)) {
        toast.warn("Tên chứa ký tự không hợp lệ");
        return;
      }
      if (phone && !isNumericString(phone)) {
        toast.warn("Số điện thoại chỉ chứa ký tự số");
        return;
      }
      if (phone && !(phone.length === 10)) {
        toast.warn("Số điện thoại phải là 10 ký tự");
        return;
      }

      const currentDate = new Date();
      if (birthDate && new Date(birthDate) > currentDate) {
        toast.warn("Ngày sinh không thể lớn hơn ngày hiện tại");
        return;
      }

      // Waiting until API update success
      setIsLoading(true);

      // Call API imgBB
      const image_url = await Promise.all(
        Object.values(files).map(async (file) => {
          const base64String = await convertFileToBase64(file);
          const uploadRes = await imgBBUpload(base64String);
          return uploadRes;
        })
      );

      // Check value before update
      const updateData = {};
      if (fname !== "") {
        updateData.fname = fname;
      }
      if (lname !== "") {
        updateData.lname = lname;
      }
      if (phone !== "") {
        updateData.phone = phone;
      }
      if (sexual !== "") {
        updateData.sexual = sexual;
      }
      if (birthDate !== "") {
        updateData.birthDate = birthDate;
      }
      if (image_url.length > 0) {
        updateData.image = image_url[0];
      }

      // Call update profile API
      const res = await axios.put(
        `/staff/${auth.user._id}/${auth.user._id}`,
        updateData,
        {
          headers: {
            Authorization: `${auth.token}`,
          },
        }
      );

      // Handle data after update
      if (res && res.data.success) {
        toast.success(`${res.data.message}`);
        setAuth({
          ...auth,
          user: res.data.customer,
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
      {error && toast.error(error.response.data.message)}
      <div className="container pt-4 pb-4">
        {loading ? (
          <Loading className="text-center">Loading...</Loading>
        ) : (
          <CustomeForm className="text-center bg-light border border-0 rounded-3 p-5 shadow">
            <Title>Cập nhập thông tin</Title>
            <div className="bg-white p-5 rounded-2 shadow">
              <AvatarContainer className="mb-4">
                <Avatar
                  src={
                    files
                      ? URL.createObjectURL(files[0])
                      : data?.customer?.image
                  }
                  alt="Avatar"
                />
                <UploadButton htmlFor="file" className="btn btn-primary">
                  Thêm ảnh
                  <input
                    type="file"
                    id="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => setFiles(e.target.files)}
                  />
                </UploadButton>
              </AvatarContainer>

              <CustomeDiv className="mb-3 input-group">
                <CustomeInput
                  type="text"
                  className="form-control rounded-0 border-0 border-bottom bg-light"
                  placeholder={data?.customer?.fname}
                  autoFocus
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                />
                <CustomeInput
                  type="text"
                  className="form-control rounded-0 border-0 border-bottom bg-light ms-4"
                  placeholder={data?.customer?.lname}
                  value={lname}
                  onChange={(e) => setLname(e.target.value)}
                />
              </CustomeDiv>

              <CustomeDiv className="mb-3 input-group">
                <CustomeInput
                  type="date"
                  className="form-control rounded-0 border-0 border-bottom bg-light"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                />

                <div className="form-control input-group ms-4 rounded-0 border-0 bg-light">
                  <label
                    className="input-group-text rounded-0"
                    htmlFor="gender"
                  >
                    Giới tính
                  </label>
                  <select
                    className="form-select rounded-0"
                    id="gender"
                    onChange={(e) =>
                      e.target.value !== "" && setSexual(e.target.value)
                    }
                    value={sexual}
                  >
                    <option value={""}>Chọn...</option>
                    <option value={"Nam"}>Nam</option>
                    <option value={"Nữ"}>Nữ</option>
                    <option value={"Khác"}>Khác</option>
                  </select>
                </div>
              </CustomeDiv>

              <CustomeDiv className="mb-3">
                <CustomeInput
                  type="text"
                  className="form-control rounded-0 border-0 border-bottom bg-light"
                  placeholder={data?.customer?.phone}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </CustomeDiv>

              <CustomeDiv className="mb-3 input-group">
                <CustomeInput
                  type="text"
                  className="form-control rounded-0 border-0 border-bottom bg-light"
                  placeholder={data?.customer?.address?.street}
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
                <CustomeInput
                  type="text"
                  className="form-control rounded-0 border-0 border-bottom bg-light ms-4"
                  placeholder={data?.customer?.address?.district}
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </CustomeDiv>
              <CustomeDiv className="mb-3 input-group">
                <CustomeInput
                  type="text"
                  className="form-control rounded-0 border-0 border-bottom bg-light"
                  placeholder={data?.customer?.address?.city}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <CustomeInput
                  type="text"
                  className="form-control rounded-0 border-0 border-bottom bg-light ms-4"
                  placeholder={data?.customer?.address?.country}
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </CustomeDiv>
              <UpdateButton className="d-grid gap-2 mt-5">
                <CustomeButton
                  type="button"
                  className="btn btn-primary mb-3"
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {!isLoading ? "Cập nhật" : "Đang tải"}
                </CustomeButton>
              </UpdateButton>
            </div>
          </CustomeForm>
        )}
      </div>
    </Layout>
  );
};

export default UpdateStaff;
