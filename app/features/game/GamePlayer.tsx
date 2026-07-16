"use client";

import { useEffect, useState } from "react";

import { getUserProgress } from "@/lib/supabase/game/getUserProgress";
import { getCurrentTask } from "@/lib/supabase/game/getCurrentTask";
import TaskRender from "./TaskRender";
import type { Task } from "@/lib/types/task";

type GamePlayerProps = {
  psalmNumber: number;
};

export default function GamePlayer({
  psalmNumber,
}: GamePlayerProps) {
    type UserProgress = {
      current_task_id: number;
    }  
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
  return (
    <main>
      <h1>Game Player</h1>

      <pre>
        {JSON.stringify(progress, null, 2)}
      </pre>

      <TaskRender task={task} />
    </main>
  );
}