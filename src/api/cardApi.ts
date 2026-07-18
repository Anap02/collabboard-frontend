import api from "./axios";

export type CardStatus = "TODO" | "IN_PROGRESS" | "DONE";

export interface Card {
  id: number;
  title: string;
  description?: string;
  status: CardStatus;
  boardId: number;
}

export interface CreateCardDto {
  title: string;
  description?: string;
  status: CardStatus;
  boardId: number;
}

export const getCards = () => api.get<Card[]>("/cards");

export const createCard = (card: CreateCardDto) =>
  api.post("/cards", card);

export const updateCard = (
  id: number,
  data: {
    title?: string;
    description?: string;
    status?: "TODO" | "IN_PROGRESS" | "DONE";
  }
) => api.patch(`/cards/${id}`, data);

export const deleteCard = (id: number) =>
  api.delete(`/cards/${id}`);

export const getCardsByBoard = (boardId: number) =>
  api.get<Card[]>(`/cards/board/${boardId}`);
