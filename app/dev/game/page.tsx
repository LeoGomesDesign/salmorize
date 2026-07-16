"use client";

import { useState } from "react";

import { getUserProgress } from "@/lib/supabase/game/getUserProgress";
import { getCurrentTask } from "@/lib/supabase/game/getCurrentTask";
import { getNextTask } from "@/lib/supabase/game/getNextTask";
import { completeTask } from "@/lib/supabase/game/completeTask";

export default function GameDevPage() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<any>(null);
  const [task, setTask] = useState<any>(null);
  const [progressId, setProgressId] = useState<number | null>(null);

  async function loadGame() {
    setLoading(true);

    try {
      const progressData = await getUserProgress(1);

      setProgress(progressData);

      setProgressId(progressData.id);

      const taskData = await getCurrentTask(
        progressData.current_task_id
      );

      const nextTask = await getNextTask(
        progressData.current_task_id
      );

      console.log("Próxima Task:", nextTask);

      setTask(taskData);

      const result = await completeTask(
        progressData.id,
        progressData.current_task_id
        );

        console.log(result);

    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  async function handleCompleteTask() {
    if (!progressId || !task) return;
    await completeTask(
    progressId,
    task.id
    );

    const updatedProgress = await getUserProgress(1);

    const updatedTask = await getCurrentTask(
    updatedProgress.current_task_id
    );

    setProgress(updatedProgress);
    setTask(updatedTask);
  }

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: 24,
      }}
    >
      <h1>Game Dev</h1>

      <button onClick={loadGame}
       className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Carregar Salmo 1
      </button>

      {loading && <p>Carregando...</p>}

      <h2>Progress</h2>

      {task && (
        <div>

        <h2>{task.type.toUpperCase()}</h2>

        <p
            style={{
            fontSize: 24,
            marginTop: 24
            }}
        >
        {task.verses?.text}
        </p>

        <button
        onClick={handleCompleteTask}
        className="p-2 mt-4 bg-blue-600 text-white"
        >
        Concluir Task
        </button>

        </div>
    )}

      <h2>Task Atual</h2>

      <pre>
        {JSON.stringify(task, null, 2)}
      </pre>
    </main>
  );
}