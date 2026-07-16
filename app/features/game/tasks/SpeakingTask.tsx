interface Props {
  task: any;
}

export default function SpeakingTask({ task }: Props) {
  return (
    <div>
      <h2>Speaking Task</h2>

      <p>{task.verses.text}</p>
    </div>
  );
}