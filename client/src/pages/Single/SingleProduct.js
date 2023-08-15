import React, { useState } from "react";
import { styled } from "styled-components";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/auth.js";
import useFetch from "../../hooks/useFetch.js";
import Layout from "../../components/Layout/Layout.js";
import Slider from "../../components/Slider/Slider.js";
import { Add, ChevronLeft, Remove } from "@material-ui/icons";
import { toast } from "react-toastify";
import axios from "axios";

const Container = styled.div`
  box-shadow: 0px 0px 4px 0.5px rgba(0, 0, 0, 0.2);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Row = styled.div`
  height: 100%;
`;

const SliderContainer = styled.div`
  height: 100%;
`;

const SliderWrapper = styled.div`
  height: 100%;
  width: 100%;
  padding-top: 30vh;
  padding-bottom: 30vh;
`;

const DetailContainer = styled.div``;

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`;

const Name = styled.h2`
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const Price = styled.div``;

const Category = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const CategoryName = styled.div``;

const Brand = styled.div``;

const Title = styled.span`
  font-weight: 500;
`;

const BrandName = styled.span``;

const Featured = styled.div`
  font-weight: 500;
`;

const Desc = styled.div`
  font-size: large;
  font-weight: 300;
`;

const Detail = styled.div``;

const DetailTitle = styled.span`
  font-weight: 500;
`;

const DetailItem = styled.div``;

const ButtonContainer = styled.div`
  width: 40%;
`;

const QuantityGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  font-weight: 600;
  background-color: white;
  border-radius: 7px;
`;

const ButtonWrapper = styled.span`
  display: flex;
  width: 70%;
  padding: 7px;
  justify-content: space-between;
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

const CustomeNavLink = styled(NavLink)`
  width: 100%;
  &:hover {
    opacity: 0.5;
    cursor: pointer;
  }
`;

const Capitalize = styled.span`
  text-transform: capitalize;
`;

const Loading = styled.h4`
  text-align: center;
  margin-bottom: 35px;
  font-weight: 700;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const TitleSpan = styled.div`
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

const SingleProduct = () => {
  // Get token from context
  const [auth, setAuth] = useAuthContext();

  const location = useLocation();
  const productid = location.pathname.split("/")[2];

  const { data, loading, error } = useFetch(`/product/${productid}`);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [stocking, setStocking] = useState(false);

  const price = parseFloat(data?.product?.price).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const [qty, setQty] = useState(1);
  const handlePlusQty = () => {
    if (qty >= data.product.quantity) {
      toast.info(`Sản phẩm này hiện chỉ còn ${data.product.quantity} sản phẩm`);
      setStocking(true);
      return;
    } else {
      setStocking(false);
    }
    setQty(qty + 1);
  };
  const handleMinusQty = () => {
    if (qty - 1 <= 0) {
      setQty(qty - 1);
      setStocking(true);
      return;
    } else {
      setStocking(false);
    }
    setQty(qty - 1);
  };

  const cartItem = { product: data?.product?._id, quantity: qty };

  const handleAddCart = async () => {
    try {
      // Check user login
      if (!auth.user) {
        toast.info("Bạn cần đăng nhập để tiếp tục mua hàng");
        setTimeout(() => {
          navigate(`/login`);
        }, 1500);
        return;
      }

      // If have login
      setIsLoading(true);
      const res = await axios.post(`/cart/${auth.user._id}/`, cartItem, {
        headers: {
          Authorization: `${auth.token}`,
        },
      });
      if (res && res.data.success) {
        toast.success(`${res.data.message}`);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        console.log(`${res.data.message}`);
        const update_cart = await axios.put(
          `/cart/${auth.user._id}/${res.data.cart._id}`,
          cartItem,
          {
            headers: {
              Authorization: `${auth.token}`,
            },
          }
        );
        if (update_cart && update_cart.data.success) {
          toast.success(`${update_cart.data.message}`);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          toast.warning(`${update_cart.data.message}`);
        }
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
      {loading ? (
        <Loading className="container mt-5 mb-5 text-center">
          Loading...
        </Loading>
      ) : (
        <Container className="container p-4 mt-5 mb-5 rounded-2">
          <TitleSpan className="mb-3 p-1">
            <BackButton
              className="btn btn-dark text-warning"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft />
              Trở về
            </BackButton>
            <TitleName>Chi tiết sản phẩm</TitleName>
          </TitleSpan>
          <Row className="row">
            <SliderContainer className="col-lg-7">
              <SliderWrapper className="bg-secondary-subtle rounded-2">
                <Slider
                  data={data?.product?.product_thumbnails}
                  isSingle={true}
                ></Slider>
              </SliderWrapper>
            </SliderContainer>
            <DetailContainer className="col-lg-5">
              <Wrapper className="bg-body-secondary ps-4 pe-4 pt-2 pb-2 rounded-2">
                <Name className="mt-4">
                  {data?.product?.product_name || "NULL"}
                </Name>

                <Price className="text-danger mt-4">Giá ưu đãi: {price}</Price>

                <Brand className="mt-4">
                  <Title>Thương hiệu: </Title>
                  <BrandName className="text-warning bg-dark bg-gradient p-2 rounded-1 ms-2">
                    {data?.product?.product_brand}
                  </BrandName>
                </Brand>

                <div>
                  <Featured className="mt-4">Tính năng: </Featured>
                  <Category className="mt-2">
                    {data?.product?.product_category.map((item, index) => (
                      <CategoryName
                        key={index}
                        className="text-light bg-dark rounded-2 p-2 me-3"
                      >
                        {item}
                      </CategoryName>
                    ))}
                  </Category>
                </div>

                <Desc className="mt-4">{data?.product?.desc}</Desc>

                {data?.product?.details &&
                  (loading ? (
                    <div className="text-st">Loading...</div>
                  ) : (
                    <Detail className="mt-4 bg-light rounded-2 p-2">
                      <DetailTitle className="text-decoration-underline text-secondary">
                        Chi tiết:
                      </DetailTitle>
                      {data?.product?.details &&
                        Object.keys(data.product.details).map((item) => (
                          <DetailItem key={item} className="mt-1">
                            <Capitalize className="text-danger">
                              {item}:{" "}
                            </Capitalize>
                            <Capitalize>
                              {data.product.details[item]}
                            </Capitalize>
                          </DetailItem>
                        ))}
                    </Detail>
                  ))}

                {data?.product?.quantity > 0 ? (
                  <ButtonContainer className="mt-5 mb-2">
                    <QuantityGroup>
                      <ButtonWrapper>
                        <Minus onClick={handleMinusQty}>
                          <Remove />
                        </Minus>
                        <Num>{qty >= 1 && qty <= 9 ? `0${qty}` : qty}</Num>
                        <Plus>
                          <Add onClick={handlePlusQty} />
                        </Plus>
                      </ButtonWrapper>
                    </QuantityGroup>

                    <button
                      className="btn btn-dark border-0 rounded-0 mt-3 w-100"
                      onClick={handleAddCart}
                      disabled={stocking}
                    >
                      {!isLoading ? "Thêm vào giỏ hàng" : "Đang tải"}
                    </button>
                  </ButtonContainer>
                ) : (
                  <button
                    className="btn btn-dark border-0 rounded-0 mt-3 w-100"
                    onClick={handleAddCart}
                    disabled={true}
                  >
                    Hết hàng
                  </button>
                )}
              </Wrapper>
            </DetailContainer>
          </Row>
        </Container>
      )}
    </Layout>
  );
};

export default SingleProduct;
