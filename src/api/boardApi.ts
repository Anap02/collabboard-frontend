import api from "./axios";

export interface Board {
  id: number;
  title: string;
  ownerId?: number;
}

export const getBoards = () => api.get<Board[]>("/boards");

export const createBoard = (title: string) =>
  api.post("/boards", { title });

export const updateBoard = (id: number, title: string) =>
  api.patch(`/boards/${id}`, { title });

export const deleteBoard = (id: number) =>
  api.delete(`/boards/${id}`);