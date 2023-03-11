import axios from "axios";
const usersUrl = "http://localhost:4000";

export const getAllBook = async () => {
  return axios.get(`${usersUrl}/api/v1/getAllBook`);
};
export const getBookDetails = async (id) => {
  console.log("hi");
  const data = axios.get(`${usersUrl}/api/v1/getBookDetails/${id}`);
  console.log(data);
  return data;
};
export const rentBook = async (id) => {
  return axios.put(`${usersUrl}/api/v1/rentBook/${id}`);
};
