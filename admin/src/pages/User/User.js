import React from "react";
import Datatable from "../../components/Datatable/Datatable";
import { useAuthContext } from "../../contexts/auth";
import useFetch from "../../hooks/useFetch";
import Layout from "../../components/Layout/Layout";
import { toast } from "react-toastify";
import { user_columns } from "../../utils/datatables";
import { styled } from "styled-components";
import AddNewStaffModal from "../../components/Modal/AddNewStaff";

const ErrorDiv = styled.div``;

const Container = styled.div``;

const Wrapper = styled.div``;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const User = () => {
  const [auth, setAuth] = useAuthContext();

  const { data, loading, error } = useFetch(`/user/${auth.user._id}`, {
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
              <h2 className="text-center text-uppercase">
                Danh sách nhân viên
              </h2>
              {auth?.user?.role === "manager" && (
                <ButtonContainer>
                  <button
                    className="btn btn-success"
                    data-bs-toggle="modal"
                    data-bs-target="#AddNewStaffModal"
                  >
                    Thêm mới
                  </button>
                  <AddNewStaffModal />
                </ButtonContainer>
              )}
              <div className="bg-light mt-3 mb-3">
                {data?.user && (
                  <Datatable data={data.user} column={user_columns} />
                )}
              </div>
            </>
          )}
        </Wrapper>
      </Container>
    </Layout>
  );
};

export default User;
