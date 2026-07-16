interface Props {
  task: any;
}

export default function RecapTask({ task }: Props) {
  return (
    <div>
      <h2>Recap Task</h2>

      <pre>
        {JSON.stringify(task.recap_verses, null, 2)}
      </pre>
    </div>
  );
}