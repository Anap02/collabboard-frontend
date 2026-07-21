import api from "./axios";

export interface AppUser {
  id: number;
  name: string;
  email: string;
}

export const getUsers = () => api.get<AppUser[]>("/users");