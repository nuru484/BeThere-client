// src/api/users.js
import { api } from ".";

// URL search params helper
const buildSearchParams = (params) => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  });

  return searchParams.toString();
};

// Get all users with pagination and filters
export const getUsers = async (params = {}) => {
  const queryString = buildSearchParams(params);
  const url = `/users${queryString ? `?${queryString}` : ""}`;

  const response = await api.get(url);
  return response;
};

// Get single user by ID
export const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response;
};

// Add/Create new user
export const addUser = async (userData) => {
  const response = await api.post("/users", userData);
  return response;
};

// Update user profile
export const updateUser = async (userId, userData) => {
  const response = await api.put(`/users/${userId}`, userData);
  return response;
};

// Update user role
export const updateUserRole = async (userId, role) => {
  const response = await api.patch(`/users/${userId}/role`, { role });
  return response;
};

// Delete single user
export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response;
};

// Delete all users
export const deleteAllUsers = async (confirmData) => {
  const response = await api.delete("/users", {
    data: confirmData,
  });
  return response;
};
