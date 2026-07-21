import api from "./axios";

export const importCsv = (boardId: number, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post(`/boards/${boardId}/import`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};