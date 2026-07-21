import { useAuth } from "../context/AuthContext";

type Props = {
  connected?: boolean;
};

export default function Navbar({ connected = false }: Props) {
  const { logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-mark">CB</span>
        <h2>CollabBoard</h2>
      </div>

      <div className="navbar-right">
        <span className={`live-status ${connected ? "connected" : ""}`}>
          <span className="live-dot" />
          {connected ? "Live" : "Offline"}
        </span>

        <button className="ghost" onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}