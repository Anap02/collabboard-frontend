import api from "./axios";

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export const login = (data: LoginDto) => {
  return api.post("/auth/login", data);
};

export const register = (data: RegisterDto) => {
  return api.post("/auth/register", data);
};