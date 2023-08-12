import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout/Layout.js";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 85vh;
`;

const Image = styled.img`
  width: 300px;
  height: 300px;
`;

const Title = styled.h1`
  font-size: 45px;
  font-weight: 700;
`;

const Message = styled.h2`
  font-weight: normal;
`;

const CustomeLink = styled(Link)`
  margin-top: 20px;
  padding: 5px 10px;
  border: 2px solid blue;
  border-radius: 5px;
  text-decoration: none;
  color: blue;

  &:hover {
    opacity: 0.5;
  }
`;

const PageNotFound = () => {
  return (
    <Layout>
      <Container>
        <Image src="https://img.freepik.com/free-vector/oops-404-error-with-broken-robot-concept-illustration_114360-5529.jpg?w=740&t=st=1689290086~exp=1689290686~hmac=546a9d0635d9d9d033e4a37d0e8b61051272596878dcd7eb3c73dfce032187cb" />
        <Title>404 Not Found</Title>
        <Message>Không tìm thấy trang</Message>
        <CustomeLink to="/">Trở về trang chủ</CustomeLink>
      </Container>
    </Layout>
  );
};

export default PageNotFound;
