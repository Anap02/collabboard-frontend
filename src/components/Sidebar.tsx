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
      <h2>Boards</h2>

      {boards.map((board) => (
        <BoardCard
          key={board.id}
          board={board}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </aside>
  );
}