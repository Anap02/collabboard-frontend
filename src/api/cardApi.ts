import api from "./axios";
import type { AppUser } from "./usersApi";

export type CardStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Card {
  id: number;
  title: string;
  description?: string | null;
  status: CardStatus;
  boardId: number;
  assigneeId?: number | null;
  assignee?: AppUser | null;
  dueDate?: string | null;
}

export interface CreateCardDto {
  title: string;
  description?: string;
  status: CardStatus;
  boardId: number;
  assigneeId?: number | null;
  dueDate?: string | null;
}

export interface UpdateCardDto {
  title?: string;
  description?: string;
  status?: CardStatus;
  assigneeId?: number | null;
  dueDate?: string | null;
}

export const getCards = () => api.get<Card[]>("/cards");

export const createCard = (card: CreateCardDto) =>
  api.post("/cards", card);

export const updateCard = (id: number, data: UpdateCardDto) =>
  api.patch(`/cards/${id}`, data);

export const deleteCard = (id: number) =>
  api.delete(`/cards/${id}`);

export const getCardsByBoard = (boardId: number) =>
  api.get<Card[]>(`/cards/board/${boardId}`);