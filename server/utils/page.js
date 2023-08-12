export const caculateSkipCount = (page, limitPerPage) =>
  page ? (page - 1) * limitPerPage : 0;

export const caculateTotalPage = (docQuantities, limitPerPage) =>
  Math.ceil(docQuantities / limitPerPage);
