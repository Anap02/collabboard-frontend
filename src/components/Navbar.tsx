import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <nav className="navbar">
      <h2>📋 CollabBoard</h2>

      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </nav>
  );
}