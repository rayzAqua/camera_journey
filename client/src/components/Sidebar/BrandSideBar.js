import React from "react";
import { NavLink } from "react-router-dom";
import { styled } from "styled-components";
import useFetch from "../../hooks/useFetch";
import { Filter1, Filter2 } from "@material-ui/icons";

const Container = styled.div`
  box-shadow: 0px 0px 4px 0.5px rgba(0, 0, 0, 0.1);
`;

const Title = styled.div``;

const Loading = styled.h6`
  text-align: center;
  margin-bottom: 35px;
  font-weight: 700;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const ListItem = styled.div`
  overflow-x: auto;

  @media screen and (max-width: 300px) {
    overflow-x: scroll;
    white-space: nowrap;
  }
`;

const FilterName = styled.span`
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 1px;
  margin-left: 5px;
`;

const BrandName = styled.span`
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 1px;
`;

const CustomeNavLink = styled(NavLink)``;

const BrandSideBar = () => {
  const { data, loading, error } = useFetch(`/brand`);

  return (
    <Container className="list-group rounded-2">
      <Title className="d-none d-lg-block list-group-item text-center bg-dark text-warning border-0 rounded-bottom-0">
        <Filter2 />
        <FilterName>Thương hiệu</FilterName>
      </Title>
      <ListItem className="d-flex flex-row d-lg-block list-group rounded-top-0 rounded-bottom-2 text-center">
        {loading ? (
          <Loading className="mt-5 mb-5">Loading...</Loading>
        ) : (
          data?.brand?.map((item) => (
            <CustomeNavLink
              key={item._id}
              to={`/brand/${item._id}`}
              className="list-group-item list-group-item-action border-0"
            >
              <BrandName>{item.brand_name}</BrandName>
            </CustomeNavLink>
          ))
        )}
      </ListItem>
    </Container>
  );
};

export default BrandSideBar;
