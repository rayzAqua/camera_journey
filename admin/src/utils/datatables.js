import { format } from "date-fns";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

export const product_columns = [
  {
    field: "_id",
    headerName: "ID",
    width: 250,
  },
  {
    field: "product_thumbnails",
    headerName: "Minh hoạ",
    renderCell: (params) => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src={params.value[0]}
          alt={`Thumbnail ${params.row.product_name}`}
          style={{
            width: 40,
            height: 40,
            objectFit: "cover",
            marginLeft: "10px",
          }}
        />
      </div>
    ),
    width: 120,
    sortable: false,
    filterable: false,
  },
  {
    field: "product_name",
    headerName: "Sản phẩm",
    renderCell: (params) => (
      <div
        style={{
          maxWidth: "100%",
          whiteSpace: "normal",
          padding: "1px", // Tự động ngắt dòng khi quá dài
        }}
      >
        {params.value}
      </div>
    ),
    width: 280,
  },
  { field: "product_brand", headerName: "Thương hiệu", width: 150 },
  {
    field: "createdAt",
    headerName: "Ngày tạo",
    renderCell: (params) =>
      format(new Date(params.value), "hh:mm:ss dd/MM/yyyy"),
    width: 180,
  },
  {
    field: "price",
    headerName: "Đơn giá",
    renderCell: (params) => (
      <div>
        {parseFloat(params.value).toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}
      </div>
    ),
    width: 100,
  },
  {
    field: "quantity",
    headerName: "Số lượng",
    width: 80,
    renderCell: (params) => (
      <div
        style={{
          marginLeft: "23px",
        }}
      >
        {params.value}
      </div>
    ),
  },
  {
    field: "stocking",
    headerName: "Tồn kho",
    width: 130,
    type: "boolean",
    renderCell: (params) => (
      <div>
        {params.value ? (
          <CheckCircleIcon color="success" />
        ) : (
          <CancelIcon color="error" />
        )}
      </div>
    ),
  },
];

export const order_columns = [
  {
    field: "_id",
    headerName: "ID",
    width: 250,
  },
  {
    field: "customer_name",
    headerName: "Khách hàng",
    valueGetter: (params) => `${params.value.fname} ${params.value.lname}`,
    width: 150,
  },
  {
    field: "customer_email",
    headerName: "Email",
    width: 180,
  },
  {
    field: "customer_phone",
    headerName: "Điện thoại",
    width: 150,
  },
  {
    field: "cart",
    headerName: "Giỏ hàng",
    renderCell: (params) => (
      <div>
        {params.value.map((item, index) => (
          <div key={index}>{`${item.product_name} (x${
            item.quantity
          }): ${parseFloat(item.price).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          })}`}</div>
        ))}
      </div>
    ),
    width: 280,
    filterable: false,
    sortable: false,
  },
  {
    field: "total",
    headerName: "Tổng tiền",
    renderCell: (params) => (
      <div>
        {parseFloat(params.value).toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })}
      </div>
    ),
    width: 120,
  },
  {
    field: "status",
    headerName: "Trạng thái",
    renderCell: (params) => (
      <div
        style={{
          textTransform: "capitalize",
          marginLeft: "5px",
          color:
            params.value === "pending"
              ? "gray"
              : params.value === "process"
              ? "goldenrod"
              : params.value === "shipping"
              ? "blue"
              : params.value === "complete"
              ? "green"
              : "red",
        }}
      >
        {params.value}
      </div>
    ),
    type: "singleSelect",
    valueOptions: ["pending", "process", "shipping", "complete", "cancel"],
    editable: true,
    width: 120,
  },
  {
    field: "createdAt",
    headerName: "Thời gian đặt hàng",
    renderCell: (params) => new Date(params.value).toLocaleString(),
    width: 180,
  },
  {
    field: "updatedAt",
    headerName: "Thời gian cập nhật",
    renderCell: (params) => new Date(params.value).toLocaleString(),
    width: 180,
  },
  {
    field: "staff",
    headerName: "Nhân viên",
    renderCell: (params) => (
      <div>
        {params.value.map((staffMember, staffIndex) => (
          <div key={staffIndex}>
            {`${staffMember.fname} ${staffMember.lname}`}
          </div>
        ))}
      </div>
    ),
    width: 160,
  },
];

export const user_columns = [
  {
    field: "_id",
    headerName: "ID",
    width: 220,
  },
  {
    field: "image",
    headerName: "Ảnh đại diện",
    renderCell: (params) => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src={params.value}
          alt={`Avatar ${params.row.fname} ${params.row.lname}`}
          style={{
            width: 50,
            height: 50,
            objectFit: "cover",
            borderRadius: "50%",
            marginLeft: "10px",
          }}
        />
      </div>
    ),
    width: 120,
    sortable: false,
    filterable: false,
  },
  {
    field: "fname",
    headerName: "Họ",
    width: 150,
    editable: true,
  },
  {
    field: "lname",
    headerName: "Tên",
    width: 100,
    editable: true,
  },
  {
    field: "birthDate",
    headerName: "Ngày sinh",
    type: "date",
    renderCell: (params) => (
      <div>
        {params.value
          ? new Date(params.value).toLocaleDateString("vi-VN")
          : "N/A"}
      </div>
    ),
    width: 120,
    editable: true,
    valueFormatter: (params) => {
      if (params.value) {
        const date = new Date(params.value);
        return `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      } else {
        return "N/A";
      }
    },
  },

  {
    field: "age",
    headerName: "Tuổi",
    renderCell: (params) => {
      const birthDate = params.row.birthDate
        ? new Date(params.row.birthDate)
        : null;
      const currentDate = new Date();
      let age = "N/A";

      if (birthDate) {
        const yearDiff = currentDate.getFullYear() - birthDate.getFullYear();
        const monthDiff = currentDate.getMonth() - birthDate.getMonth();
        const dayDiff = currentDate.getDate() - birthDate.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          age = yearDiff - 1;
        } else {
          age = yearDiff;
        }
      }

      return <div>{age}</div>;
    },
    width: 100,
  },
  {
    field: "sexual",
    headerName: "Giới tính",
    renderCell: (params) => (
      <div>
        {params.value === "male"
          ? "Nam"
          : params.value === "female"
          ? "Nữ"
          : params.value === "other"
          ? "Khác"
          : "N/A"}
      </div>
    ),
    width: 100,
    type: "singleSelect",
    valueOptions: ["male", "female", "other"],
    editable: true,
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
  },
  {
    field: "phone",
    headerName: "Điện thoại",
    renderCell: (params) => <div>{params.value ? params.value : "N/A"}</div>,
    width: 150,
    editable: true,
  },
  {
    field: "createdAt",
    headerName: "Ngày lập",
    renderCell: (params) => new Date(params.value).toLocaleString(),
    width: 180,
  },
  {
    field: "verified",
    headerName: "Xác thực",
    width: 120,
    type: "boolean",
    editable: true,
    renderCell: (params) => (
      <div>
        {params.value ? (
          <CheckCircleIcon color="success" />
        ) : (
          <CancelIcon color="error" />
        )}
      </div>
    ),
  },
  {
    field: "role",
    headerName: "Chức vụ",
    renderCell: (params) => (
      <div style={{ textTransform: "capitalize" }}>
        {params.value === "staff"
          ? "Nhân viên"
          : params.value === "manager"
          ? "Quản lý"
          : "N/A"}
      </div>
    ),
    type: "singleSelect",
    valueOptions: ["staff", "manager"],
    editable: true,
    width: 120,
  },
];

export const customer_columns = [
  {
    field: "_id",
    headerName: "ID",
    width: 220,
  },
  {
    field: "image",
    headerName: "Ảnh đại diện",
    renderCell: (params) => (
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          src={params.value}
          alt={`Avatar ${params.row.fname} ${params.row.lname}`}
          style={{
            width: 50,
            height: 50,
            objectFit: "cover",
            borderRadius: "50%",
            marginLeft: "10px",
          }}
        />
      </div>
    ),
    width: 120,
    sortable: false,
    filterable: false,
  },
  {
    field: "fname",
    headerName: "Họ",
    width: 150,
    editable: true,
  },
  {
    field: "lname",
    headerName: "Tên",
    width: 100,
    editable: true,
  },
  {
    field: "birthDate",
    headerName: "Ngày sinh",
    renderCell: (params) => (
      <div>
        {params.value
          ? new Date(params.value).toLocaleDateString("vi-VN")
          : "N/A"}
      </div>
    ),
    type: "date",
    width: 120,
    editable: true,
    valueFormatter: (params) => {
      if (params.value) {
        const date = new Date(params.value);
        return `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
      } else {
        return "N/A";
      }
    },
  },
  {
    field: "age",
    headerName: "Tuổi",
    renderCell: (params) => {
      const birthDate = params.row.birthDate
        ? new Date(params.row.birthDate)
        : null;
      const currentDate = new Date();
      let age = "N/A";

      if (birthDate) {
        const yearDiff = currentDate.getFullYear() - birthDate.getFullYear();
        const monthDiff = currentDate.getMonth() - birthDate.getMonth();
        const dayDiff = currentDate.getDate() - birthDate.getDate();

        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
          age = yearDiff - 1;
        } else {
          age = yearDiff;
        }
      }

      return <div>{age}</div>;
    },
    width: 100,
  },
  {
    field: "sexual",
    headerName: "Giới tính",
    renderCell: (params) => (
      <div>
        {params.value === "male"
          ? "Nam"
          : params.value === "female"
          ? "Nữ"
          : params.value === "other"
          ? "Khác"
          : "N/A"}
      </div>
    ),
    width: 100,
    type: "singleSelect",
    valueOptions: ["male", "female", "other"],
    editable: true,
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
  },
  {
    field: "phone",
    headerName: "Điện thoại",
    renderCell: (params) => <div>{params.value ? params.value : "N/A"}</div>,
    width: 150,
    editable: true,
  },
  {
    field: "address",
    headerName: "Địa chỉ",
    width: 200,
    valueGetter: (params) =>
      `${params.value.street}, ${params.value.district}\n${params.value.city}, ${params.value.country}`,
    renderCell: (params) => (
      <div style={{ whiteSpace: "pre-line" }}>{params.value}</div>
    ),
  },
  {
    field: "createdAt",
    headerName: "Tham gia ngày",
    renderCell: (params) => new Date(params.value).toLocaleString(),
    width: 180,
  },
  {
    field: "verified",
    headerName: "Xác thực",
    width: 120,
    type: "boolean",
    renderCell: (params) => (
      <div>
        {params.value ? (
          <CheckCircleIcon color="success" />
        ) : (
          <CancelIcon color="error" />
        )}
      </div>
    ),
    editable: true,
  },
  {
    field: "orders",
    headerName: "Số đơn đặt",
    renderCell: (params) => (
      <div style={{ marginLeft: "25px" }}>
        {params.value ? params.value.length : 0}
      </div>
    ),
    width: 120,
  },
];
