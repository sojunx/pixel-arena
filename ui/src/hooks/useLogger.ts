import { createContext, useContext } from "react";

interface ILoggerContext {
  logs: string[];
  addLog: (type: "WS" | "PIXEL" | "ERROR" | "DEMO", message: string) => void;
  clearLog: () => void;
}

export const LoggerContext = createContext<ILoggerContext | null>(null);

export const useLogger = () => {
  const context = useContext(LoggerContext);
  if (!context)
    throw new Error("useLogger must be used within a LoggerProvider");

  return context;
};
