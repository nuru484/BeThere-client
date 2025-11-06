import { api } from ".";

export const addFaceScan = async (data) => api.post(`/facescan`, data);

export const getUserFaceScan = (userId) => api.get(`/facescan/${userId}`);

export const deleteFaceScan = (userId) => api.delete(`/facescan/${userId}`);
