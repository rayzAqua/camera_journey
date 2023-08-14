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

const TitleName = styled.span`
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 1px;
  margin-left: 5px;
`;

const ItemName = styled.span`
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 1px;
`;

const CustomerSideBar = ({ customeid }) => {
  return (
    <Container className="list-group rounded-2">
      <Title className="d-none d-lg-block list-group-item text-center text-warning bg-dark border-0 rounded-bottom-0">
        <TitleName>Chức năng</TitleName>
      </Title>
      <ListItem className="d-flex flex-row d-lg-block list-group rounded-top-0 rounded-bottom-2 text-center">
        <CustomeNavLink
          to={`/profile/${customeid}`}
          className="list-group-item list-group-item-action border-0"
        >
          <ItemName>Thông tin cá nhân</ItemName>
        </CustomeNavLink>
        <CustomeNavLink
          to={`/profile/update/${customeid}`}
          className="list-group-item list-group-item-action border-0"
        >
          <ItemName>Cập nhập thông tin</ItemName>
        </CustomeNavLink>
        <CustomeNavLink
          to={`/profile/change-password/${customeid}`}
          className="list-group-item list-group-item-action border-0"
        >
          <ItemName>Thay đổi mật khẩu</ItemName>
        </CustomeNavLink>
        <CustomeNavLink
          to={`/order/${customeid}`}
          className="list-group-item list-group-item-action border-0"
        >
          <ItemName>Lịch sử đặt hàng</ItemName>
        </CustomeNavLink>
        <CustomeNavLink
          to={`/`}
          className="list-group-item list-group-item-action border-0"
        >
          <ItemName>Trang chủ</ItemName>
        </CustomeNavLink>
      </ListItem>
    </Container>
  );
};

export default CustomerSideBar;
