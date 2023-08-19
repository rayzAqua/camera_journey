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

const AddNewCategoryModal = () => {
  const [auth, setAuth] = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState("");

  const handleCreateCategory = async () => {
    try {
      if (!category) {
        toast.warning("Không được bỏ trống tên danh mục");
        return;
      }
      if (category && !isAlphaNumbericString(category)) {
        toast.warning("Tên danh mục có chứa ký tự không hợp lệ");
        return;
      }

      setIsLoading(true);

      const res = await axios.post(
        `/category/${auth.user._id}/`,
        { category_name: category },
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
      id="NewCategory"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="exampleModalLabel">
              Thêm mới danh mục
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
              <NormalText>Tên danh mục: </NormalText>
              <CustomeDiv className="w-50 ms-3">
                <CustomeInput
                  type="text"
                  className="form-control rounded-0 border-0 border-bottom bg-light"
                  placeholder="Tên danh mục"
                  autoFocus={true}
                  required={true}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
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
              onClick={handleCreateCategory}
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

export default AddNewCategoryModal;
