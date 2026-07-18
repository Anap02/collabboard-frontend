import CardItem from "./CardItem";
import type { Card } from "../api/cardApi";

type Props = {
  title: string;
  cards: Card[];
  onDelete: (id: number) => void;
  onEdit: (card: Card) => void;
  onAdd: () => void;
};

export default function BoardColumn({
  title,
  cards,
  onDelete,
  onEdit,
  onAdd,
}: Props) {
  return (
    <div className="column">

      <h2>{title}</h2>

      <button
        className="add-card-btn"
        onClick={onAdd}
      >
        + Add Card
      </button>

      {cards.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}

    </div>
  );
}