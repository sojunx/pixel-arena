import { createContext, useContext } from "react";

interface IAuthContext {
  currentUsername: string | null;
  handleSubmit: (data: string) => void;
}

export const AuthContext = createContext<IAuthContext | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within a AuthProvider");

  return context;
};
