import { LoggerContext } from "@/hooks";
import { useState } from "react";

const LoggerProvider = ({ children }: { children: React.ReactNode }) => {
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (type: "WS" | "PIXEL" | "ERROR" | "DEMO", message: string) =>
    setLogs((prev) => [...prev, `[ ${type} ] ${message}`]);

  const clearLog = () => setLogs([]);

  return (
    <LoggerContext.Provider value={{ logs, addLog, clearLog }}>
      {children}
    </LoggerContext.Provider>
  );
};

export default LoggerProvider;
