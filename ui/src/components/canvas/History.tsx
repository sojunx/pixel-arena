import { useCanvas } from "@/hooks";
import { http } from "@/lib/http";
import type { PixelHistory } from "@/lib/types";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MapPin, X } from "lucide-react";
import { Button } from "../ui/button";

const History = () => {
  const { selectedPos, clearSelected } = useCanvas();
  const [history, setHistory] = useState<PixelHistory | null>(null);

  useEffect(() => {
    if (!selectedPos) return;

    const getData = async () => {
      const res = await http.get<PixelHistory[]>(
        `/pixels/history/${selectedPos.x}/${selectedPos.y}`
      );

      const latest =
        res.data
          .filter((h) => h.oldColor !== h.newColor)
          .sort(
            (a, b) =>
              new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
          )[0] ?? null;

      setHistory(latest);
    };

    getData();
  }, [selectedPos]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: selectedPos ? 1 : 0 }}
        exit={{ opacity: 0 }}
        className="shadow-xl absolute bottom-5 left-1/2 -translate-x-1/2 w-72 bg-white outline px-3 py-2 rounded-md z-50"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-medium flex items-center gap-1">
            <MapPin size={20} />
            Pixel: {selectedPos?.x}, {selectedPos?.y}
          </h1>

          <Button
            size={"icon-sm"}
            variant={"ghost"}
            className="rounded-full top-2 right-3 cursor-pointer"
            onClick={clearSelected}
          >
            <X size={16} />
          </Button>
        </div>

        {!history && (
          <div className="text-muted-foreground text-sm font-medium">
            Not painted
          </div>
        )}

        {history && (
          <div className="text-muted-foreground text-sm font-medium">
            <p>Paint by: {history.changedBy}</p>
            <p>Color: {history.newColor.toUpperCase()}</p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default History;
