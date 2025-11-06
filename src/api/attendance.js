// src/api/attendance.js
import { api } from ".";

export const createAttendance = async (eventId, data) =>
  api.post(`/attendance/${eventId}`, data);

export const updateAttendance = async (eventId, data) =>
  api.put(`/attendance/${eventId}`, data);

export const getUserAttendance = async (userId) =>
  api.get(`/attendance/users/${userId}`);

export const getEventAttendance = async (eventId) =>
  api.get(`/attendance/events/${eventId}`);

export const getUserEventAttendance = async (userId, eventId) =>
  api.get(`/attendance/users/${userId}/events/${eventId}`);
