import axios from "axios";
import encryptStorage from "@/lib/encryptedStorage";

class APIError extends Error {
  constructor(message, status, type, details = null) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.type = type;
    this.details = details;
  }
}

const serverURL = import.meta.env.VITE_SERVER_URL;

const api = axios.create({
  baseURL: `${serverURL}/api/v1`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const accessToken = encryptStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only refresh if status is 401 and type is TOKEN_EXPIRED
    if (
      error.response?.status === 401 &&
      error.response?.data?.type === "TOKEN_EXPIRED" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = encryptStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const { data } = await axios.post(
          `${serverURL}/api/v1/refreshToken`,
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
          }
        );

        const newAccessToken = data.newAccessToken;
        const newRefreshToken = data.newRefreshToken;

        encryptStorage.setItem("accessToken", newAccessToken);
        encryptStorage.setItem("refreshToken", newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (err) {
        console.error("Token refresh failed", err);
        encryptStorage.removeItem("accessToken");
        encryptStorage.removeItem("refreshToken");
      }
    }

    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    // Automatically parse JSON responses
    return response.data;
  },
  async (error) => {
    if (error.response) {
      // Server-side error
      const { data, status } = error.response;

      // If errors are available in response, extract the messages
      let message = "An error occurred"; // Default message
      if (data.errors && Array.isArray(data.errors)) {
        // If there are multiple validation errors, we join them into a single message
        message = data.errors.map((err) => err.message).join(", ");
      } else if (data.message) {
        // Fallback if there's a top-level message
        message = data.message;
      }

      const type = data.type || "UNKNOWN_ERROR";
      const details = data.errors || null;

      if (status === 400 || status === 422) {
        throw new APIError(message, status, "VALIDATION_ERROR", details);
      }

      console.log(`message: ${message}`);
      throw new APIError(message, status, type);
    } else if (error.request) {
      // Network error
      throw new APIError("Network error", 0, "NETWORK_ERROR");
    } else if (error.message === "canceled") {
      // Request aborted
      throw new APIError("Request was aborted", 0, "ABORT_ERROR");
    }

    throw new APIError("An unexpected error occurred", 0, "UNEXPECTED_ERROR");
  }
);

export { api, APIError };
