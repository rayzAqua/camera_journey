import React from "react";
import { useLocation } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { useAuthContext } from "../../contexts/auth";
import { styled } from "styled-components";
import useFetch from "../../hooks/useFetch";
import { toast } from "react-toastify";
import Datatable from "../../components/Datatable/Datatable";
import { product_columns } from "../../utils/datatables.js";
import AddNewModal from "../../components/Modal/AddNewModal";

const ErrorDiv = styled.div``;

const Container = styled.div``;

const Wrapper = styled.div``;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Product = () => {
  const [auth, setAuth] = useAuthContext();
  const location = useLocation();
  const customerId = location.pathname.split("/")[2];

  const { data, loading, error } = useFetch(`/product/`);

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
              <h2 className="text-center text-uppercase">Danh sách sản phẩm</h2>
              {auth?.user?.role === "manager" && (
                <ButtonContainer>
                  <button
                    className="btn btn-success"
                    data-bs-toggle="modal"
                    data-bs-target="#AddNewModal"
                  >
                    Thêm mới
                  </button>
                  <AddNewModal />
                </ButtonContainer>
              )}
              <div className="bg-light mt-3 mb-3">
                {data?.product && (
                  <Datatable data={data.product} column={product_columns} />
                )}
              </div>
            </>
          )}
        </Wrapper>
      </Container>
    </Layout>
  );
};

export default Product;
