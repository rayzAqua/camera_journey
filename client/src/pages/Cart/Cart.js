import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { useAuthContext } from "../../context/auth";
import { useCartContext } from "../../context/cart";
import { styled } from "styled-components";
import Slider from "../../components/Slider/Slider";

const Title = styled.h1`
  text-align: start;
  font-weight: 700;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const ItemContainer = styled.div`
  margin-right: 7px;
  margin-left: 7px;
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.02);
  }
`;

const Thumbnail = styled.div`
  margin: auto;
`;

const Right = styled.div``;

const UserInfoContainer = styled.div`
  width: 30%;
`;

const CartPage = () => {
  const [auth, setAuth] = useAuthContext();
  const [cart, setCart] = useCartContext();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="container p-4 mt-5 mb-5">
        <div className="row">
          <Title className="mb-3">Giỏ hàng</Title>
          <div className="col-md-8">
            <div className="bg-warning-subtle border-0 rounded-2 shadow p-3">
              <ItemContainer
                className="row mt-2 mb-2 p-3 flex-row bg-white border-2 rounded-2 shadow"
                onClick={() => navigate(`/shop/lskdjfaksdfhasjd`)}
              >
                <Thumbnail className="col-md-4 bg-light text-center">
                  <Slider
                    data={[
                      {
                        isSingleProduct: true,
                        image:
                          "https://i.ibb.co/NrS4tp0/image-removebg-preview.png",
                      },
                      {
                        isSingleProduct: true,
                        image:
                          "https://i.ibb.co/NrS4tp0/image-removebg-preview.png",
                      },
                    ]}
                  />
                </Thumbnail>
                <div className="col-md-8">
                  <div className="ps-3 pe-3 pt-2 pb-2">
                    <h5 className="mb-3 mt-3">Sản phẩm 1</h5>
                    <p className="mb-2 mt-2">Hãng 1</p>
                    <p className="mb-2 mt-2">Số lượng: 10</p>
                    <p className="mb-2 mt-2">Price : 100.000 đ</p>
                    <button
                      className="btn btn-danger mt-3 mb-3"
                      // onClick={() => removeCartItem(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </ItemContainer>
            </div>
          </div>
          <Right className="col-md-4">
            <UserInfoContainer className="bg-light border-0 rounded-2 shadow p-3 position-fixed">
              <div className=" text-center">
                <h2>Thông tin thanh toán</h2>
                <p>Tổng | Địa chỉ giao hàng | Thanh toán</p>
              </div>
              <hr />
              <div className="p-2">
                {auth?.user?.address ? (
                  <>
                    <div className="mb-3">
                      <h5>
                        Khách hàng:{" "}
                        <span>
                          {auth?.user?.fname} {auth?.user?.lname}
                        </span>
                      </h5>
                      <h5>
                        Địa chỉ giao hàng: {auth?.user?.address.street},{" "}
                        {auth?.user?.address.district},{" "}
                        {auth?.user?.address.city},{" "}
                        {auth?.user?.address.country}
                      </h5>
                      {/* <h4>Total : {totalPrice()} </h4> */}
                      <h5>Tổng tiền : 0 </h5>
                      <button
                        className="btn btn-success"
                        onClick={() =>
                          navigate(`/profile/update/${auth.user._id}`)
                        }
                      >
                        Thanh toán
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mb-3">
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate(`/profile/update/${auth.user._id}`)
                      }
                    >
                      Thêm địa chỉ giao hàng
                    </button>
                  </div>
                )}
              </div>
            </UserInfoContainer>
          </Right>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
