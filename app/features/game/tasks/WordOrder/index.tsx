import type { Task } from "@/lib/types/task";

type WordOrderTaskProps = {
  task: Task;
};

export default function WordOrderTask({
  task,
}: WordOrderTaskProps) {
  return (
    <div>
      <h2>Word Order</h2>

      <p>{task.verses?.text}</p>

      <pre>{JSON.stringify(task, null, 2)}</pre>
    </div>
  );
}