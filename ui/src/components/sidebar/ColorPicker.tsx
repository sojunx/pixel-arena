import { COLORS_PALETTE } from "@/lib/constants";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useAuth, useCanvas, useCanvasTool } from "@/hooks";
import type { AppError, PixelUpdateMessage } from "@/lib/types";
import { toast } from "sonner";

const ColorPicker = () => {
  const { selectedPos } = useCanvas();
  const { currentUsername } = useAuth();
  const { currentColor, changeColor, handlePaint } = useCanvasTool();

  return (
    <section>
      <div className="flex justify-between items-center">
        <h1>Color Picker</h1>
        <div className="bg-secondary outline px-2 py-1.5 rounded text-center font-medium text-sm">
          {currentColor.value.toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-5 grid-rows-2 gap-3">
        {COLORS_PALETTE.map((color) => {
          const isActive = currentColor.value === color.value;

          return (
            <div
              onClick={() => changeColor(color)}
              key={color.label + color.value}
              className={cn(
                "size-10 cursor-pointer rounded",
                "ring-2 ring-transparent transition",
                isActive && "ring-accent-foreground scale-105"
              )}
              style={{ backgroundColor: color.value }}
            />
          );
        })}
      </div>

      <Button
        className="w-full rounded cursor-pointer"
        disabled={!selectedPos || !currentUsername}
        onClick={() => {
          if (selectedPos)
            toast.promise<PixelUpdateMessage>(handlePaint(selectedPos), {
              loading: "Processing...",
              success: (data) => {
                const res = data as PixelUpdateMessage;

                return `Success - ${res.x} | ${res.y}`;
              },
              error: (data) => {
                const res = data as AppError;

                return `${res.message}`;
              },
            });
        }}
      >
        Paint
      </Button>
    </section>
  );
};

export default ColorPicker;
