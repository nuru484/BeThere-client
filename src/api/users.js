// src/api/users.js
import { api } from ".";

export const getUsers = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  return api.get(`/users${queryParams ? `?${queryParams}` : ""}`);
};

export const deleteUser = async (userId) => api.delete(`/users/${userId}`);

export const updateUser = async (userId, userData) =>
  api.put(`/users/${userId}`, userData);

export const updateUserRole = async (userId, role) =>
  api.patch(`/users/${userId}/role`, { role });

export const getUserIdentifications = async () =>
  api.get(`/users/identification`);

export const createUserIdentification = async () =>
  api.post(`/users/identification`);
