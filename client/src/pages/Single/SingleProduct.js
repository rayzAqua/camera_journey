import React, { useState } from "react";
import { styled } from "styled-components";
import { NavLink, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/auth.js";
import useFetch from "../../hooks/useFetch.js";
import Layout from "../../components/Layout/Layout.js";
import Slider from "../../components/Slider/Slider.js";
import { Add, Remove } from "@material-ui/icons";
import { toast } from "react-toastify";

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

const SingleProduct = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const productid = location.pathname.split("/")[2];
  console.log(path, productid);
  const { data, loading, error } = useFetch(`/product/${productid}`);

  const sliderData = data?.product?.product_thumbnails?.map((image) => {
    return { isSingle: true, image: image };
  });

  const price = parseFloat(data?.product?.price).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  const [qty, setQty] = useState(1);

  const handlePlusQty = () => {
    if (qty >= data.product.quantity) {
      toast.warn(`Sản phẩm hiện chỉ còn ${qty} sản phẩm`);
    } else {
      setQty(qty + 1);
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
          <Row className="row">
            <SliderContainer className="col-lg-7">
              <SliderWrapper className="bg-secondary-subtle rounded-2">
                <Slider data={sliderData}></Slider>
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
                              {item}:
                            </Capitalize>
                            <Capitalize>
                              {" "}
                              {data.product.details[item]}
                            </Capitalize>
                          </DetailItem>
                        ))}
                    </Detail>
                  ))}

                <ButtonContainer className="mt-5 mb-2">
                  <QuantityGroup>
                    <ButtonWrapper>
                      <Minus onClick={() => qty > 0 && setQty(qty - 1)}>
                        <Remove />
                      </Minus>
                      <Num>{qty >= 1 && qty <= 9 ? `0${qty}` : qty}</Num>
                      <Plus>
                        <Add onClick={handlePlusQty} />
                      </Plus>
                    </ButtonWrapper>
                  </QuantityGroup>

                  <CustomeNavLink
                    to="/shop"
                    className="btn btn-dark border-0 rounded-0 mt-3"
                  >
                    Thêm vào giỏ hàng
                  </CustomeNavLink>
                </ButtonContainer>
              </Wrapper>
            </DetailContainer>
          </Row>
        </Container>
      )}
    </Layout>
  );
};

export default SingleProduct;
