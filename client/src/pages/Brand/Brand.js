import React from "react";
import { styled } from "styled-components";
import Layout from "../../components/Layout/Layout.js";
import Sidebar from "../../components/Sidebar/Sidebar.js";
import Product from "../../components/Product/Product.js";
import { useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch.js";
import { Search } from "@material-ui/icons";
import BrandSideBar from "../../components/Sidebar/BrandSideBar.js";

const Container = styled.div``;

const Row = styled.div``;

const Title = styled.h5``;

const SidebarContainer = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
`;

const ProductContainer = styled.div``;

const ListProduct = styled.div``;

const ListItem = styled.div``;

const Loading = styled.h4`
  text-align: start;
  margin-bottom: 35px;
  font-weight: 700;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const BrandName = styled.span`
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 2px;
  margin-left: 5px;
  margin: 0 auto;
`;

const NotFound = styled.div`
  font-weight: 500;
`;

const Brand = () => {
  const location = useLocation();
  const brandid = location.pathname.split("/")[2];

  const { data, loading, error } = useFetch(`/brand/${brandid}`);

  return (
    <Layout>
      <Container className="container pt-4 pb-4">
        {loading ? (
          <Loading className="text-center">Loading...</Loading>
        ) : (
          <Row className="row">
            <SidebarContainer className="col-lg-3">
              <BrandSideBar />
            </SidebarContainer>
            <ProductContainer className="col-lg-9">
              <Title className="p-2 mt-3">
                <Search style={{ fontSize: "25px", margin: 0 }} />
                <BrandName>
                  {`Tìm thấy ${data?.brand?.products?.length} sản phẩm`}
                </BrandName>
              </Title>
              <ListProduct className="row row-cols-2 row-cols-lg-4 g-2">
                {data?.brand?.products?.length !== 0 ? (
                  data?.brand?.products?.map((item) => (
                    <ListItem className="col">
                      <Product
                        key={item._id}
                        productid={item._id}
                        image={item.product_thumbnails[0]}
                        title={item.product_name}
                        price={item.price}
                        status={item.stocking}
                        category={item.product_category}
                      />
                    </ListItem>
                  ))
                ) : (
                  <NotFound>Không tìm thấy sản phẩm nào</NotFound>
                )}
              </ListProduct>
            </ProductContainer>
          </Row>
        )}
      </Container>
    </Layout>
  );
};

export default Brand;
