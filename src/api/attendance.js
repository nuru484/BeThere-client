// src/api/attendance.js
import { api } from ".";

export const createAttendance = async (credentials) =>
  api.post(`attendance`, credentials);

export const updateAttendance = async (credentials) =>
  api.put(`/attendance`, credentials);

export const getUserAttendance = async (userId) =>
  api.get(`/attendance/user/${userId}`);

export const getEventAttendance = async (eventId) =>
  api.get(`/attendance/event/${eventId}`);

export const getUserEventAttendance = async (userId, eventId) =>
  api.get(`/attendance/user/${userId}/event/${eventId}`);
