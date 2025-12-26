import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import {
  AuthProvider,
  CanvasProvider,
  CanvasToolProvider,
  WebSocketProvider,
  LoggerProvider,
} from "@/providers";

createRoot(document.getElementById("root")!).render(
  <>
    <StrictMode>
      <LoggerProvider>
        <WebSocketProvider>
          <AuthProvider>
            <CanvasProvider>
              <CanvasToolProvider>
                <App />
              </CanvasToolProvider>
            </CanvasProvider>
          </AuthProvider>
        </WebSocketProvider>
      </LoggerProvider>
    </StrictMode>
  </>
);
