import type { ColorPalette, PixelCoord, PixelUpdateMessage } from "@/lib/types";
import { createContext, useContext } from "react";

interface ICanvasToolContext {
  currentColor: ColorPalette;
  currentMode: "NONE" | "PESSIMISTIC" | "OPTIMISTIC";
  changeColor: (color: ColorPalette) => void;
  changeMode: (value: string) => void;
  handlePaint: (currentPin: PixelCoord) => Promise<PixelUpdateMessage>;
}

export const CanvasToolContext = createContext<ICanvasToolContext | null>(null);

export const useCanvasTool = () => {
  const context = useContext(CanvasToolContext);
  if (!context)
    throw new Error("useCanvasTool must be used within a CanvasToolProvider");

  return context;
};
