import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import { NavLink } from "react-router-dom";
import Layout from "../../components/Layout/Layout.js";
import Sidebar from "../../components/Sidebar/Sidebar.js";
import Slider from "../../components/Slider/Slider.js";
import Product from "../../components/Product/Product.js";
import Promo from "../../components/Promo/Promo.js";
import { useAuthContext } from "../../context/auth.js";
import useFetch from "../../hooks/useFetch.js";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { responsive, promoData, sliderData } from "../../utils/fakeData.js";
import BrandSideBar from "../../components/Sidebar/BrandSideBar.js";

const Container = styled.div``;

const Row = styled.div``;

const Title = styled.h4`
  text-align: center;
  margin-bottom: 35px;
  font-weight: 700;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const SidebarContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
  max-height: 420px;
`;

const DisplaySideBar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  margin: 0;
`;

const SliderContainer = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;

const WrapperBar = styled.div``;

const PromoContainer = styled.div``;

const ProductContainer = styled.div``;

const ProductTitle = styled.h4``;

const ListProduct = styled.div``;

const Home = () => {
  const [auth, setAuth] = useAuthContext();
  const { data, loading, error } = useFetch(`/product?perPage=7&sort=desc`);

  return (
    <Layout>
      <Container className="container pt-4 pb-4">
        {loading ? (
          <Title>Loading...</Title>
        ) : (
          <>
            <Row className="row">
              <SidebarContainer className="d-none d-lg-block col-lg-4 col-xxl-2">
                <DisplaySideBar>
                  <WrapperBar className="">
                    <Sidebar />
                  </WrapperBar>
                  <WrapperBar className="">
                    <BrandSideBar />
                  </WrapperBar>
                </DisplaySideBar>
              </SidebarContainer>
              <SliderContainer className="col-lg-8 col-xxl-7">
                <Slider data={sliderData} isSingle={false} />
              </SliderContainer>
              <PromoContainer className="d-none d-xxl-block col-xxl-3">
                {promoData.map((item, index) => (
                  <Promo key={index} image={item.image} name={item.name} />
                ))}
              </PromoContainer>
            </Row>
            <ProductContainer>
              <ProductTitle className="pt-4 pb-0">
                Sản phẩm mới nhất
              </ProductTitle>
              <SidebarContainer className="d-lg-none pt-0 pb-4">
                <Sidebar />
              </SidebarContainer>
              <ListProduct>
                <Carousel
                  responsive={responsive}
                  infinite={true}
                  keyBoardControl={true}
                  removeArrowOnDeviceType={["tablet", "mobile"]}
                >
                  {data.product ? (
                    data.product.map((item) => (
                      <Product
                        key={item._id}
                        productid={item._id}
                        image={item.product_thumbnails[0]}
                        title={item.product_name}
                        price={item.price}
                        status="new"
                        category={item.product_category}
                      />
                    ))
                  ) : (
                    <div />
                  )}
                </Carousel>
              </ListProduct>
            </ProductContainer>
          </>
        )}
      </Container>
    </Layout>
  );
};

export default Home;
