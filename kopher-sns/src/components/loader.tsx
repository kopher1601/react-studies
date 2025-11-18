import { LoaderCircleIcon } from "lucide-react";

export default function Loader() {
  return (
    <div className="text-muted-foreground flex flex-col items-center justify-center gap-2">
      <LoaderCircleIcon />
      <div className="text-sm">Loading...</div>
    </div>
  );
}
