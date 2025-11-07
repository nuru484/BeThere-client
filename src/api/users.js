// src/api/users.js
import { api } from ".";

// URL search params helper
export const buildSearchParams = (params) => {
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

  return await api.get(url);
};

// Get single user by ID
export const getUserById = async (userId) => {
  return await api.get(`/users/${userId}`);
};

// Add/Create new user
export const addUser = async (userData) => {
  return await api.post("/users", userData);
};

// Update user profile
export const updateUser = async (userId, userData) => {
  return await api.put(`/users/${userId}`, userData);
};

// Update user role
export const updateUserRole = async (userId, role) => {
  return await api.patch(`/users/${userId}/role`, { role });
};

// Delete single user
export const deleteUser = async (userId) => {
  return await api.delete(`/users/${userId}`);
};

// Delete all users
export const deleteAllUsers = async (confirmData) => {
  return await api.delete("/users", {
    data: confirmData,
  });
};
