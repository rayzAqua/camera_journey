import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import Layout from "../../components/Layout/Layout.js";
import Product from "../../components/Product/Product.js";
import axios from "axios";
import { toast } from "react-toastify";
import { useSearchContext } from "../../context/search.js";

const ListProduct = styled.div``;

const ListItem = styled.div``;

const Search = () => {
  const [input, setInput] = useSearchContext();

  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  return (
    <Layout>
      <div className="container pt-4 pb-4">
        <div className="row">
          <div className="col">
            <h1>
              {input?.results.length !== 0
                ? `Tìm thấy ${input?.results.length} sản phẩm`
                : "Không tìm thấy sản phẩm nào"}
            </h1>

            <ListProduct className="row row-cols-2 row-cols-lg-5 g-2">
              {input?.results.map((item, index) => (
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
              ))}
            </ListProduct>
            {page < totalPage && (
              <div className="text-center">
                <div
                  className="btn btn-primary mt-3"
                  onClick={() => {
                    setPage(page + 1);
                  }}
                >
                  {/* {loading ? "Đang tải..." : `Xem thêm sản phẩm`} */}
                  "Xem thêm"
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
