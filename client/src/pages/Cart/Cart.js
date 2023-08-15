import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { useAuthContext } from "../../context/auth";
import { styled } from "styled-components";
import useFetch from "../../hooks/useFetch";
import { toast } from "react-toastify";
import { Add, ChevronLeft, Remove } from "@material-ui/icons";
import Modal from "../../components/Modal/Modal";
import CartItem from "../../components/Cart/CartItem";
import OrderModal from "../../components/Modal/OrderModal";

const Container = styled.div``;

const Row = styled.div``;

const ErrorDiv = styled.div``;

const Left = styled.div``;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const BackButton = styled.p`
  position: absolute;
  text-align: left;
  font-weight: 500;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin: 0;
  &:hover {
    color: gray;
    cursor: pointer;
  }
`;

const TitleName = styled.h4`
  text-align: center;
  font-weight: 700;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin: 0 auto;
`;

const CartContainer = styled.div``;

const Right = styled.div``;

const PaymentContainer = styled.div`
  width: 30%;
`;

const RightTitleWrapper = styled.div``;

const RightTitle = styled.h5`
  font-weight: bold;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin: 0 auto;
`;

const Money = styled.span`
  font-weight: 500;
`;

const Line = styled.hr``;

const ButtonContainer = styled.div``;

const ButtonGroup = styled.div``;

const Button = styled.button``;

const Loading = styled.h4`
  text-align: start;
  margin-bottom: 35px;
  font-weight: 700;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const NotFound = styled.div`
  font-weight: 500;
`;

const CartPage = () => {
  const [auth, setAuth] = useAuthContext();
  const navigate = useNavigate();

  const { data, loading, error } = useFetch(`/cart/${auth.user._id}`, {
    headers: {
      Authorization: `${auth.token}`,
    },
  });

  const total = data?.cart?.items?.reduce((accu, curr) => {
    return accu + Number(curr.price) * curr.quantity;
  }, 0);

  return (
    <Layout>
      <ErrorDiv>
        {error && toast.error(`${error.response.data.message}`)}
      </ErrorDiv>
      <Container className="container p-4">
        {loading ? (
          <Loading className="text-center">Loading...</Loading>
        ) : (
          <Row className="row mt-5 mb-5">
            <Left className="col-md-8">
              <Title className="mb-3 p-1">
                <BackButton
                  className="btn btn-dark text-warning"
                  onClick={() => navigate(-1)}
                >
                  <ChevronLeft />
                  Trở về
                </BackButton>
                <TitleName>Giỏ hàng</TitleName>
              </Title>
              <CartContainer>
                {data.cart && data.cart.items.length > 0 ? (
                  data?.cart?.items?.map((cartItem, index) => (
                    <CartItem
                      key={index}
                      data={cartItem}
                      index={index}
                      onlyRead={false}
                    />
                  ))
                ) : (
                  <NotFound>Không có sản phẩm nào trong giỏ hàng</NotFound>
                )}
              </CartContainer>
            </Left>
            <Right className="col-md-4">
              <PaymentContainer className="bg-light border-0 rounded-2 shadow p-3 position-fixed mt-5">
                <RightTitleWrapper className=" text-center">
                  <RightTitle>
                    Tổng tiền tạm tính:{" "}
                    <Money className="text-secondary">
                      {parseFloat(total).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </Money>
                  </RightTitle>
                </RightTitleWrapper>
                <Line />
                <ButtonContainer className="p-2">
                  <ButtonGroup className="mb-3">
                    <Button
                      className="btn btn-success w-100 mb-2 mt-2"
                      data-bs-toggle="modal"
                      data-bs-target="#OrderModal"
                      disabled={!(data.cart && data.cart.items.length > 0)}
                    >
                      {!loading ? "Thanh toán" : "Đang tải..."}
                    </Button>
                    <Button
                      className="btn btn-outline-success w-100 mb-2 mt-2"
                      onClick={() => navigate(`/shop`)}
                    >
                      Chọn thêm sản phẩm khác
                    </Button>
                  </ButtonGroup>
                </ButtonContainer>
              </PaymentContainer>
            </Right>
          </Row>
        )}
        {data.cart &&
          data.cart.items.map((cartItem, index) => (
            <Modal
              key={index}
              product={cartItem}
              index={index}
              cart={data.cart._id}
            />
          ))}
        {data.cart && (
          <OrderModal customer={data.cart.customer} cart={data.cart} />
        )}
      </Container>
    </Layout>
  );
};

export default CartPage;
