import React from "react";
import { NavLink } from "react-router-dom";
import { styled } from "styled-components";

const Container = styled.div``;

const CardView = styled(NavLink)`
  text-decoration: none;
  box-shadow: 0px 0px 4px 0.5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    transform: scale(1.03);
    cursor: pointer;
  }
`;

const Image = styled.img``;

const TextWrapper = styled.div``;

const ProductCategory = styled.p`
  font-size: 12px;
  font-weight: 500;
`;

const ProductName = styled.p`
  font-size: 14px;
  font-weight: 700;
`;

const Overlay = styled.div`
  padding: 5px 10px;
  left: unset;
`;

const Status = styled.p``;

const ProductPrice = styled.p`
  font-size: 14px;
`;

const Product = ({ productid, image, title, price, category, status }) => {
  const vndPrice = parseFloat(price).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

  return (
    <Container>
      <CardView to={`/shop/${productid}`} className="card my-3 h-100 ms-2 me-2">
        <Image
          src={image}
          className="card-img-top img-thumbnail border-0 rounded-bottom-0"
          alt="..."
        />
        <Overlay className="card-img-overlay">
          {status === "new" ? (
            <Status className="card-text badge bg-warning">Mới</Status>
          ) : status ? (
            <Status className="card-text badge bg-success">Còn hàng</Status>
          ) : (
            <Status className="card-text badge bg-danger">Hết hàng</Status>
          )}
        </Overlay>
        <TextWrapper className="card-body ps-auto pe-auto">
          {category?.map((item, index) => (
            <ProductCategory
              key={index}
              className="card-text badge bg-danger text-warning me-1"
            >
              {item}
            </ProductCategory>
          ))}
          <ProductName className="card-title text-black">{title}</ProductName>
          <ProductPrice className="card-text text-danger">
            {vndPrice}
          </ProductPrice>
        </TextWrapper>
      </CardView>
    </Container>
  );
};

export default Product;
