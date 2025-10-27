import { api } from ".";

export const addFaceScan = async (data) => api.post(`/facescan`, data);

export const getFaceScan = (identityNumber) =>
  api.get(`/facescan/${identityNumber}`);

export const deleteFaceScan = async (identityNumber) =>
  api.delete(`/facescan/${identityNumber}`);
