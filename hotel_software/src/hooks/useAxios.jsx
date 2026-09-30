// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: `http://localhost:3000`,
// });

// const useAxios = () => {
//   return axiosInstance;
// };

// export default useAxios;

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000",
});

// Automatically attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
