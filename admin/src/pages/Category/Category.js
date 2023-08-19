import React from "react";
import { toast } from "react-toastify";
import { user_columns } from "../../utils/datatables";
import { styled } from "styled-components";
import { useAuthContext } from "../../contexts/auth";
import useFetch from "../../hooks/useFetch";
import Layout from "../../components/Layout/Layout";
import Datatable from "../../components/Datatable/Datatable";
import CartItem from "../../components/Cart/CartItem";
import AddNewCategoryModal from "../../components/Modal/AddNewCategoryModal";
import EditCategoryModal from "../../components/Modal/EditCategoryModal";

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

const CategoryItem = styled.div``;

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

const CategoryName = styled.td`
  text-transform: uppercase;
  font-size: 18px;
  font-weight: 500;
`;

const ItemQuantity = styled.td`
  text-transform: capitalize;
`;

const ProductCategory = styled.div`
  max-height: 300px;
`;

const Item = styled.div``;

const Category = () => {
  const [auth, setAuth] = useAuthContext();

  const { data, loading, error } = useFetch(`/category/`);

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
              <Title className="text-center mb-4">Danh sách danh mục</Title>
              {auth?.user?.role === "manager" && (
                <div className=" mb-4 d-flex justify-content-end">
                  <button
                    className="btn btn-success"
                    data-bs-toggle="modal"
                    data-bs-target="#NewCategory"
                  >
                    Thêm mới
                  </button>
                  <AddNewCategoryModal />
                </div>
              )}
              <Wrapper className=" overflow-scroll">
                {data?.category?.length !== 0 ? (
                  data?.category?.map((item, index) => {
                    return (
                      <CategoryItem className="border shadow p-3" key={index}>
                        <Table className="table">
                          <TableHeader>
                            <Data>
                              <OrderHeader scope="col" className="text-center">
                                #
                              </OrderHeader>
                              <StatusHeader scope="col" className="text-center">
                                Tên danh mục
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
                              <CategoryName className="text-center text-secondary">
                                {item?.category_name}
                              </CategoryName>
                              <ItemQuantity className="text-center">
                                {item?.products?.length}
                              </ItemQuantity>
                              <td className="text-center">
                                {auth?.user?.role === "manager" ? (
                                  <>
                                    <button
                                      className="btn btn-primary"
                                      data-bs-toggle="modal"
                                      data-bs-target="#EditCategory"
                                    >
                                      Sửa
                                    </button>
                                    {item && <EditCategoryModal data={item} />}
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
                          Danh sách sản phẩm thuộc danh mục{" "}
                          <span className="text-secondary">
                            {item.category_name}
                          </span>
                        </h4>
                        <ProductCategory className="container overflow-scroll">
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
                        </ProductCategory>
                      </CategoryItem>
                    );
                  })
                ) : (
                  <h4 className="text-center">Không tìm thấy danh mục nào</h4>
                )}
              </Wrapper>
            </>
          )}
        </div>
      </Container>
    </Layout>
  );
};

export default Category;
