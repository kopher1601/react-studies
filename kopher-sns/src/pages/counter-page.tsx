import Viewer from "@/components/counter/viewer.tsx";
import Controller from "@/components/counter/controller.tsx";

export default function CounterPage() {
  return (
    <div>
      <h1>Counter</h1>
      <Viewer />
      <Controller />
    </div>
  );
}
