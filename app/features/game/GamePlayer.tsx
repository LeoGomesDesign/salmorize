"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getUserProgress } from "@/lib/supabase/game/getUserProgress";
import {
  getCurrentTask,
  type CurrentTask,
} from "@/lib/supabase/game/getCurrentTask";

import TaskRender from "./TaskRender";
import { completeTask } from "@/lib/supabase/game/completeTask";

type GamePlayerProps = {
  psalmNumber: number;
};

type UserProgress = {
  id: number;
  user_id: string;

  current_task_id: number;

  stars: number;
  xp: number;
  completed: boolean;

  battery: number;
  max_battery: number;
};

export default function GamePlayer({
  psalmNumber,
}: GamePlayerProps) {
  const router = useRouter();

  const [progress, setProgress] =
    useState<UserProgress | null>(null);

  const [task, setTask] =
    useState<CurrentTask | null>(null);

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
    task.id,
    progress.user_id
  );

  if (result.completed || result.sessionCompleted) {
    router.push("/home");
    return;
  }

  const nextTask = await getCurrentTask(result.nextTaskId!);

  setTask(nextTask);

  setProgress({
    ...progress,
    current_task_id: result.nextTaskId!,
    battery: result.battery,
  });
 }

  return (
    <main>
      <TaskRender 
       task={{
        ...task,
        battery: progress.battery,
        max_battery: progress.max_battery,
      }}
       onCompleted={handleTaskCompleted}
      />
    </main>
  );
}