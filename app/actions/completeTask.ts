"use server";

import { createClient } from "@/lib/supabase/server";

import { getNextTask } from "@/lib/supabase/game/getNextTask";

export async function completeTask({
  progressId,
  currentTaskId,
}: {
  progressId: number;
  currentTaskId: number;
}): Promise<{
  completed: boolean;
  nextTaskId: number | null;
  sessionCompleted: boolean;
}> {
  const supabase = await createClient();

  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select(`
      star_reward,
      xp_reward,
      stanza_id,
      psalm_id,
      global_order
    `)
    .eq("id", currentTaskId)
    .single();

  if (taskError) {
    throw taskError;
  }

  if (!task) {
    throw new Error("Task não encontrada.");
  }

  const { data: progress, error: progressError } = await supabase
    .from("user_progress")
    .select("stars, xp")
    .eq("id", progressId)
    .single();

  if (progressError) {
    throw progressError;
  }

  if (!progress) {
    throw new Error("Progresso não encontrado.");
  }

  const nextTask = await getNextTask(
    supabase,
    task.psalm_id,
    task.global_order
  );

  const newStars = progress.stars + task.star_reward;
  const newXp = progress.xp + task.xp_reward;

  const progressUpdate = supabase
    .from("user_progress")
    .update(
      nextTask
        ? {
            current_task_id: nextTask.id,
            stars: newStars,
            xp: newXp,
          }
        : {
            completed: true,
            stars: newStars,
            xp: newXp,
          }
    )
    .eq("id", progressId);

  const { error: progressUpdateError } = await progressUpdate;

  if (progressUpdateError) {
    throw progressUpdateError;
  }

  if (!nextTask) {
    return {
      completed: true,
      nextTaskId: null,
      sessionCompleted: true,
    };
  }

  return {
    completed: false,
    nextTaskId: nextTask.id,
    sessionCompleted: nextTask.stanza_id !== task.stanza_id,
  };
}
