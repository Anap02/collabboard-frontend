import { useEffect, useState } from "react";
import { createCard, updateCard } from "../api/cardApi";
import type { Card, CardStatus } from "../api/cardApi";

type Props = {
  open: boolean;
  boardId: number;
  card?: Card | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function CardModal({
  open,
  boardId,
  card,
  onClose,
  onSaved,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] =
    useState<CardStatus>("TODO");

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description ?? "");
      setStatus(card.status);
    } else {
      setTitle("");
      setDescription("");
      setStatus("TODO");
    }
  }, [card, open]);

  if (!open) return null;

  async function handleSave() {
    if (!title.trim()) return;

    if (card) {
      await updateCard(card.id, {
        title,
        description,
        status,
      });
    } else {
      await createCard({
        title,
        description,
        status,
        boardId,
      });
    }

    onSaved();
    onClose();
  }

  return (
    <div className="modal-overlay">

      <div className="modal">

        <h2>

          {card ? "Edit Card" : "Add Card"}

        </h2>

        <input
          placeholder="Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <select
          value={status}
          onChange={(e) =>
            setStatus(
              e.target.value as CardStatus
            )
          }
        >
          <option value="TODO">
            TODO
          </option>

          <option value="IN_PROGRESS">
            IN PROGRESS
          </option>

          <option value="DONE">
            DONE
          </option>
        </select>

        <div className="modal-buttons">

          <button onClick={handleSave}>
            Save
          </button>

          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
}