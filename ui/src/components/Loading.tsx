import { Spinner } from "@/components/ui/spinner";

const Loading = () => {
  return (
    <div className="flex min-h-svh items-center justify-center gap-2 select-none">
      <Spinner className="size-6" />
      <span className="font-mono text-lg font-medium">Loading...</span>
    </div>
  );
};

export default Loading;
