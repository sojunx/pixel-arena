import { Swords } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth, useWebSocket } from "@/hooks";

const Navbar = () => {
  const { currentUsername } = useAuth();
  const { connected } = useWebSocket();

  const username = currentUsername || "Guest";

  return (
    <nav className="h-16 border-b flex items-center justify-between px-6">
      <section className="flex items-center gap-2">
        <Swords />
        <h1 className="text-xl font-semibold font-mono">Pixel Arena</h1>
      </section>

      <section className="flex items-center gap-2 font-mono border px-2 py-1.5 pr-3.5 rounded-full">
        <Avatar className="outline">
          <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="text-xs">
          <h1 className="font-semibold truncate max-w-20">{username}</h1>
          <p className="text-muted-foreground">
            {connected ? "Connected" : "Disconnected"}
          </p>
        </div>
      </section>
    </nav>
  );
};

export default Navbar;
