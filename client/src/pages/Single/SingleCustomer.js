import React from "react";
import styled from "styled-components";
import { useAuthContext } from "../../context/auth";
import Layout from "../../components/Layout/Layout";
import CustomerSideBar from "../../components/Sidebar/CustomerSideBar";
import { format } from "date-fns";
import useFetch from "../../hooks/useFetch";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

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
  const customerid = location.pathname.split("/")[2];

  const { data, loading, error } = useFetch(
    `/customer/${customerid}/${customerid}`,
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
        <Row className="row">
          <div className="col-lg-3">
            <CustomerSideBar customeid={data?.customer?._id} />
          </div>
          <div className="col-lg-9">
            {loading ? (
              <Loading className="text-center">Loading...</Loading>
            ) : (
              data.customer && (
                <CustomerContainer className="bg-light border border-white rounded-3 p-5 shadow">
                  <Title>Thông tin cá nhân</Title>

                  <InfoList className="bg-white p-5 rounded-2 shadow">
                    <Avatar src={data.customer.image} alt="Avatar" />
                    <div className="mt-3">
                      <Name>
                        {data.customer.fname} {data.customer.lname}
                      </Name>
                      <InfoItem>Email: {data.customer.email}</InfoItem>
                      <InfoItem>
                        Ngày sinh:{" "}
                        {format(
                          new Date(data.customer.birthDate),
                          "dd/MM/yyyy"
                        )}
                      </InfoItem>
                      <InfoItem>Giới tính: {data.customer.sexual}</InfoItem>
                      <InfoItem>Điện thoại: {data.customer.phone}</InfoItem>
                      <InfoItem>
                        Địa chỉ: {data.customer.address.street},{" "}
                        {data.customer.address.district},{" "}
                        {data.customer.address.city},{" "}
                        {data.customer.address.country}
                      </InfoItem>
                      <InfoItem>
                        Ngày tạo:{" "}
                        {format(
                          new Date(data.customer.createdAt),
                          "HH:mm:ss dd/MM/yyyy"
                        )}
                      </InfoItem>
                    </div>
                  </InfoList>
                </CustomerContainer>
              )
            )}
          </div>
        </Row>
      </Container>
    </Layout>
  );
};

export default PersonalInfo;
