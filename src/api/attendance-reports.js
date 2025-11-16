// src/api/attendance-reports.js
import { api } from ".";
import { buildSearchParams } from "./users";

export const getAttendanceReport = async (params = {}) => {
  const queryString = buildSearchParams(params);

  const url = `/attendance-reports${queryString ? `?${queryString}` : ""}`;

  return await api.get(url);
};
