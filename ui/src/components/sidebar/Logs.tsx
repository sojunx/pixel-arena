import { Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useLogger } from "@/hooks";
import { useEffect, useRef } from "react";

const Logs = () => {
  const { logs, clearLog } = useLogger();
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({
      top: logRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [logs]);

  return (
    <section className="flex flex-col flex-1 min-h-0">
      <div className="w-full flex justify-between items-center">
        <h1>Logs</h1>
        <Button
          size={"sm"}
          className="rounded cursor-pointer"
          variant={"ghost"}
          onClick={clearLog}
        >
          <Trash />
          Clear
        </Button>
      </div>

      <div
        ref={logRef}
        className="flex-1 text-sm text-muted-foreground font-semibold overflow-y-auto space-y-1 p-1 scrollbar-none bg-neutral-100 outline"
      >
        {logs.map((log, i) => (
          <p key={i}>{log}</p>
        ))}

        {logs.length === 0 && (
          <div className="w-full h-full flex items-center justify-center">
            <h1 className="text-muted-foreground">Logs are clean</h1>
          </div>
        )}
      </div>
    </section>
  );
};

export default Logs;
