import { useCanvas, useWebSocket } from "@/hooks";
import { PixelCanvas } from "@/lib/canvas";
import { useEffect, useRef } from "react";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // TODO: Add processing toast
  const { data } = useCanvas();
  const { message } = useWebSocket();

  useEffect(() => {
    const canvas = new PixelCanvas(canvasRef.current!, data);

    canvas.init();
    canvas.draw();
  }, [data]);

  useEffect(() => {
    const canvas = new PixelCanvas(canvasRef.current!, null);

    if (message) canvas.fillRect(message.color, message.x, message.y);
  }, [message]);

  return (
    <canvas
      ref={canvasRef}
      id="canvas"
      className="w-full h-full"
      aria-label="Pixel canvas"
    />
  );
};

export default Canvas;
