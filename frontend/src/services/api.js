import axios from "axios";
const usersUrl = "http://localhost:4000";

export const getAllBook = async () => {
  return axios.get(`${usersUrl}/api/v1/getAllBook`);
};
export const getBookDetails = async (id) => {
  console.log(id);
  const data = axios.get(`${usersUrl}/api/v1/getBookDetails/${id}`);
  console.log(data);
  return data;
};
export const rentBook = async (userid, id) => {
  return axios.put(
    `/api/v1/rentBook/${id}`,
    { userid },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
    { withCredentials: true }
  );
};
export const submitBook = async (id) => {
  console.log(id);
  return axios.put(
    `/api/v1/submitBook`,
    { id },
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
    { withCredentials: true }
  );
};
