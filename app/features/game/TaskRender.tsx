import type { Task } from "@/lib/types/task";

import WordOrderTask from "./tasks/WordOrderTask";
import TypingTask from "./tasks/TypingTask";
import SpeakingTask from "./tasks/SpeakingTask";
import RecapTask from "./tasks/RecapTask";

type TaskRendererProps = {
  task: Task;
  onCompleted: () => void;
};

export default function TaskRenderer({
  task,
  onCompleted,
}: TaskRendererProps) {
  
   switch (task.type) {
    case "word_order":
     return (
     <WordOrderTask  
      task={task}
      onCompleted={onCompleted}
    />
  );

  case "typing":
    return (
    <TypingTask  
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
    />
  );

  default:
    return <p>Tipo de task desconhecido.</p>;
  }
  
}