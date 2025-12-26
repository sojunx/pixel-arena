import { useCanvas } from "@/hooks";
import { OverlayCanvas } from "@/lib/canvas";
import { useEffect, useRef } from "react";

const PinCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { selectedPos } = useCanvas();

  useEffect(() => {
    const canvas = new OverlayCanvas(canvasRef.current!, null);

    canvas.init();
  }, []);

  useEffect(() => {
    const canvas = new OverlayCanvas(canvasRef.current!, selectedPos);

    canvas.draw();
  }, [selectedPos]);

  return (
    <canvas
      className="absolute top-0 left-0 w-full h-full"
      ref={canvasRef}
      id="sub-canvas"
      aria-label="Canvas overlay for pixel selection"
    />
  );
};

export default PinCanvas;
