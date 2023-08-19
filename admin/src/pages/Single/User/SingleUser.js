import React from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthContext } from "../../../contexts/auth";
import useFetch from "../../../hooks/useFetch";
import Layout from "../../../components/Layout/Layout";

const Container = styled.div``;

const Row = styled.div``;

const CustomerContainer = styled.div``;

const Title = styled.h4`
  text-align: center;
  margin-bottom: 35px;
  font-weight: 700;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const InfoList = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const Avatar = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 20px;
`;

const Name = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const InfoItem = styled.div`
  font-size: 18px;
  margin-bottom: 8px;
`;

const Loading = styled.h4`
  text-align: start;
  margin-bottom: 35px;
  font-weight: 700;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const PersonalInfo = ({ user }) => {
  const [auth, setAuth] = useAuthContext();

  const location = useLocation();
  const path = location.pathname.split("/")[1];

  const { data, loading, error } = useFetch(
    `/user/${auth.user._id}/${auth.user._id}`,
    {
      headers: {
        Authorization: `${auth.token}`,
      },
    }
  );

  return (
    <Layout>
      {error && toast.error(error.response.data.message)}
      <Container className="container pt-4 pb-4">
        {loading ? (
          <Loading className="text-center">Loading...</Loading>
        ) : (
          data.user && (
            <CustomerContainer>
              <Title>Thông tin cá nhân</Title>

              <InfoList className="bg-white p-5 rounded-2 shadow">
                <Avatar src={data.user.image} alt="Avatar" />
                <div className="mt-3">
                  <Name>
                    {data.user.fname} {data.user.lname}
                  </Name>
                  <InfoItem>Email: {data.user.email}</InfoItem>
                  <InfoItem>
                    Ngày sinh:{" "}
                    {format(new Date(data.user.birthDate), "dd/MM/yyyy")}
                  </InfoItem>
                  <InfoItem>
                    Giới tính:{" "}
                    {data.user.sexual === "male"
                      ? "Nam"
                      : data.user.sexual === "female"
                      ? "Nữ"
                      : "Khác"}
                  </InfoItem>
                  <InfoItem>Điện thoại: {data.user.phone}</InfoItem>
                  <InfoItem>
                    Chức vụ:{" "}
                    {data.user.role === "manager" ? "Quản lý" : "Nhân viên"}
                  </InfoItem>
                  <InfoItem>
                    Ngày tạo:{" "}
                    {format(
                      new Date(data.user.createdAt),
                      "HH:mm:ss dd/MM/yyyy"
                    )}
                  </InfoItem>
                </div>
              </InfoList>
            </CustomerContainer>
          )
        )}
      </Container>
    </Layout>
  );
};

export default PersonalInfo;
