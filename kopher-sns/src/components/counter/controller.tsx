import { Button } from "@/components/ui/button.tsx";
import { useDecrementCount, useIncrementCount } from "@/store/count.ts";

export default function Controller() {
  const increment = useIncrementCount();
  const decrement = useDecrementCount();

  return (
    <div>
      <Button onClick={increment}>+</Button>
      <Button onClick={decrement}>-</Button>
    </div>
  );
}
