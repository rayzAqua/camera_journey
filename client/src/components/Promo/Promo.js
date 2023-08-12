import React from "react";
import { styled } from "styled-components";
import { NavLink } from "react-router-dom";

const TextWrapper = styled.div`
  font-size: 20px;
  font-weight: 700;
  opacity: 0;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 2;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
  cursor: pointer;
`;

const CustomeNavLink = styled(NavLink)``;

const PromoItem = styled.div`
  padding: 10px 0px;
  transition: all 0.5s ease;
  &:hover ${TextWrapper} {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const ImageContainer = styled.div``;

const Image = styled.img`
  z-index: 1;
  animation: ease-in;
`;

const Promo = ({ image, name }) => {
  return (
    <PromoItem className="col">
      <ImageContainer className="card bg-dark bg-gradient">
        <Image src={image} className="card-img" alt="..." height={198} />
        <TextWrapper className="card-title text-warning ms-auto rounded-2">
          {name}
          <CustomeNavLink to="/shop" className="btn btn-warning mt-3">
            Mua ngay
          </CustomeNavLink>
        </TextWrapper>
      </ImageContainer>
    </PromoItem>
  );
};

export default Promo;
