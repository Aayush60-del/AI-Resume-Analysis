import axios from "axios";
import { triggerUnauthorized } from "../utils/authSession";
import { normalizeApiBaseUrl } from "../utils/normalizeApiUrl";

const rawApiUrl = import.meta.env.VITE_API_URL?.trim();

const API_BASE_URL = rawApiUrl
  ? normalizeApiBaseUrl(rawApiUrl)
  : import.meta.env.DEV
    ? "/api"
    : "";

if (!API_BASE_URL && import.meta.env.PROD) {
  console.error(
    "[ResumAI] VITE_API_URL is not set. Add it in Vercel → Settings → Environment Variables, then redeploy."
  );
}

if (import.meta.env.PROD && API_BASE_URL) {
  console.info("[ResumAI] API base URL:", API_BASE_URL);
}

const API = axios.create({
  baseURL: API_BASE_URL || "/api",
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    if (!API_BASE_URL && import.meta.env.PROD) {
      return Promise.reject(
        new Error(
          "API URL not configured. Set VITE_API_URL on Vercel to your Render backend (e.g. https://your-app.onrender.com/api), then redeploy."
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

    if (
      error.response?.status === 404 &&
      error.response?.data?.message === "Route not found"
    ) {
      error.message =
        "API route not found. Check VITE_API_URL on Vercel — it must end with /api (e.g. https://your-app.onrender.com/api).";
    }

    return Promise.reject(error);
  }
);

export { API_BASE_URL };
export default API;
