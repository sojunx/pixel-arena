import type { ColorPalette, ConcurrencyMode } from "./types";

export const GRID_SIZE = 100;
export const PIXEL_SIZE = 10;

export const CANVAS_WIDTH = GRID_SIZE * PIXEL_SIZE;
export const CANVAS_HEIGHT = GRID_SIZE * PIXEL_SIZE;

export const CONCURRENCY_MODES: ConcurrencyMode[] = [
  { value: "NONE", label: "No Lock" },
  { value: "PESSIMISTIC", label: "Pessimistic Lock" },
  { value: "OPTIMISTIC", label: "Optimistic Lock" },
] as const;

export const COLORS_PALETTE: ColorPalette[] = [
  {
    label: "",
    value: "#f65356",
  },
  {
    label: "",
    value: "#fb8066",
  },
  {
    label: "",
    value: "#fea671",
  },
  {
    label: "",
    value: "#fec979",
  },
  {
    label: "",
    value: "#feea80",
  },
  {
    label: "",
    value: "#d7e586",
  },
  {
    label: "",
    value: "#a5de94",
  },
  {
    label: "",
    value: "#5daad8",
  },
  {
    label: "",
    value: "#8187c7",
  },
  {
    label: "",
    value: "#c56bba",
  },
] as const;

export const WEBSOCKET_URL = "http://localhost:8080/ws" as const;
