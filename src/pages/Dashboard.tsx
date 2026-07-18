import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BoardColumn from "../components/BoardColumn";
import { socket } from "../api/socket";

import type { Board } from "../api/boardApi";
import type { Card } from "../api/cardApi";

import {
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} from "../api/boardApi";

import {
  getCardsByBoard,
  deleteCard,
  updateCard,
   createCard,
} from "../api/cardApi";

export default function Dashboard() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [cards, setCards] = useState<Card[]>([]);

  const [newBoard, setNewBoard] = useState("");

  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const [editingCard, setEditingCard] =
    useState<Card | null>(null);

const [cardTitle, setCardTitle] =
    useState("");

const [cardDescription, setCardDescription] =
    useState("");

const [cardStatus, setCardStatus] =
    useState<"TODO"|"IN_PROGRESS"|"DONE">("TODO");
const [newCardTitle, setNewCardTitle] = useState("");
const [newCardDescription, setNewCardDescription] = useState("");
const [newCardStatus, setNewCardStatus] = useState<
  "TODO" | "IN_PROGRESS" | "DONE"
>("TODO");    

  async function loadBoards() {
    const res = await getBoards();

    setBoards(res.data);

    if (res.data.length > 0 && !selectedBoard) {
      setSelectedBoard(res.data[0]);
    }
  }

  async function loadCards(boardId: number) {
    const res = await getCardsByBoard(boardId);
    setCards(res.data);
  }

  useEffect(() => {
    loadBoards();
  }, []);

  useEffect(() => {
    if (selectedBoard) {
      loadCards(selectedBoard.id);
    }
  }, [selectedBoard]);

  useEffect(() => {
  socket.auth = {
    token: localStorage.getItem("token"),
  };

  socket.connect();

  return () => {
    socket.disconnect();
  };
}, []);

  async function handleCreateBoard() {
    if (!newBoard.trim()) return;

    await createBoard(newBoard);

    setNewBoard("");

    loadBoards();
  }

  async function handleDeleteBoard(id: number) {
    if (!window.confirm("Ștergi board-ul?")) return;

    await deleteBoard(id);

    loadBoards();
  }

  async function handleUpdateBoard() {
    if (!editingBoard) return;

    await updateBoard(editingBoard.id, editTitle);

    setEditingBoard(null);

    setEditTitle("");

    loadBoards();
  }

  async function handleDeleteCard(id: number) {
    await deleteCard(id);

    if (selectedBoard) {
      loadCards(selectedBoard.id);
    }
  }

  async function handleCreateCard() {
  if (!selectedBoard) return;

  if (!newCardTitle.trim()) return;

  await createCard({
    title: newCardTitle,
    description: newCardDescription,
    status: newCardStatus,
    boardId: selectedBoard.id,
  });

  setNewCardTitle("");
  setNewCardDescription("");
  setNewCardStatus("TODO");

  loadCards(selectedBoard.id);
}
async function handleEditCard(card: Card) {
  console.log("EDIT",card);
  const title = prompt("Title:", card.title);

  if (title === null) return;

  const description = prompt(
    "Description:",
    card.description ?? ""
  );

  if (description === null) return;

  const status = prompt(
    "Status (TODO, IN_PROGRESS, DONE):",
    card.status
  );

  if (status === null) return;

  if (
    status !== "TODO" &&
    status !== "IN_PROGRESS" &&
    status !== "DONE"
  ) {
    alert("Status invalid!");
    return;
  }

  await updateCard(card.id, {
    title,
    description,
    status,
  });

  if (selectedBoard) {
    loadCards(selectedBoard.id);
  }
}

  async function handleUpdateCard() {
  if (!editingCard) return;

  await updateCard(editingCard.id, {
    title: cardTitle,
    description: cardDescription,
    status: cardStatus,
  });

  setEditingCard(null);

  if (selectedBoard) {
    loadCards(selectedBoard.id);
  }
}

  return (
    <>
      <Navbar />

      <div className="dashboard">
        <Sidebar
          boards={boards}
          selectedBoard={selectedBoard}
          onSelect={setSelectedBoard}
          onEdit={(board) => {
            setEditingBoard(board);
            setEditTitle(board.title);
          }}
          onDelete={handleDeleteBoard}
        />

        <main className="board-area">
          <div className="board-header">
            <h1>
              {selectedBoard
                ? selectedBoard.title
                : "Selectează un board"}
            </h1>

            <div className="create-card">

  <input
    placeholder="Card title..."
    value={newCardTitle}
    onChange={(e) => setNewCardTitle(e.target.value)}
  />

  <textarea
    placeholder="Description..."
    value={newCardDescription}
    onChange={(e) => setNewCardDescription(e.target.value)}
  />

  <select
    value={newCardStatus}
    onChange={(e) =>
      setNewCardStatus(
        e.target.value as "TODO" | "IN_PROGRESS" | "DONE"
      )
    }
  >
    <option value="TODO">TODO</option>
    <option value="IN_PROGRESS">IN PROGRESS</option>
    <option value="DONE">DONE</option>
  </select>

  <button onClick={handleCreateCard}>
    Add Card
  </button>

</div>

            <div className="new-board">
              <input
                placeholder="Board title..."
                value={newBoard}
                onChange={(e) => setNewBoard(e.target.value)}
              />

              <button onClick={handleCreateBoard}>
                Create
              </button>
            </div>

          </div>

          {editingBoard && (
            <div className="new-board">
              <input
                value={editTitle}
                onChange={(e) =>
                  setEditTitle(e.target.value)
                }
              />

              <button onClick={handleUpdateBoard}>
                Save
              </button>

              <button
                onClick={() => setEditingBoard(null)}
              >
                Cancel
              </button>
            </div>
          )}

          <div className="columns">
            <BoardColumn
              title="TODO"
              cards={cards.filter(
                (c) => c.status === "TODO"
              )}
              onDelete={handleDeleteCard}
              onAdd={() => {}}
              onEdit={
                handleEditCard
              }
            />

            <BoardColumn
              title="IN PROGRESS"
              cards={cards.filter(
                (c) => c.status === "IN_PROGRESS"
              )}
              onDelete={handleDeleteCard}
              onAdd={() => {}}
              onEdit={(card) => {
                setEditingCard(card);
                setCardTitle(card.title);
                setCardDescription(card.description ?? "");
                setCardStatus(card.status);
              }}
            />

            <BoardColumn
              title="DONE"
              cards={cards.filter(
                (c) => c.status === "DONE"
              )}
              onDelete={handleDeleteCard}
              onAdd={() => {}}
              onEdit={(card) => {
                setEditingCard(card);
                setCardTitle(card.title);
                setCardDescription(card.description ?? "");
                setCardStatus(card.status);
              }}
            />
          </div>
        </main>
      </div>
    </>
  );
}