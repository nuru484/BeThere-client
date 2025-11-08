// src/api/attendance.js
import { api } from ".";
import { buildSearchParams } from "./users";

export const createAttendance = async (eventId, data) =>
  api.post(`/attendance/${eventId}`, data);

export const updateAttendance = async (eventId, data) =>
  api.put(`/attendance/${eventId}`, data);

export const getUserAttendance = async (userId, params = {}) => {
  const queryString = buildSearchParams(params);

  const url = `/attendance/users/${userId}${
    queryString ? `?${queryString}` : ""
  }`;

  return await api.get(url);
};

export const getEventAttendance = async (eventId) =>
  api.get(`/attendance/events/${eventId}`);

export const getUserEventAttendance = async (userId, eventId) =>
  api.get(`/attendance/users/${userId}/events/${eventId}`);
