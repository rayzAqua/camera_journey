import { Badge } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/auth";
import { styled } from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import useFetch from "../../hooks/useFetch";

const Container = styled.div`
  box-shadow: 0px 0px 4px 0.5px rgba(0, 0, 0, 0.1);
`;

const DropDown = styled.button`
  transition: all 0.3s ease;
  &:hover {
    opacity: 0.5;
  }
`;

const DropDownItem = styled.li`
  justify-content: flex-end;
  background-color: none;
  &:hover {
    background-color: rgba(233, 236, 239, 0.445);
  }
`;

const UserName = styled.span`
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 1px;
  margin-left: 5px;
`;

const Header = () => {
  const [auth, setAuth] = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <Container>
      <div className="">
        <div className="dropdown text-end bg-dark p-4">
          <DropDown
            className="text-warning border-0 dropdown-toggle bg-dark"
            type="button"
            data-bs-toggle="dropdown"
          >
            <UserName>
              {auth?.user?.fname} {auth?.user?.lname}
            </UserName>
          </DropDown>
          <ul className="dropdown-menu">
            <DropDownItem className="ms-auto me-auto p-2">
              <NavLink
                to={`/profile/${auth?.user?._id}`}
                className="nav-link text-black"
              >
                Thông tin cá nhân
              </NavLink>
            </DropDownItem>
            <DropDownItem className="ms-auto me-auto p-2">
              <NavLink to={`/change-password/`} className="nav-link text-black">
                Đổi mật khẩu
              </NavLink>
            </DropDownItem>
            <DropDownItem className="ms-auto me-auto p-2">
              <NavLink
                onClick={handleLogout}
                to="/"
                className="nav-link text-black"
              >
                Đăng xuất
              </NavLink>
            </DropDownItem>
          </ul>
        </div>
      </div>
    </Container>
  );
};

export default Header;
