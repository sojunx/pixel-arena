import { useCanvas } from "@/hooks";
import { OverlayCanvas } from "@/lib/canvas";
import { useEffect, useRef } from "react";

const HoverCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<OverlayCanvas>(null);
  const { hoveredPos, onMouseMove, onMouseLeave, onMouseClick } = useCanvas();

  useEffect(() => {
    const canvas = new OverlayCanvas(canvasRef.current!, null);

    canvas.init();
    overlayRef.current = canvas;
  }, []);

  useEffect(() => {
    const canvas = new OverlayCanvas(canvasRef.current!, hoveredPos);

    canvas.draw();
  }, [hoveredPos]);

  return (
    <canvas
      className="absolute top-0 left-0 w-full h-full pointer-events-auto"
      ref={canvasRef}
      id="sub-canvas"
      onClick={(e) => onMouseClick(e, overlayRef)}
      onMouseMove={(e) => onMouseMove(e, overlayRef)}
      onMouseLeave={onMouseLeave}
      aria-label="Canvas overlay for pixel selection"
    />
  );
};

export default HoverCanvas;
