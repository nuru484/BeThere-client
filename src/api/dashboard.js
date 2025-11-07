// src/api/dashboard.js
import { api } from ".";

export const getTotalUsersCount = async () => api.get("/dashboard/users");

export const getAdminDashboardTotals = async () =>
  api.get("/dashboard/admin/totals");

export const getAdminDashboardAttendanceData = async () =>
  api.get("/dashboard/admin/attendance-data");
