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
export const getUserById = async (userId) => await api.get(`/users/${userId}`);

// Add/Create new user
export const addUser = async (userData) => await api.post("/users", userData);

// Update user profile
export const updateUserProfile = async (userId, userData) =>
  await api.put(`/users/${userId}`, userData);

export const updateUserProfilePicture = async (userId, formData) => {
  if (!(formData instanceof FormData)) {
    throw new Error("The second argument must be an instance of FormData");
  }

  return await api.patch(`/users/${userId}/profile-picture`, formData);
};

export const changePassword = async (userId, data) =>
  await api.patch(`/users/${userId}/password`, data);

// Update user role
export const updateUserRole = async (userId, role) =>
  await api.patch(`/users/${userId}/role`, { role });

// Delete single user
export const deleteUser = async (userId) =>
  await api.delete(`/users/${userId}`);

// Delete all users
export const deleteAllUsers = async (confirmData) => {
  return await api.delete("/users", {
    data: confirmData,
  });
};
