import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import Layout from "../../components/Layout/Layout.js";
import Sidebar from "../../components/Sidebar/Sidebar.js";
import Product from "../../components/Product/Product.js";
import axios from "axios";
import { toast } from "react-toastify";
import BrandSideBar from "../../components/Sidebar/BrandSideBar.js";
import { ChevronLeft } from "@material-ui/icons";
import { useNavigate } from "react-router-dom";

const SidebarContainer = styled.div``;

const WrapperBar = styled.div`
  height: 25%;
`;

const ListProduct = styled.div``;

const ListItem = styled.div``;

const BackButton = styled.p`
  font-weight: 500;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 13px;
  margin: 0;
  &:hover {
    color: gray;
    cursor: pointer;
  }
`;

const TitleName = styled.h4`
  font-weight: 700;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin: 0 auto;
`;

const Loading = styled.h4`
  text-align: start;
  margin-bottom: 35px;
  font-weight: 700;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const Shopping = () => {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/product?page=${page}&perPage=9`);
        if (data.length === res.data.total) {
          return;
        }
        setData((data) => [...data, ...res.data.product]);
        setTotalPage(res.data.totalPages);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };
    fetchData();
  }, [page]);

  return (
    <Layout>
      {error && toast.error(error.response.data.message)}
      <div className="container pt-4 pb-4">
        {loading ? (
          <Loading className="text-center">Loading...</Loading>
        ) : (
          <div className="row">
            <SidebarContainer className="col-lg-3">
              <BackButton
                className="btn btn-dark text-warning mt-3 mb-3"
                onClick={() => navigate(-1)}
              >
                <ChevronLeft />
                Trở về
              </BackButton>
              <div>
                <WrapperBar className="mb-4">
                  <Sidebar />
                </WrapperBar>
                <WrapperBar className="mt-4">
                  <BrandSideBar />
                </WrapperBar>
              </div>
            </SidebarContainer>
            <div className="col-lg-9">
              <TitleName className="text-center mt-3 mb-3">
                Mua hàng thoả thích
              </TitleName>
              <ListProduct className="row row-cols-2 row-cols-lg-4 g-2">
                {data && data.length !== 0 ? (
                  data.map((item, index) => (
                    <ListItem className="col" key={index}>
                      <Product
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
              {page < totalPage && (
                <div className="text-center">
                  <div
                    className="btn btn-primary mt-3"
                    onClick={() => {
                      setPage(page + 1);
                    }}
                  >
                    {loading ? "Đang tải..." : `Xem thêm sản phẩm`}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Shopping;
