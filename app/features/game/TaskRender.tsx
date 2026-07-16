import type { Task } from "@/lib/types/task";
import WordOrderTask from "./tasks/WordOrder";
import TypingTask from "./tasks/TypingTask";
import SpeakingTask from "./tasks/SpeakingTask";
import RecapTask from "./tasks/RecapTask";

type TaskRendererProps = {
  task: Task;
};

export default function TaskRenderer({
  task,
}: TaskRendererProps) {
  
   switch (task.type) {
  case "word_order":
    return <WordOrderTask  task={task} />;

  case "typing":
    return <TypingTask  task={task} />;

  case "speaking":
    return <SpeakingTask  task={task} />;

  case "recap":
    return <RecapTask  task={task} />;

  default:
    return <p>Tipo de task desconhecido.</p>;
  }
  
}