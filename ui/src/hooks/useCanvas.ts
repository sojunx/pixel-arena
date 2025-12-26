import type { OverlayCanvas } from "@/lib/canvas";
import type { PixelCoord, PixelRecord } from "@/lib/types";
import { createContext, useContext, type RefObject } from "react";

interface ICanvasContext {
  data: PixelRecord[] | null;
  loading: boolean;
  hoveredPos: PixelCoord | null;
  selectedPos: PixelCoord | null;
  onMouseMove: (
    event: React.MouseEvent<HTMLCanvasElement>,
    overlayRef: RefObject<OverlayCanvas | null>
  ) => void;
  onMouseClick: (
    event: React.MouseEvent<HTMLCanvasElement>,
    overlayRef: RefObject<OverlayCanvas | null>
  ) => void;
  onMouseLeave: () => void;
  clearSelected: () => void;
}

export const CanvasContext = createContext<ICanvasContext | null>(null);

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context)
    throw new Error("useCanvas must be used within a CanvasProvider");

  return context;
};
