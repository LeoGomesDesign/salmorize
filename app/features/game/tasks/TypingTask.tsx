interface Props {
  task: any;
}

export default function TypingTask({ task }: Props) {
  return (
    <div>
      <h2>Typing Task</h2>

      <p>{task.verses.text}</p>
    </div>
  );
}