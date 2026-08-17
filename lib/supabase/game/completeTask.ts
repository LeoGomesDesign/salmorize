import { createClient } from "@/lib/supabase/client";

export async function completeTask(
  progressId: number,
  currentTaskId: number,
  userId: string
) {
  const supabase = createClient();

  // 1. Busca informações da task atual
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select(`
      star_reward,
      xp_reward,
      battery_cost,
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

  // 2. Busca dados independentes em paralelo
  const [
    { data: userStats, error: userStatsError },
    { data: progress, error: progressError },
  ] = await Promise.all([
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

  if (userStatsError) {
    throw userStatsError;
  }

  if (progressError) {
    throw progressError;
  }

  // 3. Busca próxima task
  const { data: nextTask, error: nextTaskError } = await supabase
    .from("tasks")
    .select(`
      id,
      stanza_id
    `)
    .eq("psalm_id", task.psalm_id)
    .eq("global_order", task.global_order + 1)
    .maybeSingle();

  if (nextTaskError) {
    throw nextTaskError;
  }

  // 4. Calcula novos valores
  const newBattery = Math.max(
    0,
    userStats.battery - task.battery_cost
  );

  const newStars = progress.stars + task.star_reward;
  const newXp = progress.xp + task.xp_reward;

  // 5. Atualiza tudo que for possível em paralelo
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

  // 6. Resultado
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