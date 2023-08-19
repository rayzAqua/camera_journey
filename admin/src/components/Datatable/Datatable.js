import React, { useState } from "react";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import { Box, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { grey } from "@mui/material/colors";
import { useAuthContext } from "../../contexts/auth";
import { toast } from "react-toastify";
import axios from "axios";
import { isAlphabeticString, isNumericString } from "../../utils/checkInput";

const Datatable = ({ data, column }) => {
  // Role
  const [auth, setAuth] = useAuthContext();

  // Path
  const location = useLocation();
  const path = location.pathname.split("/")[1];

  // Page
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0); // Track current page number

  const handleChangePageSize = (newPageSize) => {
    setPageSize(newPageSize);
    setCurrentPage(0); // Reset to first page when changing page size
  };

  const handleChangePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const [updateId, setUpdateId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [width, setWidth] = useState(160);

  const handleSetUpdate = (id) => {
    setUpdateId(id);
    setWidth(280);
  };

  const handleSetDelete = (id) => {
    setDeletingId(id);
    setWidth(280);
  };

  const handleCancel = () => {
    setDeletingId(null);
    setUpdateId(null);
    setWidth(160);
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteProduct = async (productId) => {
    try {
      setIsLoading(true);

      const res = await axios.delete(`/product/${auth.user._id}/${productId}`, {
        headers: {
          Authorization: `${auth.token}`,
        },
      });
      if (res && res.data.success) {
        toast.success(`${res.data.message}`);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.warning(`${res.data.message}`);
      }
      setIsLoading(false);
      setDeletingId(null);
    } catch (error) {
      setIsLoading(false);
      setDeletingId(null);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else if (error.response && error.response.status === 500) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có gì đó không đúng");
      }
    }
  };

  const handleUpdateOrderSatus = async (orderId, status) => {
    try {
      setIsLoading(true);
      const res = await axios.put(
        `/order/${auth.user._id}/${orderId}`,
        { status: status },
        {
          headers: {
            Authorization: `${auth.token}`,
          },
        }
      );
      if (res && res.data.success) {
        toast.success(`${res.data.message}`);
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1500);
      } else {
        toast.warning(`${res.data.message}`);
      }
      setIsLoading(false);
      setUpdateId(null);
    } catch (error) {
      setIsLoading(false);
      setUpdateId(null);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else if (error.response && error.response.status === 500) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có gì đó không đúng");
      }
    }
  };

  const handleUpdateUser = async (
    userId,
    role,
    verified,
    birthDate,
    sexual,
    phone,
    fname,
    lname
  ) => {
    try {
      setIsLoading(true);

      console.log(
        userId,
        role,
        verified,
        birthDate,
        sexual,
        phone,
        fname,
        lname
      );
      if (fname && !isAlphabeticString(fname)) {
        toast.warning("Họ, tên đệm có chứa ký tự đặc biệt");
        handleCancel();
        return;
      }
      if (lname && !isAlphabeticString(lname)) {
        toast.warning("Tên có chứa ký tự đặc biệt");
        handleCancel();
        return;
      }
      if (phone && !isNumericString(phone)) {
        toast.warning("Số điện thoại phải là chữ số");
        handleCancel();
        return;
      }
      if (phone && phone.length !== 10) {
        toast.warning("Số điện thoại cần 10 chữ số");
        handleCancel();
        return;
      }
      if (birthDate && birthDate > new Date()) {
        toast.warning("Ngày sinh không thể lớn hơn ngày hiện tại");
        handleCancel();
        return;
      }

      const res = await axios.put(
        `/user/${auth.user._id}/${userId}`,
        {
          role: role,
          verified: verified,
          birthDate: birthDate,
          sexual: sexual,
          phone: phone,
          fname: fname,
          lname: lname,
        },
        {
          headers: {
            Authorization: `${auth.token}`,
          },
        }
      );
      if (res && res.data.success) {
        toast.success(`${res.data.message}`);
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1500);
      } else {
        toast.warning(`${res.data.message}`);
      }
      setIsLoading(false);
      setUpdateId(null);
    } catch (error) {
      setIsLoading(false);
      setUpdateId(null);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else if (error.response && error.response.status === 500) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có gì đó không đúng");
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      setIsLoading(true);

      const res = await axios.delete(`/user/${auth.user._id}/${userId}`, {
        headers: {
          Authorization: `${auth.token}`,
        },
      });
      if (res && res.data.success) {
        toast.success(`${res.data.message}`);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.warning(`${res.data.message}`);
      }
      setIsLoading(false);
      setDeletingId(null);
    } catch (error) {
      setIsLoading(false);
      setDeletingId(null);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else if (error.response && error.response.status === 500) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có gì đó không đúng");
      }
    }
  };

  const handleUpdateCustomer = async (
    userId,
    verified,
    birthDate,
    sexual,
    phone,
    fname,
    lname
  ) => {
    try {
      setIsLoading(true);

      console.log(userId, verified, birthDate, sexual, phone, fname, lname);
      if (fname && !isAlphabeticString(fname)) {
        toast.warning("Họ, tên đệm có chứa ký tự đặc biệt");
        handleCancel();
        return;
      }
      if (lname && !isAlphabeticString(lname)) {
        toast.warning("Tên có chứa ký tự đặc biệt");
        handleCancel();
        return;
      }
      if (phone && !isNumericString(phone)) {
        toast.warning("Số điện thoại phải là chữ số");
        handleCancel();
        return;
      }
      if (phone && phone.length !== 10) {
        toast.warning("Số điện thoại cần 10 chữ số");
        handleCancel();
        return;
      }
      if (birthDate && birthDate > new Date()) {
        toast.warning("Ngày sinh không thể lớn hơn ngày hiện tại");
        handleCancel();
        return;
      }

      const res = await axios.put(
        `/customer/${auth.user._id}/${userId}`,
        {
          verified: verified,
          birthDate: birthDate,
          sexual: sexual,
          phone: phone,
          fname: fname,
          lname: lname,
        },
        {
          headers: {
            Authorization: `${auth.token}`,
          },
        }
      );
      if (res && res.data.success) {
        toast.success(`${res.data.message}`);
        // setTimeout(() => {
        //   window.location.reload();
        // }, 1500);
      } else {
        toast.warning(`${res.data.message}`);
      }
      setIsLoading(false);
      setUpdateId(null);
    } catch (error) {
      setIsLoading(false);
      setUpdateId(null);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else if (error.response && error.response.status === 500) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có gì đó không đúng");
      }
    }
  };

  const handleDeleteCustomer = async (userId) => {
    try {
      setIsLoading(true);

      const res = await axios.delete(`/customer/${auth.user._id}/${userId}`, {
        headers: {
          Authorization: `${auth.token}`,
        },
      });
      if (res && res.data.success) {
        toast.success(`${res.data.message}`);
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.warning(`${res.data.message}`);
      }
      setIsLoading(false);
      setDeletingId(null);
    } catch (error) {
      setIsLoading(false);
      setDeletingId(null);
      if (error.response && error.response.status === 400) {
        toast.error(error.response.data.message);
      } else if (error.response && error.response.status === 500) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Có gì đó không đúng");
      }
    }
  };

  const actionColumns = [
    {
      field: "action",
      headerName: "Thao tác",
      type: "actions",
      width: width,
      renderCell: (params) => {
        return (
          <div className="btn-group">
            {path === "product" && (
              <>
                <Link
                  to={`/${path}/${params.row._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <button className="me-2 btn btn-primary rounded-2">
                    Chi tiết
                  </button>
                </Link>
                {auth?.user?.role === "manager" && (
                  <>
                    {deletingId === params.row._id ? (
                      <>
                        <button
                          className="btn btn-secondary rounded-2"
                          onClick={() => handleCancel()}
                        >
                          Hủy
                        </button>
                        <button
                          className="btn btn-success rounded-2 ms-2"
                          disabled={isLoading}
                          onClick={() => handleDeleteProduct(params.row._id)}
                        >
                          {isLoading ? "Đang tải" : "Xác nhận"}
                        </button>
                      </>
                    ) : (
                      <button
                        className="ms-2 btn btn-danger rounded-2"
                        onClick={() => handleSetDelete(params.row._id)}
                      >
                        Xoá
                      </button>
                    )}
                  </>
                )}
              </>
            )}
            {path === "customer" &&
              (auth?.user?.role === "manager" ? (
                <>
                  {deletingId === params.row._id ||
                  updateId === params.row._id ? (
                    <>
                      <button
                        className="btn btn-secondary rounded-2"
                        onClick={() => handleCancel()}
                      >
                        Hủy
                      </button>
                      {deletingId === params.row._id && (
                        <button
                          className="btn btn-success rounded-2 ms-2"
                          disabled={isLoading}
                          onClick={() => handleDeleteCustomer(params.row._id)}
                        >
                          {isLoading ? "Đang tải" : "Xác nhận"}
                        </button>
                      )}
                      {updateId === params.row._id && (
                        <button
                          className="btn btn-success rounded-2 ms-2"
                          disabled={isLoading}
                          onClick={() =>
                            handleUpdateCustomer(
                              params.row._id,
                              params.row.verified,
                              params.row.birthDate,
                              params.row.sexual,
                              params.row.phone,
                              params.row.fname,
                              params.row.lname
                            )
                          }
                        >
                          {isLoading ? "Đang tải" : "Xác nhận"}
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-primary me-2 rounded-2"
                        onClick={() => handleSetUpdate(params.row._id)}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn btn-danger rounded-2"
                        onClick={() => handleSetDelete(params.row._id)}
                      >
                        Xoá
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="text-secondary">Không có quyền</div>
              ))}
            {path === "staff" &&
              (auth?.user?.role === "manager" ? (
                <>
                  {deletingId === params.row._id ||
                  updateId === params.row._id ? (
                    <>
                      <button
                        className="btn btn-secondary rounded-2"
                        onClick={() => handleCancel()}
                      >
                        Hủy
                      </button>
                      {deletingId === params.row._id && (
                        <button
                          className="btn btn-success rounded-2 ms-2"
                          disabled={isLoading}
                          onClick={() => handleDeleteUser(params.row._id)}
                        >
                          {isLoading ? "Đang tải" : "Xác nhận"}
                        </button>
                      )}
                      {updateId === params.row._id && (
                        <button
                          className="btn btn-success rounded-2 ms-2"
                          disabled={isLoading}
                          onClick={() =>
                            handleUpdateUser(
                              params.row._id,
                              params.row.role,
                              params.row.verified,
                              params.row.birthDate,
                              params.row.sexual,
                              params.row.phone,
                              params.row.fname,
                              params.row.lname
                            )
                          }
                        >
                          {isLoading ? "Đang tải" : "Xác nhận"}
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-primary me-2 rounded-2"
                        onClick={() => handleSetUpdate(params.row._id)}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn btn-danger rounded-2"
                        onClick={() => handleSetDelete(params.row._id)}
                      >
                        Xoá
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="text-secondary">Không có quyền</div>
              ))}
            {path === "order" &&
              (updateId === params.row._id ? (
                <>
                  <button
                    className="btn btn-secondary rounded-2"
                    onClick={() => handleCancel()}
                  >
                    Hủy
                  </button>
                  <button
                    className="btn btn-success rounded-2 ms-2"
                    disabled={isLoading}
                    onClick={() =>
                      handleUpdateOrderSatus(params.row._id, params.row.status)
                    }
                  >
                    {isLoading ? "Đang tải" : "Xác nhận"}
                  </button>
                </>
              ) : (
                <button
                  className="ms-2 btn btn-primary rounded-2"
                  onClick={() => handleSetUpdate(params.row._id)}
                  disabled={
                    params.row.status === "complete" ||
                    params.row.status === "cancel"
                  }
                >
                  Duyệt đơn
                </button>
              ))}
          </div>
        );
      },
    },
  ];

  return (
    <Box sx={{ height: "60vh", width: "100%" }}>
      <DataGrid
        getRowSpacing={(params) => ({
          top: params.isFirstVisible ? 0 : 5,
          bottom: params.isLastVisible ? 0 : 5,
        })}
        getRowHeight={() => 75}
        sx={{
          boxShadow: 2,
          border: 1,
          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
          },
          [`& .${gridClasses.row}`]: {
            bgcolor: (theme) =>
              theme.palette.mode === "light" ? grey[200] : grey[900],
          },
        }}
        rows={data}
        columns={path === "" ? column : column.concat(actionColumns)}
        pageSize={pageSize}
        onPageChange={handleChangePage}
        onPageSizeChange={handleChangePageSize}
        page={currentPage}
        checkboxSelection
        disableSelectionOnClick
        getRowId={(row) => row._id}
        initialState={{
          pagination: {
            paginationModel: { pageSize: 5, page: 0 },
          },
        }}
        pageSizeOptions={[5, 10, 25]}
      />
    </Box>
  );
};

export default Datatable;
