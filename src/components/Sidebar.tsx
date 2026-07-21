import type { Board } from "../api/boardApi";
import BoardCard from "./BoardCard";

type Props = {
  boards: Board[];
  selectedBoard: Board | null;
  onSelect: (board: Board) => void;
  onEdit: (board: Board) => void;
  onDelete: (id: number) => void;
};

export default function Sidebar({
  boards,
  selectedBoard,
  onSelect,
  onEdit,
  onDelete,
}: Props) {
  return (
    <aside className="sidebar">
      <span className="sidebar-eyebrow">Boards ({boards.length})</span>

      {boards.map((board) => (
        <BoardCard
          key={board.id}
          board={board}
          active={selectedBoard?.id === board.id}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}

      {boards.length === 0 && (
        <span className="board-header-empty">
          Niciun board încă — creează unul din dreapta.
        </span>
      )}
    </aside>
  );
}