import { api } from ".";

export const refreshTokenApi = async () => await api.post("/refreshToken");

export const login = async (credentials) =>
  await api.post("/auth/login", credentials);
