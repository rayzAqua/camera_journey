import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import Layout from "../../components/Layout/Layout.js";
import Sidebar from "../../components/Sidebar/Sidebar.js";
import Product from "../../components/Product/Product.js";
import axios from "axios";
import { toast } from "react-toastify";

const SidebarContainer = styled.div``;

const ListProduct = styled.div``;

const ListItem = styled.div``;

const Shopping = () => {
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
        <div className="row">
          <SidebarContainer className="col-lg-3">
            <Sidebar />
          </SidebarContainer>
          <div className="col-lg-9">
            <h1>Mua hàng thoả thích</h1>

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
      </div>
    </Layout>
  );
};

export default Shopping;
