import type { PixelUpdateMessage } from "@/lib/types";
import { createContext, useContext } from "react";

interface IWebSocketContext {
  message: PixelUpdateMessage | null;
  connected: boolean;
}

export const WebSocketContext = createContext<IWebSocketContext | null>(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context)
    throw new Error("useWebSocket must be used within a WebSocketProvider");

  return context;
};
