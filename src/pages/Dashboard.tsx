import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import BoardColumn from "../components/BoardColumn";
import CardModal from "../components/CardModal";
import { socket } from "../api/socket";
import { importCsv } from "../api/importApi";

import type { Board } from "../api/boardApi";
import type { Card } from "../api/cardApi";

import {
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} from "../api/boardApi";

import { getCardsByBoard, deleteCard } from "../api/cardApi";

export default function Dashboard() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [connected, setConnected] = useState(false);

  const [newBoard, setNewBoard] = useState("");
  const [editingBoard, setEditingBoard] = useState<Board | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [importing, setImporting] = useState(false);

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
    if (!selectedBoard) return;

    socket.emit("joinBoard", selectedBoard.id);

    
    const handleReconnect = () => socket.emit("joinBoard", selectedBoard.id);
    socket.on("connect", handleReconnect);

    const handleCardCreated = (card: Card) => {
      if (card.boardId !== selectedBoard.id) return;
      setCards((prev) => [...prev, card]);
    };

    const handleCardUpdated = (card: Card) => {
      if (card.boardId !== selectedBoard.id) return;
      setCards((prev) => prev.map((c) => (c.id === card.id ? card : c)));
    };

    const handleCardDeleted = ({ id }: { id: number }) => {
      setCards((prev) => prev.filter((c) => c.id !== id));
    };

    socket.on("cardCreated", handleCardCreated);
    socket.on("cardUpdated", handleCardUpdated);
    socket.on("cardDeleted", handleCardDeleted);

    return () => {
      socket.off("connect", handleReconnect);
      socket.off("cardCreated", handleCardCreated);
      socket.off("cardUpdated", handleCardUpdated);
      socket.off("cardDeleted", handleCardDeleted);
    };
  }, [selectedBoard]);

  useEffect(() => {
    socket.auth = {
      token: localStorage.getItem("token"),
    };

    socket.connect();

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.disconnect();
    };
  }, []);

  async function handleCreateBoard() {
    if (!newBoard.trim()) return;

    await createBoard(newBoard);
    setNewBoard("");
    loadBoards();
  }

  async function handleImport(file: File) {
  if (!selectedBoard) return;

  try {
    setImporting(true);

    await importCsv(selectedBoard.id, file);

    alert("Import pornit cu succes!");

  } catch (err) {
    console.error(err);
    alert("Importul a eșuat.");
  } finally {
    setImporting(false);
  }
}

  async function handleDeleteBoard(id: number) {
    if (!window.confirm("Ștergi board-ul?")) return;

    await deleteBoard(id);

    if (selectedBoard?.id === id) {
      setSelectedBoard(null);
    }

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

  function openNewCardModal() {
    setEditingCard(null);
    setModalOpen(true);
  }

  function openEditCardModal(card: Card) {
    setEditingCard(card);
    setModalOpen(true);
  }

  function handleCardSaved() {
    if (selectedBoard) {
      loadCards(selectedBoard.id);
    }
  }

  const columns: { index: string; title: string; status: Card["status"] }[] = [
    { index: "01", title: "Todo", status: "TODO" },
    { index: "02", title: "In progress", status: "IN_PROGRESS" },
    { index: "03", title: "Done", status: "DONE" },
  ];

  return (
    <>
      <Navbar connected={connected} />

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
              {selectedBoard ? selectedBoard.title : "Selectează un board"}
            </h1>

            <div className="new-board">
              <input
                placeholder="Board nou..."
                value={newBoard}
                onChange={(e) => setNewBoard(e.target.value)}
              />

              <button className="primary" onClick={handleCreateBoard}>
                Create board
              </button>

              {selectedBoard && (
    <>
      <input
        id="csvUpload"
        type="file"
        accept=".csv"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            handleImport(file);
          }
        }}
      />

      <button
        className="primary"
        disabled={importing}
        onClick={() =>
          document.getElementById("csvUpload")?.click()
        }
      >
        {importing ? "Importing..." : "Import CSV"}
      </button>
    </>
  )}
            </div>
          </div>

          {editingBoard && (
            <div className="new-board" style={{ marginBottom: 20 }}>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />

              <button className="primary" onClick={handleUpdateBoard}>
                Save
              </button>

              <button onClick={() => setEditingBoard(null)}>Cancel</button>
            </div>
          )}

          {selectedBoard ? (
            <div className="columns">
              {columns.map((col) => (
                <BoardColumn
                  key={col.status}
                  index={col.index}
                  title={col.title}
                  cards={cards.filter((c) => c.status === col.status)}
                  onDelete={handleDeleteCard}
                  onEdit={openEditCardModal}
                  onAdd={openNewCardModal}
                />
              ))}
            </div>
          ) : (
            <p className="board-header-empty">
              Creează sau selectează un board pentru a vedea cardurile.
            </p>
          )}
        </main>
      </div>

      {selectedBoard && (
        <CardModal
          open={modalOpen}
          boardId={selectedBoard.id}
          card={editingCard}
          onClose={() => setModalOpen(false)}
          onSaved={handleCardSaved}
        />
      )}
    </>
  );
}