import React from "react";
import Datatable from "../../components/Datatable/Datatable";
import { useAuthContext } from "../../contexts/auth";
import useFetch from "../../hooks/useFetch";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import { customer_columns } from "../../utils/datatables";
import { styled } from "styled-components";

const ErrorDiv = styled.div``;

const Container = styled.div``;

const Wrapper = styled.div``;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Customer = () => {
  const [auth, setAuth] = useAuthContext();

  const { data, loading, error } = useFetch(`/customer/${auth.user._id}`, {
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
              <h2 className="text-center text-uppercase mb-4">
                Danh sách khách hàng
              </h2>
              <div className="bg-light mt-3 mb-3">
                {data?.customer && (
                  <Datatable data={data.customer} column={customer_columns} />
                )}
              </div>
            </>
          )}
        </Wrapper>
      </Container>
    </Layout>
  );
};

export default Customer;
