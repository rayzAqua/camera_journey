import React from "react";
import Datatable from "../../components/Datatable/Datatable";
import { useAuthContext } from "../../contexts/auth";
import useFetch from "../../hooks/useFetch";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import { order_columns } from "../../utils/datatables";
import { styled } from "styled-components";

const ErrorDiv = styled.div``;

const Container = styled.div``;

const Wrapper = styled.div``;

const Order = () => {
  const [auth, setAuth] = useAuthContext();

  const { data, loading, error } = useFetch(`/order/${auth.user._id}`, {
    headers: {
      Authorization: `${auth.token}`,
    },
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
              <h2 className="text-center text-uppercase">Danh sách đơn đặt</h2>
              <div className="bg-light mt-3 mb-3">
                {data?.order && (
                  <Datatable data={data.order} column={order_columns} />
                )}
              </div>
            </>
          )}
        </Wrapper>
      </Container>
    </Layout>
  );
};

export default Order;
