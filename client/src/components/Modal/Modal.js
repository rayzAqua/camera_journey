import { Add, Remove } from "@material-ui/icons";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { styled } from "styled-components";
import Slider from "../Slider/Slider";
import axios from "axios";
import { useAuthContext } from "../../context/auth";
import { useNavigate } from "react-router-dom";

const Container = styled.div``;

const Dialog = styled.div``;

const Content = styled.div``;

const Header = styled.div``;

const Title = styled.h1``;

const CloseButton = styled.button``;

const Body = styled.div``;

const Padding = styled.div``;

const Thumbnail = styled.div``;

const ProductName = styled.h5`
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const NormalText = styled.span`
  font-weight: 500;
`;

const Brand = styled.div``;

const BrandName = styled.span``;

const Price = styled.div``;

const Money = styled.span``;

const QuantityGroup = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  background-color: white;
  border-radius: 7px;
  width: 40%;
`;

const ButtonWrapper = styled.span`
  display: flex;
  width: 70%;
  padding: 7px;
  justify-content: space-between;
  border: 1px solid;
`;

const Plus = styled.div`
  &:hover {
    opacity: 0.5;
    cursor: pointer;
  }
`;

const Num = styled.div`
  padding-left: 5px;
  padding-right: 5px;
`;

const Minus = styled.div`
  &:hover {
    opacity: 0.5;
    cursor: pointer;
  }
`;

const Footer = styled.div``;

const EndTaskButton = styled.button``;

const RemoveButton = styled.button``;

const UpdateButton = styled.button``;

const Modal = ({ data, index, cart }) => {
  const [auth, setAuth] = useAuthContext();
  const navigate = useNavigate();

  const [qty, setQty] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const res = await axios.put(
        `/cart/${auth.user._id}/${cart}`,
        {
          product: data.product_id,
          quantity: qty + 1 !== 0 ? qty - data.quantity : 0,
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

  const handleRemove = async () => {
    try {
      setIsLoading(true);
      const res = await axios.delete(`/cart/${auth.user._id}/${cart}`, {
        headers: {
          Authorization: `${auth.token}`,
        },
        data: {
          product: data.product_id,
        },
      });
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
      id={`Modal${index}`}
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <Dialog className="modal-dialog">
        <Content className="modal-content">
          <Header className="modal-header">
            <Title className="modal-title fs-5" id="exampleModalLabel">
              Cập nhật sản phẩm
            </Title>
            <CloseButton
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={() => setQty(-1)}
            />
          </Header>
          <Body className="modal-body">
            <Padding className="ps-3 pe-3 pt-2 pb-2">
              <Thumbnail className="d-flex justify-content-center align-items-center">
                <Slider data={data.product_thumbnails} isSingle={true} />
              </Thumbnail>
              <ProductName className="mt-4 mb-4">
                {data.product_name}
              </ProductName>
              <Brand className="mt-4 mb-4">
                <NormalText>Thương hiệu: </NormalText>
                <BrandName className="text-warning bg-dark bg-gradient p-2 rounded-1 ms-2">
                  {data.product_brand}
                </BrandName>
              </Brand>
              <QuantityGroup className="mt-4 mb-4">
                <ButtonWrapper className="bg-light bg-gradient rounded-2">
                  <Minus
                    onClick={() => {
                      if (qty <= 0 && qty !== -1) {
                        return;
                      }
                      if (qty === -1) {
                        setQty(data.quantity - 1);
                      } else {
                        setQty(qty - 1);
                      }
                    }}
                  >
                    <Remove />
                  </Minus>
                  <Num>{qty === -1 ? data.quantity : qty}</Num>
                  <Plus
                    onClick={() => {
                      if (qty >= 10) {
                        toast.warning("Đã đạt giới hạn sản phẩm cho phép");
                        return;
                      }
                      if (qty === -1) {
                        setQty(data.quantity + 1);
                      } else {
                        setQty(qty + 1);
                      }
                    }}
                  >
                    <Add />
                  </Plus>
                </ButtonWrapper>
              </QuantityGroup>
              <Price className="mt-4 mb-4">
                <NormalText>Giá: </NormalText>
                <Money>
                  {parseFloat(data.price).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })}
                </Money>
              </Price>
            </Padding>
          </Body>
          <Footer className="modal-footer">
            <EndTaskButton
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={() => setQty(-1)}
            >
              Đóng
            </EndTaskButton>
            <RemoveButton
              type="button"
              className="btn btn-danger"
              onClick={handleRemove}
            >
              {!isLoading ? "Xoá" : "Đang tải"}
            </RemoveButton>
            <UpdateButton
              type="button"
              className="btn btn-primary"
              onClick={handleUpdate}
            >
              {!isLoading ? "Cập nhật" : "Đang tải"}
            </UpdateButton>
          </Footer>
        </Content>
      </Dialog>
    </Container>
  );
};

export default Modal;
