import { Add, Remove } from "@material-ui/icons";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { styled } from "styled-components";
import Slider from "../Slider/Slider";
import axios from "axios";
import { useAuthContext } from "../../context/auth";
import { useNavigate } from "react-router-dom";
import CartPage from "../../pages/Cart/Cart";
import CartItem from "../Cart/CartItem";

const Container = styled.div``;

const Dialog = styled.div``;

const Content = styled.div``;

const Header = styled.div``;

const Title = styled.h1`
  text-transform: uppercase;
`;

const CloseButton = styled.button``;

const Body = styled.div``;

const Padding = styled.div``;

const AreaTitle = styled.h4``;

const AreaBody = styled.div``;

const NormalText = styled.span`
  font-weight: 500;
  font-size: 20px;
`;

const NameWrapper = styled.div`
  font-weight: 500;
  font-size: 20px;
`;

const Name = styled.span`
  font-weight: 500;
  font-size: 20px;
`;

const EmailWrapper = styled.div`
  font-weight: 500;
  font-size: 20px;
`;

const Email = styled.span`
  font-weight: 500;
  font-size: 20px;
`;

const PhoneWrapper = styled.div`
  font-weight: 500;
  font-size: 20px;
`;

const Phone = styled.span`
  font-weight: 500;
  font-size: 20px;
`;

const AddressWrapper = styled.div`
  font-weight: 500;
  font-size: 20px;
`;

const Address = styled.span`
  font-weight: 500;
  font-size: 20px;
`;

const ShipmentContainer = styled.div``;

const CartDetailContainer = styled.div`
  max-height: 580px;
`;

const Price = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const Money = styled.h4``;

const Footer = styled.div`
  width: 50%;
`;

const EndTaskButton = styled.button``;

const UpdateButton = styled.button``;

const OrderModal = ({ customer, cart }) => {
  const [auth, setAuth] = useAuthContext();
  const navigate = useNavigate();

  const [qty, setQty] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const total = cart?.items?.reduce((accu, curr) => {
    return accu + Number(curr.price) * curr.quantity;
  }, 0);

  const handleCreateOrder = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `/order/${auth.user._id}`,
        {
          cartId: cart._id,
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
          navigate(`/`);
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
      id="OrderModal"
      tabIndex={-1}
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <Dialog className="modal-dialog modal-xl">
        <Content className="modal-content">
          <Header className="modal-header">
            <Title
              className="modal-title fs-4 ms-auto text-dark"
              id="exampleModalLabel"
            >
              Xác nhận thanh toán
            </Title>
            <CloseButton
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            />
          </Header>
          <Body className="modal-body bg-light">
            <Padding className="ps-3 pe-3 pt-2 pb-2">
              <ShipmentContainer className="rounded-2 bg-white p-3 mt-2 mb-2">
                <AreaTitle className="text-danger-subtle">
                  Thông tin giao hàng
                </AreaTitle>
                <hr />
                <AreaBody>
                  <NameWrapper>
                    <NormalText>Họ tên:</NormalText>
                    <Name className="text-secondary ms-2">
                      {customer?.fname} {customer?.lname}
                    </Name>
                  </NameWrapper>
                  <EmailWrapper>
                    <NormalText>Email:</NormalText>
                    <Email className="text-secondary ms-2">
                      {customer?.email}
                    </Email>
                  </EmailWrapper>
                  <PhoneWrapper>
                    <NormalText>Số điện thoại:</NormalText>
                    <Phone className="text-secondary ms-2">
                      {customer?.phone}
                    </Phone>
                  </PhoneWrapper>
                  <AddressWrapper>
                    <NormalText>Địa chỉ giao hàng:</NormalText>
                    <Address className="text-secondary ms-2">
                      {customer?.address.street}, {customer?.address.district},{" "}
                      {customer?.address.city}, {customer?.address.country}
                    </Address>
                  </AddressWrapper>
                </AreaBody>
              </ShipmentContainer>
              <CartDetailContainer className="rounded-2 bg-white p-3 mt-2 mb-2 overflow-scroll">
                <AreaTitle>Thông tin giỏ hàng</AreaTitle>
                <hr />
                {cart.items &&
                  cart.items.map((cartItem, index) => (
                    <CartItem
                      key={index}
                      data={cartItem}
                      index={index}
                      onlyRead={true}
                    />
                  ))}
              </CartDetailContainer>
              <Price className="mt-4">
                <AreaTitle>Tổng cộng: </AreaTitle>
                <Money className="text-danger ms-2">
                  {total &&
                    parseFloat(total).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                </Money>
              </Price>
            </Padding>
          </Body>
          <Footer className="modal-footer btn-group ms-auto me-auto">
            <EndTaskButton
              type="button"
              className="btn btn-outline-danger rounded-2 me-2"
              data-bs-dismiss="modal"
              onClick={() => setQty(-1)}
            >
              Huỷ
            </EndTaskButton>
            <UpdateButton
              type="button"
              className="btn btn-success rounded-2 ms-2"
              onClick={handleCreateOrder}
              disabled={isLoading}
            >
              {!isLoading ? "Thanh toán" : "Đang tải"}
            </UpdateButton>
          </Footer>
        </Content>
      </Dialog>
    </Container>
  );
};

export default OrderModal;
