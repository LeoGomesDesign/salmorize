"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { getUserProgress } from "@/lib/supabase/game/getUserProgress";
import { getCurrentTask } from "@/lib/supabase/game/getCurrentTask";

import TaskRender from "./TaskRender";
import { completeTask } from "@/app/actions/completeTask";
import type { Task } from "@/lib/types/task";

import TaskLoading from "./components/loading/TaskLoading";

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
};

export default function GamePlayer({
  psalmNumber,
}: GamePlayerProps) {
  const router = useRouter();

  const [progress, setProgress] =
    useState<UserProgress | null>(null);

  const [task, setTask] =
    useState<Task | null>(null);

  // Início da sessão do Salmo
  const sessionStartTimeRef = useRef<number>(0);

  useEffect(() => {
    async function load() {
      sessionStartTimeRef.current = Date.now();

      const progress = await getUserProgress(psalmNumber);

      setProgress(progress);

      const task = await getCurrentTask(
        progress.current_task_id
      );

      setTask(task);
    }

    load();
  }, [psalmNumber]);

  // Calcula o tempo total desde o início do Salmo
  function getSessionTime(): string {
    const elapsedSeconds = Math.floor(
      (Date.now() - sessionStartTimeRef.current) / 1000
    );

    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }

  if (!progress || !task) {
    return <TaskLoading />;
  }

  async function handleTaskCompleted() {
    if (!progress || !task) return;

    const result = await completeTask({
      progressId: progress.id,
      currentTaskId: task.id,
    });

    if (result.completed) {
      router.push("/home");
      return;
    }

    const nextTask = await getCurrentTask(result.nextTaskId!);

    if (!nextTask) {
      throw new Error("Próxima task não encontrada.");
    }

    setTask(nextTask);

    setProgress({
      ...progress,
      current_task_id: result.nextTaskId!,
    });
  }

  return (
    <main>
      <TaskRender
        task={{
          ...task,
        }}
        onCompleted={handleTaskCompleted}
        sessionTime={getSessionTime}
        stanzaNumber={task.stanza_position}
        psalmNumber={task.psalm_number}
        isPsalmComplete={
          task.stanza_position === task.psalm_stanzas
        }

      />
    </main>
  );
}