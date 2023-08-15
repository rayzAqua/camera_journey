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

const AreaContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
`;

const CustomeDiv = styled.div``;

const CustomeInput = styled.input``;

const CustomeButton = styled.button``;

const OrderModal = ({ customer, cart }) => {
  const [auth, setAuth] = useAuthContext();
  const navigate = useNavigate();

  const [qty, setQty] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  const [confirm, setConfirm] = useState(false);

  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [info, setInfo] = useState({
    fname: customer.fname,
    lname: customer.lname,
    email: customer.email,
    phone: customer.phone,
    address: {
      street: customer.address.street,
      district: customer.address.district,
      city: customer.address.city,
      country: customer.address.country,
    },
  });

  const total = cart?.items?.reduce((accu, curr) => {
    return accu + Number(curr.price) * curr.quantity;
  }, 0);

  const handleChangeInfo = () => {
    setInfo({
      fname: fname !== "" ? fname : customer?.fname,
      lname: lname !== "" ? lname : customer?.lname,
      email: email !== "" ? email : customer?.email,
      phone: phone !== "" ? phone : customer?.phone,
      address: {
        street: street !== "" ? street : customer?.address.street,
        district: district !== "" ? district : customer?.address.district,
        city: city !== "" ? city : customer?.address.city,
        country: country !== "" ? country : customer?.address.country,
      },
    });
    setConfirm(false);
  };

  const handleCreateOrder = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        `/order/${auth.user._id}`,
        {
          customer: {
            fname: info.fname,
            lname: info.lname,
            email: info.email,
            phone: info.phone,
          },
          cartId: cart._id,
          shipping_address: {
            street: info.address.street,
            district: info.address.district,
            city: info.address.city,
            country: info.address.country,
          },
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
                <AreaContainer>
                  <AreaTitle className="text-danger-subtle">
                    Thông tin giao hàng
                  </AreaTitle>
                  {confirm ? (
                    <button
                      className="btn btn-success rounded-2"
                      onClick={handleChangeInfo}
                    >
                      Xác nhận
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary text-white"
                      onClick={() => setConfirm(true)}
                    >
                      Thay đổi
                    </button>
                  )}
                </AreaContainer>

                <hr />
                {!confirm ? (
                  <AreaBody>
                    <NameWrapper>
                      <NormalText>Họ tên:</NormalText>
                      <Name className="text-secondary ms-2">
                        {info.fname} {info.lname}
                      </Name>
                    </NameWrapper>
                    <EmailWrapper>
                      <NormalText>Email:</NormalText>
                      <Email className="text-secondary ms-2">
                        {info.email}
                      </Email>
                    </EmailWrapper>
                    <PhoneWrapper>
                      <NormalText>Số điện thoại:</NormalText>
                      <Phone className="text-secondary ms-2">
                        {info.phone}
                      </Phone>
                    </PhoneWrapper>
                    <AddressWrapper>
                      <NormalText>Địa chỉ giao hàng:</NormalText>
                      <Address className="text-secondary ms-2">
                        {info.address.street}, {info.address.district},{" "}
                        {info.address.city}, {info.address.country}
                      </Address>
                    </AddressWrapper>
                  </AreaBody>
                ) : (
                  <AreaBody>
                    <NormalText className="p-1">Người nhận</NormalText>
                    <CustomeDiv className="mt-2 mb-3 input-group">
                      <CustomeInput
                        type="text"
                        className="form-control rounded-0 border-0 border-bottom bg-light"
                        placeholder={info.fname}
                        autoFocus
                        value={fname}
                        onChange={(e) => setFname(e.target.value)}
                      />
                      <CustomeInput
                        type="text"
                        className="form-control rounded-0 border-0 border-bottom bg-light ms-4"
                        placeholder={info.lname}
                        value={lname}
                        onChange={(e) => setLname(e.target.value)}
                      />
                    </CustomeDiv>
                    <NormalText className="p-1">Email</NormalText>
                    <CustomeDiv className="mt-2 mb-3">
                      <CustomeInput
                        type="email"
                        className="form-control rounded-0 border-0 border-bottom bg-light"
                        placeholder={info.email}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </CustomeDiv>
                    <NormalText className="p-1">Số điện thoại</NormalText>
                    <CustomeDiv className="mt-2 mb-3">
                      <CustomeInput
                        type="text"
                        className="form-control rounded-0 border-0 border-bottom bg-light"
                        placeholder={info.phone}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </CustomeDiv>
                    <NormalText className="p-1">Địa chỉ giao hàng</NormalText>
                    <CustomeDiv className="mt-2 mb-3 input-group">
                      <CustomeInput
                        type="text"
                        className="form-control rounded-0 border-0 border-bottom bg-light"
                        placeholder={info.address.street}
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                      />
                      <CustomeInput
                        type="text"
                        className="form-control rounded-0 border-0 border-bottom bg-light ms-4"
                        placeholder={info.address.district}
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                      />
                    </CustomeDiv>
                    <CustomeDiv className="mb-3 input-group">
                      <CustomeInput
                        type="text"
                        className="form-control rounded-0 border-0 border-bottom bg-light"
                        placeholder={info.address.city}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                      <CustomeInput
                        type="text"
                        className="form-control rounded-0 border-0 border-bottom bg-light ms-4"
                        placeholder={info.address.country}
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </CustomeDiv>
                  </AreaBody>
                )}
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
              disabled={isLoading || confirm}
            >
              {!isLoading
                ? !confirm
                  ? "Thanh toán"
                  : "Cần xác nhận địa chỉ"
                : "Đang tải"}
            </UpdateButton>
          </Footer>
        </Content>
      </Dialog>
    </Container>
  );
};

export default OrderModal;
