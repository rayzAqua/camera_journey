import React from "react";
import { NavLink } from "react-router-dom";
import { styled } from "styled-components";
import HomeIcon from "@mui/icons-material/HomeTwoTone";
import CameraAltIcon from "@mui/icons-material/CameraAltTwoTone";
import StoreTwoToneIcon from "@mui/icons-material/StoreTwoTone";
import PsychologyTwoToneIcon from "@mui/icons-material/PsychologyTwoTone";
import PermIdentityTwoToneIcon from "@mui/icons-material/PermIdentityTwoTone";
import SupportAgentTwoToneIcon from "@mui/icons-material/SupportAgentTwoTone";
import ReceiptLongTwoToneIcon from "@mui/icons-material/ReceiptLongTwoTone";

const Container = styled.div`
  box-shadow: 0px 0px 4px 0.5px rgba(0, 0, 0, 0.1);
`;

const ListItem = styled.div``;

const Button = styled(NavLink)``;

const ItemName = styled.span`
  text-transform: capitalize;
  font-size: 18px;
  font-weight: 400;
  letter-spacing: 1px;
`;

const Sidebar = () => {
  return (
    <Container>
      <div>
        <ListItem className="d-block">
          <Button
            to={`/`}
            className="list-group-item list-group-item-action border-0 border-bottom shadow-none p-2"
          >
            <HomeIcon className="me-3" />
            <ItemName>Trang chủ</ItemName>
          </Button>
          <Button
            to={`/product`}
            className="list-group-item list-group-item-action border-0 border-bottom shadow-none p-2"
          >
            <CameraAltIcon className="me-3" />
            <ItemName>Sản phẩm</ItemName>
          </Button>
          <Button
            to={`/brand`}
            className="list-group-item list-group-item-action border-0 border-bottom shadow-none p-2"
          >
            <StoreTwoToneIcon className="me-3" />
            <ItemName>Thương hiệu</ItemName>
          </Button>
          <Button
            to={`/category`}
            className="list-group-item list-group-item-action border-0 border-bottom shadow-none p-2"
          >
            <PsychologyTwoToneIcon className="me-3" />
            <ItemName>Danh mục</ItemName>
          </Button>
          <Button
            to={`/customer`}
            className="list-group-item list-group-item-action border-0 border-bottom shadow-none p-2"
          >
            <PermIdentityTwoToneIcon className="me-3" />
            <ItemName>Khách hàng</ItemName>
          </Button>
          <Button
            to={`/staff`}
            className="list-group-item list-group-item-action border-0 border-bottom shadow-none p-2"
          >
            <SupportAgentTwoToneIcon className="me-3" />
            <ItemName>Nhân viên</ItemName>
          </Button>
          <Button
            to={`/order`}
            className="list-group-item list-group-item-action border-0 shadow-none p-2"
          >
            <ReceiptLongTwoToneIcon className="me-3" />
            <ItemName>Đơn đặt</ItemName>
          </Button>
        </ListItem>
      </div>
    </Container>
  );
};

export default Sidebar;
