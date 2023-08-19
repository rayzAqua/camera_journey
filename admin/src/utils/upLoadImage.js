import axios from "axios";

export const imgBBUpload = async (imageURL) => {
  const apiKey = "49bc8b6875e31e93b7c4f7eb3df9cd82";
  try {
    const response = await axios.post(
      "https://api.imgbb.com/1/upload",
      new URLSearchParams({
        key: apiKey,
        image: imageURL,
      })
    );

    const { url } = response.data.data;
    return url;
  } catch (error) {
    console.error("Error uploading image:", error.message);
    return null;
  }
};

export const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = (error) => reject(error);
  });
};
