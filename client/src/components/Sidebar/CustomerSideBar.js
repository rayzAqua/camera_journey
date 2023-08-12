import React from "react";
import { NavLink } from "react-router-dom";
import { styled } from "styled-components";
import useFetch from "../../hooks/useFetch";

const Container = styled.div`
  box-shadow: 0px 0px 4px 0.5px rgba(0, 0, 0, 0.1);
`;

const Title = styled.div``;

const ListItem = styled.div`
  overflow-x: auto;

  @media screen and (max-width: 300px) {
    overflow-x: scroll;
    white-space: nowrap;
  }
`;

const CustomeNavLink = styled(NavLink)``;

const CustomerSideBar = ({ customeid }) => {
  return (
    <Container className="h-100 list-group rounded-2">
      <Title className="d-none d-lg-block list-group-item text-center text-bg-warning border-0 rounded-bottom-0">
        Chức năng
      </Title>
      <ListItem className="d-flex flex-row d-lg-block list-group rounded-top-0 rounded-bottom-0 text-center">
        <CustomeNavLink
          to={`/profile/${customeid}`}
          className="list-group-item list-group-item-action border-0"
        >
          Thông tin cá nhân
        </CustomeNavLink>
        <CustomeNavLink
          to={`/profile/update/${customeid}`}
          className="list-group-item list-group-item-action border-0"
        >
          Cập nhập thông tin
        </CustomeNavLink>
        <CustomeNavLink
          to={`/profile/change-password/${customeid}`}
          className="list-group-item list-group-item-action border-0"
        >
          Thay đổi mật khẩu
        </CustomeNavLink>
        <CustomeNavLink
          to={`/order/${customeid}`}
          className="list-group-item list-group-item-action border-0"
        >
          Lịch sử đặt hàng
        </CustomeNavLink>
        <CustomeNavLink
          to={`/`}
          className="list-group-item list-group-item-action border-0"
        >
          Trở về trang chủ
        </CustomeNavLink>
      </ListItem>
    </Container>
  );
};

export default CustomerSideBar;
