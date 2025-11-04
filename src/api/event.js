import { api } from ".";

export const fetchEvent = async (eventId) => {
  return await api.get(`/events/${eventId}`);
};

export const fetchEvents = async () => {
  return await api.get(`/events`);
};

export const createEvent = async (credentials) => {
  return await api.post(`/events`, credentials);
};

export const updateEvent = async (eventId, credentials) => {
  return await api.put(`/events/${eventId}`, credentials);
};

export const deleteEvent = async (eventId) => {
  return await api.delete(`/events/${eventId}`);
};

export const deleteAllEvents = async () => {
  return await api.delete(`/events`);
};
