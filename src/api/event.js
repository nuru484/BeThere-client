import { api } from ".";

export const fetchEvent = async (eventId) => {
  return await api.get(`/event/${eventId}`);
};

export const fetchEvents = async () => {
  return await api.get(`/event`);
};

export const createEvent = async (credentials) => {
  return await api.post(`/event`, credentials);
};

export const updateEvent = async (eventId, credentials) => {
  return await api.put(`/event/${eventId}`, credentials);
};

export const deleteEvent = async (eventId) => {
  return await api.delete(`/event/${eventId}`);
};

export const deleteAllEvents = async () => {
  return await api.delete(`/event`);
};
