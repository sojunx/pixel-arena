import type { MouseEvent, RefObject } from "react";

export interface User {
  username: string;
}

export interface ConcurrencyMode {
  value: "NONE" | "PESSIMISTIC" | "OPTIMISTIC";
  label: string;
}

export interface ColorPalette {
  label: string;
  value: string;
}

export interface PixelRecord {
  x: number;
  y: number;
  color: string;
  updatedBy: string;
  updatedAt: Date;
  version: number;
}

export interface PixelCoord {
  x: number;
  y: number;
}

export interface PixelHistory {
  id: number;
  x: number;
  y: number;
  oldColor: string;
  newColor: string;
  changedBy: string;
  changedAt: Date;
}

export interface PixelRequest {
  x: number;
  y: number;
  color: string;
  updatedBy: string;
  mode: "NONE" | "PESSIMISTIC" | "OPTIMISTIC";
}

export interface PixelUpdateMessage {
  x: number;
  y: number;
  color: string;
  updatedBy: string;
  updatedAt: Date;
  version: number;
}

export interface AppError {
  error?: string;
  message: string;
  status?: number;
  remainingSeconds?: number;
}

export interface CanvasFuncProps {
  e: MouseEvent<HTMLCanvasElement>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}
