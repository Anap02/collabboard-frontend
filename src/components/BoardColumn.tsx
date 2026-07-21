import CardItem from "./CardItem";
import type { Card } from "../api/cardApi";

type Props = {
  index: string;
  title: string;
  cards: Card[];
  onDelete: (id: number) => void;
  onEdit: (card: Card) => void;
  onAdd: () => void;
};

export default function BoardColumn({
  index,
  title,
  cards,
  onDelete,
  onEdit,
  onAdd,
}: Props) {
  return (
    <div className="column">
      <div className="column-head">
        <span className="column-index">{index}</span>
        <h2>{title}</h2>
        <span className="column-count">{cards.length}</span>
      </div>

      <button className="add-card-btn" onClick={onAdd}>
        + Add card
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