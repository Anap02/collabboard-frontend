import type { Board } from "../api/boardApi";

type Props = {
  board: Board;
  active?: boolean;
  onSelect: (board: Board) => void;
  onEdit: (board: Board) => void;
  onDelete: (id: number) => void;
};

export default function BoardCard({
  board,
  active = false,
  onSelect,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className={`board-card ${active ? "active" : ""}`}>
      <h3 onClick={() => onSelect(board)}>{board.title}</h3>

      <div className="board-actions">
        <button onClick={() => onEdit(board)}>Edit</button>

        <button
          className="danger"
          onClick={() => onDelete(board.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}