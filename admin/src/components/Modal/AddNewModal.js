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

const Thumbnail = styled.div``;

const NormalText = styled.span`
  font-weight: 500;
`;

const ProductName = styled.div``;

const Category = styled.div``;

const Brand = styled.div``;

const Descible = styled.div``;

const CustomeTextArea = styled.textarea``;

const Price = styled.div``;

const Detail = styled.div``;

const CustomeDiv = styled.div``;

const CustomeInput = styled.input`
  &:hover {
    box-shadow: 0px 0px 4px 0.5px rgba(0, 0, 0, 0.2);
  }
`;
const Footer = styled.div``;

const EndTaskButton = styled.button``;

const UpdateButton = styled.button``;

const AddNewModal = ({ product, index, cart }) => {
  // Context
  const [auth, setAuth] = useAuthContext();
  const navigate = useNavigate();

  // New Product
  const [pname, setPName] = useState("");
  // Thumbnails
  const [files, setFiles] = useState("");

  // Category
  const [listCategory, setListCategory] = useState([]);
  const [category, setCategory] = useState("");
  // Brand
  const [brand, setBrand] = useState("");

  const [desc, setDesc] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  // Detail
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const [details, setDetails] = useState({});

  // Fetch data for list
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fetchCategory, setFetchCategory] = useState([]);
  const [fetchBrand, setFetchBrand] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res_category = await axios.get("/category/");
        const res_brand = await axios.get("/brand/");

        if (
          (res_category && res_category.data.success) ||
          (res_brand && res_brand.data.success)
        ) {
          setFetchCategory(res_category.data.category);
          setFetchBrand(res_brand.data.brand);
          console.log("Fetch success");
        } else {
          console.log("Fetch fail");
        }
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // Details
  const handleSetDetails = () => {
    if (key === "" || value === "") {
      console.log(key, value);
      toast.info("Bạn cần nhập đủ thông tin của chi tiết sản phẩm");
      return;
    }
    if (!isAlphaNumbericString(key) || !isAlphaNumbericString(value)) {
      toast.info("Tên chi tiết hoặc mô tả chi tiết có chứa ký tự không hợp lệ");
      return;
    }
    setDetails({ ...details, [key]: value });
    setKey("");
    setValue("");
  };

  const handleDeleteDetails = (keyToDelete) => {
    const updatedDetails = { ...details };
    delete updatedDetails[keyToDelete];
    setDetails(updatedDetails);
  };

  // Create New Product
  const [isLoading, setIsLoading] = useState(false);

  const handleAddNew = async () => {
    try {
      // Validate
      if (!pname) {
        toast.warn("Không được bỏ trống tên sản phẩm");
        return;
      }
      if (!isAlphaNumbericString(pname)) {
        toast.warn("Tên sản phẩm chứa ký tự không hợp lệ");
        return;
      }
      if (!brand) {
        toast.warn("Cần thương hiệu");
        return;
      }
      if (listCategory.length === 0) {
        toast.warn("Cần danh mục");
        return;
      }
      if (!desc) {
        toast.warn("Không được bỏ trống mô tả sản phẩm");
        return;
      }
      if (!isAlphaNumbericSpecialString(desc)) {
        toast.warn("Mô tả có chứa ký tự không hợp lệ");
        return;
      }
      if (!price) {
        toast.warn("Không được bỏ trống giá tiền");
        return;
      }
      if (!isNumericString(price)) {
        toast.warn("Giá tiền phải là số");
        return;
      }
      if (!quantity) {
        toast.warn("Không được bỏ trống số lượng");
        return;
      }
      if (!isNumericString(quantity)) {
        toast.warn("Số lượng phải là số");
        return;
      }
      if (!files || files.length === 0) {
        toast.warn("Không được bỏ trống ảnh minh hoạ");
        return;
      }
      setIsLoading(true);

      // Call API imgBB
      const image_url = await Promise.all(
        Object.values(files).map(async (file) => {
          const base64String = await convertFileToBase64(file);
          const uploadRes = await imgBBUpload(base64String);
          return uploadRes;
        })
      );

      const res = await axios.post(
        `/product/${auth.user._id}`,
        {
          product_name: pname,
          product_thumbnails: image_url,
          product_brand: brand,
          product_category: listCategory,
          price: price,
          quantity: quantity,
          desc: desc,
          details: details,
        },
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
      id="AddNewModal"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <Dialog className="modal-dialog modal-lg">
        <Content className="modal-content">
          <Header className="modal-header">
            <Title className="modal-title fs-5" id="exampleModalLabel">
              Thêm mới sản phẩm
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
              <ProductName className="mb-3">
                <NormalText>Tên sản phẩm: </NormalText>
                <CustomeDiv>
                  <CustomeInput
                    type="text"
                    className="form-control rounded-0 border-0 border-bottom bg-light"
                    placeholder="Tên sản phẩm"
                    autoFocus={true}
                    required={true}
                    value={pname}
                    onChange={(e) => setPName(e.target.value)}
                  />
                </CustomeDiv>
              </ProductName>
              <Brand className="mb-3">
                <NormalText>Thương hiệu: </NormalText>
                <CustomeDiv className="form-control input-group rounded-0 border-0 bg-light">
                  <label className="input-group-text rounded-0" htmlFor="brand">
                    Lựa chọn
                  </label>
                  <select
                    className="form-select rounded-0"
                    id="brand"
                    onChange={(e) =>
                      e.target.value !== "" &&
                      !brand.includes(e.target.value) &&
                      setBrand(e.target.value)
                    }
                    value={brand}
                  >
                    <option value={""}>Chọn...</option>
                    {fetchBrand &&
                      fetchBrand.map((item, index) => (
                        <option key={index} value={`${item.brand_name}`}>
                          {item.brand_name}
                        </option>
                      ))}
                  </select>
                </CustomeDiv>
              </Brand>
              <Category className="mb-3">
                <NormalText>Danh mục: </NormalText>
                <CustomeDiv className="input-group">
                  <CustomeInput
                    type="text"
                    className="form-control rounded-0 border-0 border-bottom bg-light"
                    value={listCategory}
                    placeholder="Danh mục"
                    disabled
                  />
                  <CustomeDiv className="form-control input-group ms-4 rounded-0 border-0 bg-light">
                    <label
                      className="input-group-text rounded-0"
                      htmlFor="category"
                    >
                      Lựa chọn
                    </label>
                    <select
                      className="form-select rounded-0"
                      id="category"
                      onChange={(e) =>
                        e.target.value !== "" &&
                        !listCategory.includes(e.target.value) &&
                        setListCategory([...listCategory, e.target.value])
                      }
                      value={category}
                    >
                      <option value={""}>Chọn...</option>
                      {fetchCategory &&
                        fetchCategory.map((item, index) => (
                          <option key={index} value={`${item.category_name}`}>
                            {item.category_name}
                          </option>
                        ))}
                    </select>
                  </CustomeDiv>
                </CustomeDiv>
              </Category>
              <Descible className="mb-3">
                <NormalText>Mô tả sản phẩm: </NormalText>
                <CustomeDiv>
                  <CustomeTextArea
                    className="form-control rounded-0 border-0 border-bottom bg-light"
                    placeholder="Mô tả"
                    required
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                  />
                </CustomeDiv>
              </Descible>
              <Price className="mb-3">
                <CustomeDiv className="input-group">
                  <div className="col-8">
                    <NormalText>Đơn giá:</NormalText>
                    <CustomeInput
                      type="text"
                      className="form-control rounded-0 border-0 border-bottom bg-light"
                      placeholder="Đơn giá"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div className="col-4 ps-4">
                    <NormalText>Số lượng:</NormalText>
                    <CustomeInput
                      type="number"
                      className="form-control rounded-0 border-0 border-bottom bg-light"
                      placeholder="Số lượng"
                      required
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                </CustomeDiv>
              </Price>
              <Thumbnail className="mb-3">
                <NormalText>Minh hoạ: </NormalText>
                <div className="row">
                  <CustomeDiv className=" col-10">
                    <CustomeInput
                      type="text"
                      className="form-control rounded-0 border-0 border-bottom bg-light"
                      placeholder="Minh hoạ"
                      required
                      value={files.length > 0 ? files[0].name : ""}
                      readOnly
                    />
                  </CustomeDiv>
                  <label htmlFor="file" className="btn btn-primary col-2 ps-3">
                    Thêm ảnh
                    <input
                      type="file"
                      id="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => setFiles(e.target.files)}
                    />
                  </label>
                </div>
              </Thumbnail>
              <Detail>
                <CustomeDiv className="mb-2 input-group">
                  <div className="col-5 pe-3">
                    <NormalText>Tên chi tiết:</NormalText>
                    <CustomeInput
                      type="text"
                      className="form-control rounded-0 border-0 border-bottom bg-light"
                      placeholder="Tên chi tiết"
                      required
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                    />
                  </div>
                  <div className="col-5 ps-3">
                    <NormalText>Nội dung:</NormalText>
                    <CustomeInput
                      type="text"
                      className="form-control rounded-0 border-0 border-bottom bg-light"
                      placeholder="Nội dung"
                      required
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                  </div>
                  <div className="col-2 pt-4 ps-3">
                    <button
                      className="btn btn-primary w-100"
                      onClick={handleSetDetails}
                    >
                      Thêm
                    </button>
                  </div>
                </CustomeDiv>
                {Object.keys(details).length > 0 &&
                  Object.keys(details).map((key, index) => (
                    <CustomeDiv className="mb-2 input-group" key={index}>
                      <div className="col-5 pe-3">
                        <CustomeInput
                          type="text"
                          className="form-control rounded-0 border-0 border-bottom bg-light"
                          placeholder="Tên chi tiết"
                          value={key}
                          readOnly
                        />
                      </div>
                      <div className="col-5 ps-3">
                        <CustomeInput
                          type="text"
                          className="form-control rounded-0 border-0 border-bottom bg-light"
                          placeholder="Nội dung"
                          value={details[key]}
                          readOnly
                        />
                      </div>
                      <div className="col-2 ps-3">
                        <button
                          className="btn btn-danger w-100"
                          onClick={() => handleDeleteDetails(key)}
                        >
                          Xoá
                        </button>
                      </div>
                    </CustomeDiv>
                  ))}
              </Detail>
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

export default AddNewModal;
