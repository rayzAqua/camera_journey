export const createRegex = (queryArr) => {
  return queryArr
    ? new RegExp(queryArr.replace(/\s/g, "").split("").join(".*"))
    : ".*";
};
