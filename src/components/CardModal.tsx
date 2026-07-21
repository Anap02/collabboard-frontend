import { useEffect, useState } from "react";
import { createCard, updateCard } from "../api/cardApi";
import type { Card, CardStatus } from "../api/cardApi";
import { getUsers } from "../api/usersApi";
import type { AppUser } from "../api/usersApi";

type Props = {
  open: boolean;
  boardId: number;
  card?: Card | null;
  onClose: () => void;
  onSaved: () => void;
};

// input type="date" lucrează cu "YYYY-MM-DD"
function toDateInputValue(iso?: string | null) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

export default function CardModal({
  open,
  boardId,
  card,
  onClose,
  onSaved,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<CardStatus>("TODO");
  const [assigneeId, setAssigneeId] = useState<string>("");
  const [dueDate, setDueDate] = useState("");
  const [users, setUsers] = useState<AppUser[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    getUsers()
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
  }, [open]);

  useEffect(() => {
    if (card) {
      setTitle(card.title);
      setDescription(card.description ?? "");
      setStatus(card.status);
      setAssigneeId(card.assigneeId ? String(card.assigneeId) : "");
      setDueDate(toDateInputValue(card.dueDate));
    } else {
      setTitle("");
      setDescription("");
      setStatus("TODO");
      setAssigneeId("");
      setDueDate("");
    }
  }, [card, open]);

  if (!open) return null;

  async function handleSave() {
    if (!title.trim()) return;

    setSaving(true);

    const payload = {
      title,
      description,
      status,
      assigneeId: assigneeId ? Number(assigneeId) : null,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    };

    try {
      if (card) {
        await updateCard(card.id, payload);
      } else {
        await createCard({ ...payload, boardId });
      }

      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{card ? "Editează card" : "Card nou"}</h2>

        <div className="modal-field">
          <label>Titlu</label>
          <input
            placeholder="Ex: Configurează coada BullMQ"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="modal-field">
          <label>Descriere</label>
          <textarea
            placeholder="Detalii despre task..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="modal-row">
          <div className="modal-field">
            <label>Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CardStatus)}
            >
              <option value="TODO">Todo</option>
              <option value="IN_PROGRESS">In progress</option>
              <option value="DONE">Done</option>
            </select>
          </div>

          <div className="modal-field">
            <label>Due date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-field">
          <label>Assignee</label>
          <select
            value={assigneeId}
            onChange={(e) => setAssigneeId(e.target.value)}
          >
            <option value="">Fără assignee</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div className="modal-buttons">
          <button className="primary" onClick={handleSave} disabled={saving}>
            {saving ? "Se salvează..." : "Salvează"}
          </button>

          <button className="cancel-btn" onClick={onClose}>
            Anulează
          </button>
        </div>
      </div>
    </div>
  );
}