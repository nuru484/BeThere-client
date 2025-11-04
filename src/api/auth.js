import { api } from ".";

export const refreshTokenApi = async () => {
  return await api.post("/refreshToken");
};

export const login = async (credentials) => {
  return await api.post("/auth/login", credentials);
};
