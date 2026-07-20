"use client";

import { useEffect, useState } from "react";

import { getUserProgress } from "@/lib/supabase/game/getUserProgress";
import { getCurrentTask } from "@/lib/supabase/game/getCurrentTask";
import TaskRender from "./TaskRender";
import type { Task } from "@/lib/types/task";
import { completeTask } from "@/lib/supabase/game/completeTask";

type GamePlayerProps = {
  psalmNumber: number;
};
type UserProgress = {
  id: number;
  current_task_id: number;
  stars: number;
  xp: number;
  completed: boolean;
}; 

export default function GamePlayer({
  psalmNumber,
}: GamePlayerProps) {
    
    const [progress, setProgress] =
    useState<UserProgress | null>(null);
    const [task, setTask] = useState<Task | null>(null);

    useEffect(() => {
        async function load() {
            const progress = await getUserProgress(psalmNumber);

            setProgress(progress);

            const task = await getCurrentTask(
            progress.current_task_id
        );

            setTask(task);
        }

        load();
    },[psalmNumber]);

    if (!progress || !task) {
        return <p>Carregando...</p>
    }
  
 async function handleTaskCompleted() {
  if (!progress || !task) return;

  const result = await completeTask(
    progress.id,
    task.id
  );

  if (result.completed) {
  console.log("Salmo concluído!");
  return;
}

  const nextTask = await getCurrentTask(result.nextTaskId!);

  setTask(nextTask);

  setProgress({
    ...progress,
    current_task_id: result.nextTaskId!,
  });
}

  return (
    <main>
      <h1>Game Player</h1>

      <pre>
        {JSON.stringify(progress, null, 2)}
      </pre>

      <TaskRender 
       task={task}
       onCompleted={handleTaskCompleted}
      />
    </main>
  );
}