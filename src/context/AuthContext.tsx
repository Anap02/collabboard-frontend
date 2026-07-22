import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getProfile } from "../api/usersApi";
import type { AppUser } from "../api/usersApi";

type AuthContextType = {
  token: string | null;
  user: AppUser | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [user, setUser] = useState<AppUser | null>(null);

  
  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    getProfile()
      .then((res) => setUser(res.data))
      .catch(() => {
       
        setUser(null);
      });
  }, [token]);

  const login = (jwt: string) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}