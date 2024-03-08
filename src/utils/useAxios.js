import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useContext, useEffect } from "react";
import AuthContext from "@src/context/AuthContext";
import { baseURL } from "./settings";

const axiosInstance = axios.create({
  baseURL,
});

const useAxios = () => {
  const { authTokens, setUser, setAuthTokens } = useContext(AuthContext);

  useEffect(() => {
    const requestIntercept = axiosInstance.interceptors.request.use(
      (config) => {
        config.headers.Authorization = `JWT ${JSON.parse(localStorage.getItem("authTokens")).access}`;
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseIntercept = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response.status === 401 && error.config && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const response = await axios.post(`${baseURL}/api/token/refresh/`, {
              refresh: authTokens.refresh,
            });
            localStorage.setItem("authTokens", JSON.stringify(response.data));
            setAuthTokens(() => response.data);
            setUser(() => jwtDecode(response.data.access));
            originalRequest.headers.Authorization = `JWT ${response.data.access}`;
            return axiosInstance(originalRequest);
          } catch (e) {
            console.log(e);
          }
        }
        return Promise.reject(error);
      },
    );
    return () => {
      axiosInstance.interceptors.request.eject(requestIntercept);
      axiosInstance.interceptors.response.eject(responseIntercept);
    };
  }, [setAuthTokens, setUser, authTokens]);

  return axiosInstance;
};

export default useAxios;
