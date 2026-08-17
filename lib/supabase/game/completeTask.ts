import { createClient } from "@/lib/supabase/client";

type NextTaskData = {
  id: number;
  stanza_id: number;
} | null;

export async function completeTask(
  progressId: number,
  currentTaskId: number,
  userId: string,
  nextTask: NextTaskData
) {
  const supabase = createClient();

  // Busca todos os dados necessários em paralelo
  const [
    { data: task, error: taskError },
    { data: userStats, error: userStatsError },
    { data: progress, error: progressError },
  ] = await Promise.all([
    supabase
      .from("tasks")
      .select(`
        star_reward,
        xp_reward,
        battery_cost,
        stanza_id
      `)
      .eq("id", currentTaskId)
      .single(),

    supabase
      .from("user_stats")
      .select("battery")
      .eq("id", userId)
      .single(),

    supabase
      .from("user_progress")
      .select("stars, xp")
      .eq("id", progressId)
      .single(),
  ]);

  if (taskError) {
    throw taskError;
  }

  if (userStatsError) {
    throw userStatsError;
  }

  if (progressError) {
    throw progressError;
  }

  if (!task) {
    throw new Error("Task não encontrada.");
  }

  const newBattery = Math.max(
    0,
    userStats.battery - task.battery_cost
  );

  const newStars = progress.stars + task.star_reward;
  const newXp = progress.xp + task.xp_reward;

  const batteryUpdate = supabase
    .from("user_stats")
    .update({
      battery: newBattery,
    })
    .eq("id", userId);

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

  const [
    { error: batteryError },
    { error: progressUpdateError },
  ] = await Promise.all([
    batteryUpdate,
    progressUpdate,
  ]);

  if (batteryError) {
    throw batteryError;
  }

  if (progressUpdateError) {
    throw progressUpdateError;
  }

  if (!nextTask) {
    return {
      completed: true,
      nextTaskId: null,
      sessionCompleted: true,
      battery: newBattery,
    };
  }

  return {
    completed: false,
    nextTaskId: nextTask.id,
    sessionCompleted: nextTask.stanza_id !== task.stanza_id,
    battery: newBattery,
  };
}