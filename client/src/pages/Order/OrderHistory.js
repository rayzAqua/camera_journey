import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import { useAuthContext } from "../../context/auth";
import { styled } from "styled-components";
import Slider from "../../components/Slider/Slider";
import axios from "axios";
import CustomerSideBar from "../../components/Sidebar/CustomerSideBar";
import useFetch from "../../hooks/useFetch";
import { toast } from "react-toastify";
import { format } from "date-fns";
import CartItem from "../../components/Cart/CartItem";

const ErrorDiv = styled.div``;

const Container = styled.div``;

const Row = styled.div``;

const SidebarContainer = styled.div``;

const OrderList = styled.div``;

const Title = styled.h2`
  text-align: center;
  font-weight: 700;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin: 0 auto;
`;

const OrderItem = styled.div``;

const Table = styled.table``;

const TableHeader = styled.thead``;

const OrderHeader = styled.th``;

const StatusHeader = styled.th``;

const CustomerHeader = styled.th``;

const CreateDateHeader = styled.th``;

const PaymentHeader = styled.th``;

const QuantityHeader = styled.th``;

const TotalHeader = styled.th``;

const TableBody = styled.tbody``;

const Data = styled.tr``;

const Order = styled.td`
  font-weight: 500;
  text-transform: capitalize;
`;

const StatusBody = styled.td`
  text-transform: capitalize;
`;

const Customer = styled.td``;

const CreatedDate = styled.td`
  text-transform: capitalize;
`;

const PaymentStatus = styled.td`
  font-weight: 500;
  text-transform: capitalize;
`;

const ItemQuantity = styled.td`
  text-transform: capitalize;
`;

const TotalPrice = styled.td`
  text-transform: capitalize;
`;

const BoughtItem = styled.div`
  max-height: 300px;
`;

const Item = styled.div``;

const Loading = styled.h4`
  text-align: start;
  margin-bottom: 35px;
  font-weight: 700;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const OrderHistory = () => {
  const [auth, setAuth] = useAuthContext();
  const location = useLocation();
  const customerId = location.pathname.split("/")[2];

  const { data, loading, error } = useFetch(
    `/order/${auth.user._id}/${customerId}`,
    {
      headers: {
        Authorization: `${auth.token}`,
      },
    }
  );

  return (
    <Layout>
      <ErrorDiv>
        {error && toast.error(`${error.response.data.message}`)}
      </ErrorDiv>
      <Container className="container pt-4 pb-4">
        <Row className="row">
          <SidebarContainer className="col-lg-3">
            <CustomerSideBar customeid={auth?.user?._id} />
          </SidebarContainer>
          <OrderList className="col-md-9">
            {loading ? (
              <Loading className="text-center">Loading...</Loading>
            ) : (
              <>
                <Title className="text-center mb-4">Đơn đặt hàng</Title>
                {data?.order?.length !== 0 ? (
                  data?.order?.orders?.map((item, index) => {
                    return (
                      <OrderItem className="border shadow p-3">
                        <Table className="table">
                          <TableHeader>
                            <Data>
                              <OrderHeader scope="col" className="text-center">
                                #
                              </OrderHeader>
                              <StatusHeader scope="col" className="text-center">
                                Trạng thái
                              </StatusHeader>
                              <CustomerHeader scope="col">
                                Khách hàng
                              </CustomerHeader>
                              <CreateDateHeader
                                scope="col"
                                className="text-center"
                              >
                                Ngày lập
                              </CreateDateHeader>
                              <PaymentHeader
                                scope="col"
                                className="text-center"
                              >
                                Thanh toán
                              </PaymentHeader>
                              <QuantityHeader
                                scope="col"
                                className="text-center"
                              >
                                Số lượng sản phẩm
                              </QuantityHeader>
                              <TotalHeader scope="col" className="text-center">
                                Tổng tiền
                              </TotalHeader>
                            </Data>
                          </TableHeader>
                          <TableBody>
                            <Data>
                              <Order className="text-center text-secondary">
                                {index + 1}
                              </Order>
                              <StatusBody
                                className={`text-center ${
                                  item?.status === "pending"
                                    ? "text-secondary"
                                    : item?.status === "process"
                                    ? "text-warning"
                                    : item?.status === "complete"
                                    ? "text-success"
                                    : item?.status === "cancel"
                                    ? "text-danger"
                                    : item?.status === "shipping"
                                    ? "text-primary"
                                    : ""
                                }`}
                              >
                                {item?.status}
                              </StatusBody>
                              <Customer className="text-dark">
                                {data?.order?.fname} {data?.order?.lname}
                              </Customer>
                              <CreatedDate>
                                {format(
                                  new Date(data?.order?.createdAt),
                                  "HH:mm:ss dd/MM/yyyy"
                                )}
                              </CreatedDate>
                              <PaymentStatus
                                className={
                                  false
                                    ? "text-success p-1 text-center"
                                    : "text-danger p-1 text-center"
                                }
                              >
                                {false ? "Đã thanh toán" : "Chưa thanh toán"}
                              </PaymentStatus>
                              <ItemQuantity className="text-center">
                                {item?.cart?.length}
                              </ItemQuantity>
                              <TotalPrice className="text-center">
                                {parseFloat(item?.total).toLocaleString(
                                  "vi-VN",
                                  {
                                    style: "currency",
                                    currency: "VND",
                                  }
                                )}
                              </TotalPrice>
                            </Data>
                          </TableBody>
                        </Table>
                        <BoughtItem className="container overflow-scroll">
                          {item?.cart?.map((cartItem, index) => (
                            <Item
                              className="row mb-2 p-3 card flex-row"
                              key={index}
                            >
                              <CartItem
                                key={index}
                                data={cartItem}
                                index={index}
                                onlyRead={true}
                              />
                            </Item>
                          ))}
                        </BoughtItem>
                      </OrderItem>
                    );
                  })
                ) : (
                  <h4 className="text-center">Không tìm thấy đơn đặt nào</h4>
                )}
              </>
            )}
          </OrderList>
        </Row>
      </Container>
    </Layout>
  );
};

export default OrderHistory;
