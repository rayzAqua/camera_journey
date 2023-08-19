import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../../contexts/auth";
import useFetch from "../../../hooks/useFetch";
import { styled } from "styled-components";
import { toast } from "react-toastify";
import Layout from "../../../components/Layout/Layout";
import { Box } from "@mui/material";
import Slider from "../../../components/Slider/Slider";
import UpdateModal from "../../../components/Modal/UpdateModal";

const ErrorDiv = styled.div``;

const Container = styled.div``;

const Wrapper = styled.div`
  height: 60vh;
`;

const ButtonContainer = styled.div`
  width: 20%;
`;

const Row = styled.div``;

const SliderContainer = styled.div``;

const SliderWrapper = styled.div``;

const DetailContainer = styled.div``;

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

const Content = styled.div``;

const SingleProduct = () => {
  const [auth, setAuth] = useAuthContext();
  const navigate = useNavigate();

  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const productId = location.pathname.split("/")[2];

  const { data, loading, error } = useFetch(`/product/${productId}`);

  const price = parseFloat(data?.product?.price).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return (
    <Layout>
      <ErrorDiv>
        {error && toast.error(`${error.response.data.message}`)}
      </ErrorDiv>
      <Container className="container">
        <Wrapper className=" p-4 mt-5 mb-5">
          {loading ? (
            <h3 className="text-center">Loading...</h3>
          ) : (
            <>
              <h2 className="text-center text-uppercase">Chi tiết sản phẩm</h2>

              <ButtonContainer className="btn-group">
                <button
                  className="btn btn-danger rounded-2"
                  onClick={() => navigate(-1)}
                >
                  Trở về
                </button>
                {auth?.user?.role === "manager" && (
                  <>
                    <button
                      className="btn btn-primary rounded-2 ms-2"
                      data-bs-toggle="modal"
                      data-bs-target="#UpdateModal"
                    >
                      Cập nhật
                    </button>
                    <UpdateModal product={data?.product} />
                  </>
                )}
              </ButtonContainer>

              <Content className="bg-light mt-3 mb-3">
                <Row className="row">
                  <SliderContainer className="col-lg-5">
                    <SliderWrapper className="rounded-2">
                      <Slider data={data?.product?.product_thumbnails} />
                    </SliderWrapper>
                  </SliderContainer>
                  <DetailContainer className="col-lg-7">
                    <Wrapper className="bg-body-secondary ps-4 pe-4 pt-2 pb-2 rounded-2 overflow-scroll">
                      <Name className="mt-4">
                        {data?.product?.product_name || "NULL"}
                      </Name>
                      <div className="mt-4">
                        <Title>Tình trạng:</Title>{" "}
                        {data?.product?.stocking ? (
                          <span className="text-bg-success p-2 rounded-2 shadow">
                            Còn hàng
                          </span>
                        ) : (
                          <span className="text-bg-danger p-2 rounded-2 shadow">
                            Hết hàng
                          </span>
                        )}
                      </div>
                      <Price className="mt-4">
                        <Title>Giá:</Title> {price}
                      </Price>
                      <div className="mt-4">
                        <Title>Số lượng:</Title> {data?.product?.quantity}
                      </div>
                      <Brand className="mt-4">
                        <Title>Thương hiệu: </Title>
                        <BrandName className="text-warning bg-dark bg-gradient p-2 rounded-1 ms-2">
                          {data?.product?.product_brand}
                        </BrandName>
                      </Brand>

                      <div>
                        <Featured className="mt-4">Danh mục: </Featured>
                        <Category className="mt-2">
                          {data?.product?.product_category.map(
                            (item, index) => (
                              <CategoryName
                                key={index}
                                className="text-light bg-dark rounded-2 p-2 me-3"
                              >
                                {item}
                              </CategoryName>
                            )
                          )}
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
                    </Wrapper>
                  </DetailContainer>
                </Row>
              </Content>
            </>
          )}
        </Wrapper>
      </Container>
    </Layout>
  );
};

export default SingleProduct;
