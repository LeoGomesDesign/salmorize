type TaskRendererProps = {
  task: any;
};

export default function TaskRenderer({
  task,
}: TaskRendererProps) {
  return (
    <div>
      <h2>{task.type.toUpperCase()}</h2>

      <p
        style={{
          fontSize: 24,
          marginTop: 24,
        }}
      >
        {task.verses?.text}
      </p>
    </div>
  );
}