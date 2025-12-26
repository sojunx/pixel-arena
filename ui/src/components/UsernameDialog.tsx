import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { useAuth } from "@/hooks";

const UsernameDialog = () => {
  const { currentUsername, handleSubmit } = useAuth();
  const [username, setUsername] = useState<string>("");

  return (
    <Dialog open={!currentUsername}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How can I call you?</DialogTitle>
          <DialogDescription>Please enter your username</DialogDescription>
        </DialogHeader>
        <Input
          id="username"
          name="username"
          placeholder="jack, peter, alice,..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              className="w-full"
              onClick={() => handleSubmit(username)}
            >
              Submit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UsernameDialog;
