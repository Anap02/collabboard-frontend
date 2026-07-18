import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/authApi";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await register(form);

      alert("Cont creat cu succes!");

      navigate("/login");
    } catch (err: any) {
          console.log(err);
  console.log(err.response);
      setError(
        err.response?.data?.message || "A apărut o eroare."
      );
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-box" onSubmit={handleSubmit}>

        <h1>CollabBoard</h1>

        <h2>Register</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="text"
          placeholder="Nume"
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Parolă"
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <button type="submit">

          Register

        </button>

        <p>

          Ai deja cont?

          <Link to="/login">

            Login

          </Link>

        </p>

      </form>
    </div>
  );
}