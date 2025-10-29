import { useCount } from "@/store/count.ts";

export default function Viewer() {
  const count = useCount();
  return <div>{count}</div>;
}
