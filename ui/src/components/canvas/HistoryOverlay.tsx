import { useCanvas } from "@/hooks/useCanvas";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

const HistoryOverlay = () => {
  // TODO: Delete pin if close history
  // TODO: Add more information from backend
  const { hoveredPos } = useCanvas();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const setState = () => setOpen(true);

    setState();
  }, [hoveredPos]);

  const isVisible = Boolean(hoveredPos) && open;

  if (!isVisible || !hoveredPos) return null;

  return (
    <div id="pixel-history" className="space-y-3">
      <h1>
        PIXEL | X: {hoveredPos.x} | Y: {hoveredPos.y}
      </h1>

      <Button
        onClick={() => setOpen(false)}
        variant="secondary"
        size="sm"
        className="w-full rounded cursor-pointer"
      >
        Close
      </Button>
    </div>
  );
};

export default HistoryOverlay;
