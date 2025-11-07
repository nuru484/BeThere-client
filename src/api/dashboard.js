// src/api/dashboard.js
import { api } from ".";
import { buildSearchParams } from "./users";

export const getAdminDashboardTotals = async () =>
  api.get("/dashboard/admin/totals");

export const getAllUsersAttendanceData = async (params = {}) => {
  const queryString = buildSearchParams(params);

  const url = `/dashboard/admin/attendance-data${
    queryString ? `?${queryString}` : ""
  }`;

  return await api.get(url);
};

export const getUserDashboardTotals = async () =>
  api.get("/dashboard/users/totals");

export const getRecentEvents = async () =>
  api.get("/dashboard/users/recent-events");

export const getUserAttendanceData = async (params = {}) => {
  const queryString = buildSearchParams(params);

  const url = `/dashboard/users/attendance-data${
    queryString ? `?${queryString}` : ""
  }`;

  return await api.get(url);
};
