import axios from "axios";
import { triggerUnauthorized } from "../utils/authSession";

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL
  : import.meta.env.DEV
    ? "/api"
    : "";

if (!API_BASE_URL && import.meta.env.PROD) {
  console.error(
    "[ResumAI] VITE_API_URL is not set. Add it in Vercel → Settings → Environment Variables."
  );
}

const API = axios.create({
  baseURL: API_BASE_URL || "/api",
  timeout: 120000,
});

API.interceptors.request.use(
  (config) => {
    if (!API_BASE_URL && import.meta.env.PROD) {
      return Promise.reject(
        new Error(
          "API URL not configured. Set VITE_API_URL on Vercel to your Render backend (e.g. https://your-app.onrender.com/api)."
        )
      );
    }

    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      triggerUnauthorized();
    }

    return Promise.reject(error);
  }
);

export { API_BASE_URL };
export default API;
