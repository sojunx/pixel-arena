import type React from "react";
import { useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { WEBSOCKET_URL } from "@/lib/constants";
import { useLogger, WebSocketContext } from "@/hooks";
import type { PixelUpdateMessage } from "@/lib/types";

const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { addLog } = useLogger();
  const [connected, setConnected] = useState<boolean>(false);
  const [message, setMessage] = useState<PixelUpdateMessage | null>(null);

  useEffect(() => {
    const client = new Client();

    client.webSocketFactory = () => new SockJS(WEBSOCKET_URL);
    client.reconnectDelay = 3000;

    client.onConnect = () => {
      addLog("WS", "Connected");
      setConnected(true);

      client.subscribe("/topic/pixel-update", (message) => {
        const payload: PixelUpdateMessage = JSON.parse(message.body);

        console.log(payload);

        setMessage(payload);

        // TODO: Need to check again
        addLog(
          "PIXEL",
          `Updated (${payload.x}, ${payload.y}), color (${payload.color})`
        );
      });
    };

    client.onDisconnect = () => {
      addLog("WS", "Disconnected");
      setConnected(false);
    };
    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ message, connected }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
