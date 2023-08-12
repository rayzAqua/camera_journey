import React from "react";
import styled from "styled-components";
import { ToastContainer } from "react-toastify";
import Header from "./Header.js";
import Footer from "./Footer.js";

const Div = styled.div``;

const Main = styled.main`
  min-height: 100vh;
  background-color: transparent;
`;

const Layout = ({ children }) => {
  return (
    <Div>
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
      <Header />
      <Main className="bg-white">{children}</Main>
      <Footer />
    </Div>
  );
};

export default Layout;
