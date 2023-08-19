import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../contexts/auth";
import Layout from "../../components/Layout/Layout";
import axios from "axios";
import styled from "styled-components";
import Datatable from "../../components/Datatable/Datatable";
import { order_columns } from "../../utils/datatables";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import PersonIcon from "@mui/icons-material/Person";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ReceiptIcon from "@mui/icons-material/Receipt";

const HomeContainer = styled.div`
  padding: 20px;
`;

const StatCard = styled.div`
  background-color: #f7f7f7;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 20px;
`;

const StatTitle = styled.h5`
  text-transform: uppercase;
  font-weight: 600;
`;

const StatContent = styled.p`
  font-weight: bold;
  font-size: 24px;
`;

const Home = () => {
  const [auth, setAuth] = useAuthContext();
  const [order, setOrder] = useState("");
  const [customer, setCustomer] = useState("");
  const [staff, setStaff] = useState("");
  const [product, setProduct] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const resOrder = await axios.get(`/order/${auth.user._id}`, {
          headers: {
            Authorization: `${auth.token}`,
          },
        });
        setOrder(resOrder.data.order);
        const resCustomer = await axios.get(`/customer/${auth.user._id}`, {
          headers: {
            Authorization: `${auth.token}`,
          },
        });
        setCustomer(resCustomer.data.customer);
        const resStaff = await axios.get(`/user/${auth.user._id}`, {
          headers: {
            Authorization: `${auth.token}`,
          },
        });
        setStaff(resStaff.data.user);
        const resProduct = await axios.get(`/product/`);
        setProduct(resProduct.data.product);
      } catch (err) {
        setError(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <Layout>
      <HomeContainer className="container mt-3 mb-3">
        {!loading ? (
          <div className="row">
            <div className="col-md-3">
              <StatCard>
                <StatTitle>Đơn đặt</StatTitle>
                <hr />
                <StatContent>
                  <ReceiptIcon /> {order?.length}
                </StatContent>
              </StatCard>
            </div>
            <div className="col-md-3">
              <StatCard>
                <StatTitle>Khách hàng</StatTitle>
                <hr />
                <StatContent>
                  <PersonIcon /> {customer?.length}
                </StatContent>
              </StatCard>
            </div>
            <div className="col-md-3">
              <StatCard>
                <StatTitle>Nhân viên</StatTitle>
                <hr />
                <StatContent>
                  <SupportAgentIcon /> {staff?.length}
                </StatContent>
              </StatCard>
            </div>
            <div className="col-md-3">
              <StatCard>
                <StatTitle>Sản phẩm</StatTitle>
                <hr />
                <StatContent>
                  <CameraAltIcon /> {product?.length}
                </StatContent>
              </StatCard>
            </div>
            <Datatable data={order} column={order_columns} />
          </div>
        ) : (
          <h3 className="text-center">Loading...</h3>
        )}
      </HomeContainer>
    </Layout>
  );
};

export default Home;
