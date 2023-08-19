import React from "react";
import { toast } from "react-toastify";
import { styled } from "styled-components";
import { useAuthContext } from "../../contexts/auth";
import useFetch from "../../hooks/useFetch";
import Layout from "../../components/Layout/Layout";
import CartItem from "../../components/Cart/CartItem";
import EditBrandModal from "../../components/Modal/EditBrandModal";
import AddNewBrandModal from "../../components/Modal/AddNewBrandModal";

const ErrorDiv = styled.div``;

const Container = styled.div``;

const Wrapper = styled.div`
  max-height: 60vh;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 700;
  font-family: "Poppins", sans-serif;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin: 0 auto;
`;

const BrandItem = styled.div``;

const Table = styled.table``;

const TableHeader = styled.thead``;

const OrderHeader = styled.th``;

const StatusHeader = styled.th``;

const QuantityHeader = styled.th``;

const TableBody = styled.tbody``;

const Data = styled.tr``;

const Order = styled.td`
  font-weight: 500;
  text-transform: capitalize;
`;

const BrandName = styled.td`
  text-transform: uppercase;
  font-size: 18px;
  font-weight: 500;
`;

const ItemQuantity = styled.td`
  text-transform: capitalize;
`;

const ProductBrand = styled.div`
  max-height: 300px;
`;

const Item = styled.div``;

const Brand = () => {
  const [auth, setAuth] = useAuthContext();

  const { data, loading, error } = useFetch(`/brand/`);

  return (
    <Layout>
      <ErrorDiv>
        {error && toast.error(`${error.response.data.message}`)}
      </ErrorDiv>
      <Container className="container">
        <div className=" p-4 mt-5 mb-5">
          {loading ? (
            <h3 className="text-center">Loading...</h3>
          ) : (
            <>
              <Title className="text-center mb-4">Danh sách thương hiệu</Title>
              {auth?.user?.role === "manager" && (
                <div className=" mb-4 d-flex justify-content-end">
                  <button
                    className="btn btn-success"
                    data-bs-toggle="modal"
                    data-bs-target="#NewBrand"
                  >
                    Thêm mới
                  </button>
                  <AddNewBrandModal />
                </div>
              )}
              <Wrapper className=" overflow-scroll">
                {data?.brand?.length !== 0 ? (
                  data?.brand?.map((item, index) => {
                    return (
                      <BrandItem className="border shadow p-3" key={index}>
                        <Table className="table">
                          <TableHeader>
                            <Data>
                              <OrderHeader scope="col" className="text-center">
                                #
                              </OrderHeader>
                              <StatusHeader scope="col" className="text-center">
                                Tên thương hiệu
                              </StatusHeader>
                              <QuantityHeader
                                scope="col"
                                className="text-center"
                              >
                                Số lượng sản phẩm
                              </QuantityHeader>
                              <th scope="col" className="text-center">
                                Thao tác
                              </th>
                            </Data>
                          </TableHeader>
                          <TableBody>
                            <Data>
                              <Order className="text-center text-secondary">
                                {index + 1}
                              </Order>
                              <BrandName className="text-center text-secondary">
                                {item?.brand_name}
                              </BrandName>
                              <ItemQuantity className="text-center">
                                {item?.products?.length}
                              </ItemQuantity>

                              <td className="text-center">
                                {auth?.user?.role === "manager" ? (
                                  <>
                                    <button
                                      className="btn btn-primary"
                                      data-bs-toggle="modal"
                                      data-bs-target="#EditBrand"
                                    >
                                      Sửa
                                    </button>
                                    {item && <EditBrandModal data={item} />}
                                  </>
                                ) : (
                                  <div className="text-secondary">
                                    Không được cấp quyền
                                  </div>
                                )}
                              </td>
                            </Data>
                          </TableBody>
                        </Table>
                        <h4 className="text-center">
                          Danh sách sản phẩm của thương hiệu{" "}
                          <span className="text-secondary">
                            {item.brand_name}
                          </span>
                        </h4>
                        <ProductBrand className="container overflow-scroll">
                          {item?.products?.map((product, index) => (
                            <Item
                              className="row mb-2 p-3 card flex-row"
                              key={index}
                            >
                              <CartItem
                                key={index}
                                data={product}
                                index={index}
                                onlyRead={true}
                              />
                            </Item>
                          ))}
                        </ProductBrand>
                      </BrandItem>
                    );
                  })
                ) : (
                  <h4 className="text-center">
                    Không tìm thấy thương hiệu nào
                  </h4>
                )}
              </Wrapper>
            </>
          )}
        </div>
      </Container>
    </Layout>
  );
};

export default Brand;
