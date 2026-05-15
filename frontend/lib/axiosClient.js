import axios from "axios";

/**
 * Configured Axios instance.
 *
 * Base URL resolution:
 *  - Development: Next.js rewrites /api/* → http://localhost:5000/api/*
 *    so we set baseURL to "/api" and let the rewrite handle the proxy.
 *  - Production: NEXT_PUBLIC_API_URL points directly to the deployed backend
 *    (e.g. https://globaltna-api.onrender.com), so baseURL becomes
 *    "https://globaltna-api.onrender.com/api".
 */
const baseURL = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : "/api";

const axiosClient = axios.create({
  baseURL,
  timeout: 10_000, // 10 s
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false,
});

/* ── Request interceptor ─────────────────────────────────────────────────────
   Good place to attach auth tokens later, e.g.:
     const token = localStorage.getItem("token");
     if (token) config.headers.Authorization = `Bearer ${token}`;
─────────────────────────────────────────────────────────────────────────── */
axiosClient.interceptors.request.use(
  (config) => {
    // Attach JWT here when auth is implemented (bonus)
    // const token = localStorage.getItem("token");
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

/* ── Response interceptor ────────────────────────────────────────────────────
   Normalises every error into a plain Error with a .message string
   so calling code can always do: catch (err) { err.message }
─────────────────────────────────────────────────────────────────────────── */
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";
    const enhanced = new Error(message);
    enhanced.statusCode = error.response?.status;
    enhanced.data = error.response?.data;
    return Promise.reject(enhanced);
  }
);

export default axiosClient;
