import React from "react";
import { styled } from "styled-components";
import Layout from "../../components/Layout/Layout.js";
import Sidebar from "../../components/Sidebar/Sidebar.js";
import Product from "../../components/Product/Product.js";
import { useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch.js";

const Container = styled.div``;

const Row = styled.div``;

const Title = styled.h2``;

const SidebarContainer = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
`;

const ProductContainer = styled.div``;

const ListProduct = styled.div``;

const ListItem = styled.div``;

const Category = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const categoryid = location.pathname.split("/")[2];
  console.log(path, categoryid);

  const { data, loading, error } = useFetch(`/category/${categoryid}`);

  return (
    <Layout>
      <Container className="container pt-4 pb-4">
        <Row className="row">
          <SidebarContainer className="col-lg-3">
            <Sidebar />
          </SidebarContainer>
          <ProductContainer className="col-lg-9">
            <Title className="text-black bg-warning text-center rounded-1 p-2 mt-3">
              {loading ? "Loading..." : data?.category?.category_name}
            </Title>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <ListProduct className="row row-cols-2 row-cols-lg-4 g-2">
                {data?.category?.products?.length !== 0 ? (
                  data?.category?.products?.map((item) => (
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
                  <div>Không tìm thấy sản phẩm nào</div>
                )}
              </ListProduct>
            )}
          </ProductContainer>
        </Row>
      </Container>
    </Layout>
  );
};

export default Category;
