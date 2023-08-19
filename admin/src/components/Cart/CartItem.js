import React from "react";
import { styled } from "styled-components";

const Cart = styled.div`
  margin-right: 7px;
  margin-left: 7px;
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.02);
  }
`;

const Thumbnail = styled.div`
  margin: auto;
`;

const Image = styled.img``;

const ItemDetail = styled.div``;

const Wrapper = styled.div``;

const ProductName = styled.h5`
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const NormalText = styled.span`
  font-weight: 500;
`;

const Quantity = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const Price = styled.div``;

const Money = styled.span``;

const CartItem = ({ data, index, onlyRead }) => {
  return (
    <Cart
      className="row mt-2 mb-2 ps-4 pe-4 bg-white border-2 rounded-2 shadow"
      data-bs-toggle={onlyRead ? "" : "modal"}
      data-bs-target={onlyRead ? "" : `#Modal${index}`}
    >
      <Thumbnail className="col-md-4 bg-light text-center">
        <Image
          src={data.product_thumbnails[0]}
          alt="alt"
          width={200}
          height={200}
        />
      </Thumbnail>
      <ItemDetail className="col-md-8">
        <Wrapper className="ps-3 pe-3 pt-2 pb-2 ms-3">
          <ProductName className="mt-4 mb-4">{data.product_name}</ProductName>
          <Quantity className="mb-2 mt-2">
            <NormalText>Tình trạng: </NormalText>
            {data.stocking ? (
              <div className="text-bg-success p-1 rounded-2 ms-2">Còn hàng</div>
            ) : (
              <div className="text-bg-danger p-1 rounded-2 ms-2">Hết hàng</div>
            )}
          </Quantity>
          <Price className="mt-4 mb-4">
            <NormalText>Giá: </NormalText>
            <Money className="text-danger">
              {parseFloat(data.price).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </Money>
          </Price>
        </Wrapper>
      </ItemDetail>
    </Cart>
  );
};

export default CartItem;
