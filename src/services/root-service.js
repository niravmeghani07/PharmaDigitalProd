import axios from "axios";

const username = sessionStorage.userName;
const password = sessionStorage.password;

const API_URL = process.env.REACT_APP_API_URL;
export const instance = axios.create({
  baseURL: API_URL,
  // headers: {
  // 	Authorization: `Bearer ${getFunction('id_token')}`,
  // },
  auth: {
    username,
    password,
  },
});
