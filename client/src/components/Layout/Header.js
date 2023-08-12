import { Badge } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/auth";
import { styled } from "styled-components";
import { useSearchContext } from "../../context/search";
import axios from "axios";
import { toast } from "react-toastify";

const SearchBar = styled.form``;

const DropDown = styled.div`
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.5;
  }
`;

const DropDownItem = styled.li`
  background-color: none;
  &:hover {
    background-color: rgba(233, 236, 239, 0.445);
  }
`;

const Header = () => {
  const [auth, setAuth] = useAuthContext();
  const [input, setInput] = useSearchContext();
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`/product?key=${input.keyword}`);
      if (res && res.data.success) {
        setInput({ ...input, results: res.data.product });
        console.log(`${res.data.message}`);
        console.log(`${res.data.product}`);
        navigate(`/search`);
      } else {
        toast.warn(`${res.data.message}`);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else if (error.response && error.response.status === 500) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có gì đó không đúng");
      }
    }
  };

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
    <>
      <nav className="navbar navbar-expand-lg sticky-top navbar-dark bg-black bg-gradient">
        <div className="container text-center">
          <Link to="/" className="navbar-brand text-wrap">
            <img
              src="https://cdn-icons-png.flaticon.com/512/9729/9729394.png"
              alt="Logo"
              width={35}
              height={35}
              className="d-inline-block align-text-center mx-2"
            />
            PTIT <b style={{ color: "gold" }}>Journey</b>
          </Link>
          <button
            className="navbar-toggler shadow-none mb-2 ms-auto"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo02"
            aria-controls="navbarTogglerDemo02"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <SearchBar
              className="d-flex justify-content-center ms-auto col-lg-6"
              role="search"
            >
              <div className="input-group input-group-sm">
                <button
                  className="btn bg-warning bg-gradient"
                  type="button"
                  id="button-addon1"
                  onClick={handleSearch}
                >
                  <Search
                    style={{
                      color: "black",
                      alignSelf: "center",
                    }}
                  />
                </button>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Bạn cần tìm gì?"
                  aria-label="Example text with button addon"
                  aria-describedby="button-addon1"
                  onChange={(e) =>
                    setInput({ ...input, keyword: e.target.value })
                  }
                />
              </div>
            </SearchBar>
            <ul className="navbar-nav ms-auto mb-lg-0">
              <li className="nav-item ms-auto me-auto">
                <NavLink to="/" className="nav-link">
                  Trang chủ
                </NavLink>
              </li>
              <li className="nav-item ms-auto me-auto">
                <NavLink to="/shop" className="nav-link">
                  Mua hàng
                </NavLink>
              </li>
              <li className="nav-item ms-auto me-auto">
                <NavLink to={`/cart/${auth?.user?._id}}`} className="nav-link">
                  <Badge
                    badgeContent={100}
                    max={99}
                    color="secondary"
                    overlap="rectangular"
                  >
                    Giỏ hàng
                  </Badge>
                </NavLink>
              </li>
              {!auth.user ? (
                <li className="nav-item ms-auto me-auto">
                  <NavLink to="/login" className="nav-link">
                    Đăng nhập
                  </NavLink>
                </li>
              ) : (
                <li className="dropdown nav-item ms-auto me-auto">
                  <DropDown
                    className="btn text-warning border-0 dropdown-toggle"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {auth.user.fname} {auth.user.lname}
                  </DropDown>
                  <ul className="dropdown-menu w-100">
                    <DropDownItem className="nav-item ms-auto me-auto">
                      <NavLink
                        to={`/profile/${auth.user._id}`}
                        className="nav-link text-black"
                      >
                        Thông tin cá nhân
                      </NavLink>
                    </DropDownItem>
                    <DropDownItem className="nav-item ms-auto me-auto">
                      <NavLink
                        to={`/order/${auth.user._id}`}
                        className="nav-link text-black"
                      >
                        Lịch sử đặt
                      </NavLink>
                    </DropDownItem>
                    <DropDownItem className="nav-item ms-auto me-auto">
                      <NavLink
                        onClick={handleLogout}
                        to="/"
                        className="nav-link text-black"
                      >
                        Đăng xuất
                      </NavLink>
                    </DropDownItem>
                  </ul>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
