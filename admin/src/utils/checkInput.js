export const isNumericString = (str) => {
  // Sử dụng biểu thức chính quy để kiểm tra chuỗi chỉ chứa ký tự số từ 0-9
  const numericRegex = /^[0-9]+$/;

  return numericRegex.test(str);
};

export const isAlphabeticString = (str) => {
  // Sử dụng biểu thức chính quy để kiểm tra chuỗi chỉ chứa ký tự alphabet a-z,  và A-Z
  const alphabeticRegex = /^[a-zA-Z\sÀ-ỹ]+$/;

  return alphabeticRegex.test(str);
};

export const isAlphaNumbericString = (str) => {
  // Sử dụng biểu thức chính quy để kiểm tra chuỗi chỉ chứa ký tự alphabet a-z, A-Z, , 0-9
  const alphanumbericRegex = /^[a-zA-Z0-9\sÀ-ỹ-]+$/;

  return alphanumbericRegex.test(str);
};

export const isAlphaNumbericWithSlashString = (str) => {
  // Sử dụng biểu thức chính quy để kiểm tra chuỗi chỉ chứa ký tự alphabet a-z, A-Z, , 0-9, dấu phẩy
  const alphanumbericRegex = /^[a-zA-Z0-9\sÀ-ỹ/\\,]+$/;

  return alphanumbericRegex.test(str);
};

export const isAlphaNumbericSpecialString = (str) => {
  // Sử dụng biểu thức chính quy để kiểm tra chuỗi chỉ chứa ký tự alphabet a-z, A-Z, , 0-9, ký tự đặc biệt
  const alphanumbericspecialRegex =
    /^[a-zA-Z0-9\sÀ-ỹ~`!@#$%^&*()-_+=|\\:;'",.<>?/[\]{}]+$/;

  return alphanumbericspecialRegex.test(str);
};

export const isValidateEmail = (email) => {
  // Sử dụng biểu thức chính quy để kiểm tra chuỗi chỉ chứa ký tự alphabet a-z, A-Z, 0-9, @, .
  const emailRegex = /^[a-zA-Z0-9]+@[a-zA-Z]+\.[a-zA-Z]+$/;
  return emailRegex.test(email);
};

export const toValidDate = (date) => {
  let dateForCheck = new Date(date);
  if (!dateForCheck.getTime()) {
    const dateArray = date.split("/");
    let day = parseInt(dateArray[0]);
    let month = parseInt(dateArray[1]);
    let year = parseInt(dateArray[2]);
    const validDate = month + "/" + day + "/" + year;
    return new Date(validDate);
  }
  return new Date(date);
};
