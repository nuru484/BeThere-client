import { api } from ".";

export const fetchEvent = async (eventId) =>
  await api.get(`/events/${eventId}`);

export const fetchEvents = async () => await api.get(`/events`);

export const createEvent = async (credentials) =>
  await api.post(`/events`, credentials);

export const updateEvent = async (eventId, data) =>
  await api.put(`/events/${eventId}`, data);

export const deleteEvent = async (eventId) =>
  await api.delete(`/events/${eventId}`);

export const deleteAllEvents = async () => await api.delete(`/events`);
