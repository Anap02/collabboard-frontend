import type { Card } from "../api/cardApi";

type Props = {
  card: Card;
  onDelete: (id: number) => void;
  onEdit: (card: Card) => void;
};

export default function CardItem({
  card,
  onDelete,
  onEdit,
}: Props) {
  return (
    <div className="card">
      <h4>{card.title}</h4>

      {card.description && <p>{card.description}</p>}

      <span>{card.status}</span>

      <div className="card-buttons">
        <button onClick={() => onEdit(card)}>
          Edit
        </button>

        <button
          className="delete-btn"
          onClick={() => onDelete(card.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}