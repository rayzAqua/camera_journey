import React, { useState } from "react";
import { useAuthContext } from "../../contexts/auth";
import { styled } from "styled-components";
import { isAlphaNumbericString } from "../../utils/checkInput";
import { toast } from "react-toastify";
import axios from "axios";

const NormalText = styled.span`
  font-weight: 500;
`;

const CustomeDiv = styled.div``;

const CustomeInput = styled.input`
  &:hover {
    box-shadow: 0px 0px 4px 0.5px rgba(0, 0, 0, 0.2);
  }
`;

const AddNewBrandModal = () => {
  const [auth, setAuth] = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [brand, setBrand] = useState("");

  const handleCreateBrand = async () => {
    try {
      if (!brand) {
        toast.warning("Không được bỏ trống tên thương hiệu");
        return;
      }
      if (brand && !isAlphaNumbericString(brand)) {
        toast.warning("Tên thương hiệu có chứa ký tự không hợp lệ");
        return;
      }

      setIsLoading(true);

      const res = await axios.post(
        `/brand/${auth.user._id}/`,
        { brand_name: brand },
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
    <div
      className="modal fade"
      id="NewBrand"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Thêm mới thương hiệu
            </h1>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </div>
          <div className="modal-body">
            <div className="d-flex flex-row justify-content-start align-items-center">
              <NormalText>Tên thương hiệu: </NormalText>
              <CustomeDiv className="w-50 ms-3">
                <CustomeInput
                  type="text"
                  className="form-control rounded-0 border-0 border-bottom bg-light"
                  placeholder="Tên thương hiệu"
                  autoFocus={true}
                  required={true}
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </CustomeDiv>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Huỷ
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCreateBrand}
              disabled={isLoading}
            >
              {!isLoading ? "Lưu" : "Đang tải"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewBrandModal;
