// src/api/dashboard.js
import { api } from ".";

export const getTotalUsersCount = async () => api.get("/dashboard/users");

export const getTotalEventsCount = async () =>
  api.get("/dashboard/events/total");

export const getUpcomingEventsCount = async () =>
  api.get("/dashboard/events/upcoming");

export const getAttendanceRecordsToday = async () =>
  api.get("/dashboard/attendance/today");

export const getRecentActivityFeed = async () =>
  api.get("/dashboard/activity/recent");
