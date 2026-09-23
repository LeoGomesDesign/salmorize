"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { getUserProgress } from "@/lib/supabase/game/getUserProgress";
import {
  getCurrentTask,
  type CurrentTask,
} from "@/lib/supabase/game/getCurrentTask";
import { getNextTask } from "@/lib/supabase/game/getNextTask";

import TaskRender from "./TaskRender";
import { completeTask } from "@/lib/supabase/game/completeTask";

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

type PrefetchedTask = {
  data: {
    id: number;
    stanza_id: number;
  } | null;
  task: CurrentTask | null;
};

export default function GamePlayer({
  psalmNumber,
}: GamePlayerProps) {
  const router = useRouter();

  const [progress, setProgress] =
    useState<UserProgress | null>(null);

  const [task, setTask] =
    useState<CurrentTask | null>(null);

  const nextTaskPromiseRef =
    useRef<Promise<PrefetchedTask> | null>(null);

  // Início da sessão do Salmo
  const sessionStartTimeRef = useRef<number>(Date.now());

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
  }, [psalmNumber]);

  // Prefetch da próxima task
  useEffect(() => {
    if (!task) return;

    nextTaskPromiseRef.current = (async () => {
      const data = await getNextTask(
        task.psalm_id,
        task.global_order
      );

      if (!data) {
        return {
          data: null,
          task: null,
        };
      }

      const nextTask = await getCurrentTask(data.id);

      return {
        data,
        task: nextTask,
      };
    })();

    return () => {
      nextTaskPromiseRef.current = null;
    };
  }, [task]);

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

    const prefetched =
      await nextTaskPromiseRef.current;

    const result = await completeTask(
      progress.id,
      task.id,
      progress.user_id,
      prefetched?.data ?? null
    );

    if (result.completed) {
      router.push("/home");
      return;
    }

    const nextTask = prefetched?.task;

    if (!nextTask) {
      throw new Error("Próxima task não encontrada.");
    }

    nextTaskPromiseRef.current = null;

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