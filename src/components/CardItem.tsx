import type { Card } from "../api/cardApi";

type Props = {
  card: Card;
  onDelete: (id: number) => void;
  onEdit: (card: Card) => void;
};

const STATUS_LABEL: Record<Card["status"], string> = {
  TODO: "Todo",
  IN_PROGRESS: "In progress",
  DONE: "Done",
};

function initials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDueDate(dueDate?: string | null) {
  if (!dueDate) return null;
  const date = new Date(dueDate);
  const isOverdue = date.getTime() < Date.now();
  const formatted = date.toLocaleDateString("ro-RO", {
    day: "2-digit",
    month: "short",
  });
  return { formatted, isOverdue };
}

export default function CardItem({ card, onDelete, onEdit }: Props) {
  const due = formatDueDate(card.dueDate);

  return (
    <div className="card">
      <h4>{card.title}</h4>

      {card.description && <p>{card.description}</p>}

      <div className="card-meta">
        <span className={`status-pill ${card.status.toLowerCase()}`}>
          {STATUS_LABEL[card.status]}
        </span>

        {due && (
          <span className={`card-due ${due.isOverdue ? "overdue" : ""}`}>
            {due.formatted}
          </span>
        )}

        {card.assignee && (
          <span
            className="card-assignee"
            title={card.assignee.name}
          >
            {initials(card.assignee.name)}
          </span>
        )}
      </div>

      <div className="card-buttons">
        <button onClick={() => onEdit(card)}>Edit</button>

        <button className="danger" onClick={() => onDelete(card.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}