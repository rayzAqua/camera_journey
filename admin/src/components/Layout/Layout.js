import React from "react";
import styled from "styled-components";
import { ToastContainer } from "react-toastify";
import Header from "./Header.js";
import Footer from "./Footer.js";
import Sidebar from "../Sidebar/Sidebar.js";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  height: 100vh;
  background-color: transparent;
`;

const Row = styled.div``;

const TitleName = styled.span`
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 1px;
  margin-left: 5px;
  cursor: pointer;
`;

const Left = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.8);
  border-left: none;
  border-bottom: none;
  border-color: black;
  height: 100vh;
`;

const SidebarContainer = styled.div``;

const Right = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.8);
  border-right: none;
  border-left: none;
  border-bottom: none;
  border-color: black;
  height: 100vh;
`;

const Top = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.8);
  border-right: none;
  border-left: none;
  border-top: none;
`;

const Wrapper = styled.div``;

const Main = styled.main``;

const MainContent = styled.div``;

const Layout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <Container className="container-fluid">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Row className="row">
        <Left className="col-2 p-0">
          <Top className="sticky-top">
            <Wrapper className="text-center text-warning bg-dark p-4">
              <TitleName onClick={() => navigate("/")}>Ptit admin</TitleName>
            </Wrapper>
          </Top>
          <SidebarContainer>
            <Sidebar />
          </SidebarContainer>
        </Left>
        <Right className="col-10 p-0">
          <Top className="sticky-top">
            <Header />
          </Top>
          <MainContent>
            <Main className="bg-white">{children}</Main>
          </MainContent>
        </Right>
      </Row>
    </Container>
  );
};

export default Layout;
