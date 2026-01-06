import { useCanvasTool, useLogger, useCanvas } from "@/hooks";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { http } from "@/lib/http";
import type { PixelRequest } from "@/lib/types";
import { useState, useEffect } from "react";

const DEMO_USER_COLORS = [
  { username: "alice", color: "#f65356" },
  { username: "bob", color: "#a5de94" },
  { username: "charlie", color: "#6ec6ff" },
  { username: "david", color: "#ffd54f" },
  { username: "emma", color: "#ba68c8" },
  { username: "frank", color: "#ff8a65" },
  { username: "grace", color: "#4db6ac" },
  { username: "henry", color: "#9575cd" },
  { username: "isla", color: "#81c784" },
  { username: "jack", color: "#e57373" },
  { username: "kate", color: "#ff7043" },
  { username: "leo", color: "#26a69a" },
  { username: "mia", color: "#ab47bc" },
  { username: "noah", color: "#42a5f5" },
  { username: "olivia", color: "#ffca28" },
  { username: "liam", color: "#ff5722" },
  { username: "sophia", color: "#9c27b0" },
  { username: "jackson", color: "#3f51b5" },
  { username: "ava", color: "#009688" },
  { username: "aiden", color: "#cddc39" },
  { username: "isabella", color: "#ffeb3b" },
  { username: "lucas", color: "#ffc107" },
  { username: "harper", color: "#ff9800" },
  { username: "mason", color: "#795548" },
  { username: "evelyn", color: "#607d8b" },
  { username: "james", color: "#e91e63" },
  { username: "ella", color: "#2196f3" },
  { username: "ethan", color: "#4caf50" },
  { username: "emily", color: "#f44336" },
  { username: "alexander", color: "#673ab7" },
  { username: "scarlett", color: "#00bcd4" },
  { username: "benjamin", color: "#8bc34a" },
  { username: "chloe", color: "#ffeb3b" },
  { username: "jacob", color: "#ff5722" },
  { username: "lily", color: "#9c27b0" },
  { username: "sebastian", color: "#03a9f4" },
  { username: "zoey", color: "#8bc34a" },
  { username: "matthew", color: "#cddc39" },
  { username: "penelope", color: "#ff9800" },
  { username: "daniel", color: "#795548" },
  { username: "avery", color: "#607d8b" },
  { username: "michael", color: "#e91e63" },
  { username: "abigail", color: "#2196f3" },
  { username: "logan", color: "#4caf50" },
  { username: "amelia", color: "#f44336" },
  { username: "elijah", color: "#673ab7" },
  { username: "grace2", color: "#00bcd4" },
  { username: "oliver", color: "#8bc34a" },
  { username: "sophie", color: "#ffeb3b" },
  { username: "william", color: "#ff5722" },
];

const DemoTool = () => {
  const { addLog } = useLogger();
  const { currentMode } = useCanvasTool();
  const { selectedPos } = useCanvas();
  
  const [numRequests, setNumRequests] = useState<number>(50);
  const [targetX, setTargetX] = useState<number>(50);
  const [targetY, setTargetY] = useState<number>(50);

  // Tự động cập nhật X, Y khi user click vào canvas
  useEffect(() => {
    if (selectedPos) {
      setTargetX(selectedPos.x);
      setTargetY(selectedPos.y);
    }
  }, [selectedPos]);

  const handleSendRequests = async () => {
    const requestCount = Math.min(numRequests, DEMO_USER_COLORS.length);
    const requests = DEMO_USER_COLORS.slice(0, requestCount).map((userColor, i) => {
      const { username, color } = userColor;

      return http
        .post("/pixels/paint", {
          x: targetX,
          y: targetY,
          color,
          updatedBy: username,
          mode: currentMode,
        } as PixelRequest)
        .then(() => addLog("DEMO", `#${i + 1} painted ${color} as ${username}`))
        .catch((err) =>
          addLog("DEMO", `#${i + 1} failed (${err.response?.status ?? "ERR"})`)
        );
    });

    await Promise.allSettled(requests);
  };

  return (
    <section>
      <h1>Demo Tools</h1>

      <div className="space-y-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm text-muted-foreground">Number of Requests</label>
          <Input
            type="number"
            min={1}
            max={50}
            value={numRequests}
            onChange={(e) => setNumRequests(Math.max(1, parseInt(e.target.value) || 1))}
            placeholder="Enter number (1-50)"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground">X Coordinate</label>
            <Input
              type="number"
              min={0}
              max={99}
              value={targetX}
              onChange={(e) => setTargetX(Math.max(0, Math.min(99, parseInt(e.target.value) || 0)))}
              placeholder="X (0-99)"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm text-muted-foreground">Y Coordinate</label>
            <Input
              type="number"
              min={0}
              max={99}
              value={targetY}
              onChange={(e) => setTargetY(Math.max(0, Math.min(99, parseInt(e.target.value) || 0)))}
              placeholder="Y (0-99)"
            />
          </div>
        </div>

        <Button
          variant={"destructive"}
          className="w-full rounded cursor-pointer"
          onClick={handleSendRequests}
        >
          Send Request
        </Button>
      </div>
    </section>
  );
};

export default DemoTool;
