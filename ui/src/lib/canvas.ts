import { GRID_SIZE, PIXEL_SIZE } from "./constants";
import type { PixelCoord, PixelRecord } from "./types";

export class BaseCanvas {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  width: number;
  height: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;

    this.width = GRID_SIZE * PIXEL_SIZE;
    this.height = GRID_SIZE * PIXEL_SIZE;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  init() {
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.clear();
  }

  fillRect(color: string, x: number, y: number, size = PIXEL_SIZE) {
    const baseX = x * PIXEL_SIZE;
    const baseY = y * PIXEL_SIZE;

    this.ctx.fillStyle = color;
    this.ctx.fillRect(baseX, baseY, size, size);
  }

  draw() {}

  getPosition(event: React.MouseEvent<HTMLCanvasElement>): PixelCoord | null {
    const rect = this.canvas.getBoundingClientRect();

    const scaleX = this.width / rect.width;
    const scaleY = this.height / rect.height;

    const x = Math.floor(((event.clientX - rect.left) * scaleX) / PIXEL_SIZE);
    const y = Math.floor(((event.clientY - rect.top) * scaleY) / PIXEL_SIZE);

    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return null;

    return { x, y };
  }
}

export class OverlayCanvas extends BaseCanvas {
  currentPos: PixelCoord | null;

  constructor(canvas: HTMLCanvasElement, currentPos: PixelCoord | null) {
    super(canvas);
    this.currentPos = currentPos;
  }

  draw() {
    this.clear();
    if (!this.currentPos) return;

    this.ctx.globalAlpha = 0.3;
    this.fillRect("#00132d", this.currentPos.x, this.currentPos.y);
  }
}

export class PixelCanvas extends BaseCanvas {
  data: PixelRecord[] | null;

  constructor(canvas: HTMLCanvasElement, data: PixelRecord[] | null) {
    super(canvas);
    this.data = data;
  }

  private drawLines() {
    this.ctx.strokeStyle = "#F0F0F0";
    this.ctx.lineWidth = 1;

    [...Array(GRID_SIZE).keys()].forEach((i) => {
      const pos = i * PIXEL_SIZE;

      // Vertical line
      this.ctx.beginPath();
      this.ctx.moveTo(pos, 0);
      this.ctx.lineTo(pos, this.height);
      this.ctx.stroke();

      // Horizontal line
      this.ctx.beginPath();
      this.ctx.moveTo(0, pos);
      this.ctx.lineTo(this.width, pos);
      this.ctx.stroke();
    });
  }

  draw(): void {
    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.drawLines();

    if (!this.data) return;

    this.data.forEach((pixel) => {
      if (pixel.updatedBy !== "system")
        this.fillRect(pixel.color, pixel.x, pixel.y);
    });
  }
}
