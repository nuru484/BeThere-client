// src/api/reports.js
import { api } from ".";
import { buildSearchParams } from "./users";

/**
 * Get comprehensive attendance report
 * @param {Object} params - Filter parameters (startDate, endDate, eventId, userId, status, eventType, locationId, groupBy, page, limit)
 */
export const getAttendanceReport = async (params = {}) => {
  const queryString = buildSearchParams(params);

  const url = `/attendance-reports${queryString ? `?${queryString}` : ""}`;

  return await api.get(url);
};

/**
 * Get attendance summary with statistics
 * @param {Object} params - Filter parameters (startDate, endDate, eventId, userId)
 */
export const getAttendanceSummary = async (params = {}) => {
  const queryString = buildSearchParams(params);

  const url = `/attendance-reports/summary${
    queryString ? `?${queryString}` : ""
  }`;

  return await api.get(url);
};

/**
 * Get event attendance rate
 * @param {number} eventId - Event ID
 */
export const getEventAttendanceRate = async (eventId) => {
  if (!eventId) {
    throw new Error("Event ID is required");
  }

  return await api.get(`/attendance-reports/event/${eventId}/rate`);
};

/**
 * Get user attendance rate
 * @param {number} userId - User ID
 * @param {Object} params - Filter parameters (startDate, endDate)
 */
export const getUserAttendanceRate = async (userId, params = {}) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const queryString = buildSearchParams(params);

  const url = `/attendance-reports/user/${userId}/rate${
    queryString ? `?${queryString}` : ""
  }`;

  return await api.get(url);
};
