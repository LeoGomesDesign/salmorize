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

  if (!progress || !task) {
    return <p>Carregando...</p>;
  }

  async function handleTaskCompleted() {
    if (!progress || !task) return;

    const prefetched = await nextTaskPromiseRef.current;

    const result = await completeTask(
      progress.id,
      task.id,
      progress.user_id,
      prefetched?.data ?? null
    );

    if (result.completed || result.sessionCompleted) {
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