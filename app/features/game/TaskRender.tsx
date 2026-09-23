import type { Task } from "@/lib/types/task";

import WordOrderTask from "./tasks/WordOrderTask";
import SpeakingTask from "./tasks/SpeakingTask";
import RecapTask from "./tasks/RecapTask";

type TaskRendererProps = {
  task: Task;
  onCompleted: () => Promise<void>;
  sessionTime: () => string;
  stanzaNumber: number;
  psalmNumber: number;
  isPsalmComplete: boolean;
};

export default function TaskRenderer({
  task,
  onCompleted,
  sessionTime,
  stanzaNumber,
  psalmNumber,
  isPsalmComplete,
}: TaskRendererProps) {
  switch (task.type) {
    case "word_order":
      return (
        <WordOrderTask
          task={task}
          onCompleted={onCompleted}
        />
      );

    case "speaking":
      return (
        <SpeakingTask
          task={task}
          onCompleted={onCompleted}
        />
      );

    case "recap":
      return (
        <RecapTask
          task={task}
          onCompleted={onCompleted}
          sessionTime={sessionTime}
          stanzaNumber={stanzaNumber}
          psalmNumber={psalmNumber}
          isPsalmComplete={isPsalmComplete}
        />
      );

    default:
      return <p>Tipo de task desconhecido.</p>;
  }
}