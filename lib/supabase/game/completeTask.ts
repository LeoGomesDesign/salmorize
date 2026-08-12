import { createClient } from "@/lib/supabase/client";
import { getNextTask } from "./getNextTask";

export async function completeTask(
  progressId: number,
  currentTaskId: number,
  userId: string
) {
  const supabase = createClient();

  // ─────────────────────────────────────────────
  // 1. Busca informações da task atual
  // ─────────────────────────────────────────────
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select(`
      star_reward,
      xp_reward,
      battery_cost,
      stanza_id
    `)
    .eq("id", currentTaskId)
    .single();

  if (taskError) {
    throw taskError;
  }

  // ─────────────────────────────────────────────
  // 2. Busca a energia atual do usuário
  // ─────────────────────────────────────────────
  const { data: userStats, error: userStatsError } = await supabase
    .from("user_stats")
    .select("battery")
    .eq("id", userId)
    .single();

  if (userStatsError) {
    throw userStatsError;
  }

  // ─────────────────────────────────────────────
  // 3. Calcula a próxima task
  // ─────────────────────────────────────────────
  const nextTask = await getNextTask(currentTaskId);

  // ─────────────────────────────────────────────
  // 4. Busca o progresso atual
  // ─────────────────────────────────────────────
  const { data: progress, error: progressError } = await supabase
    .from("user_progress")
    .select("stars, xp")
    .eq("id", progressId)
    .single();

  if (progressError) {
    throw progressError;
  }

  // ─────────────────────────────────────────────
  // 5. Calcula a nova energia
  //    Isso precisa acontecer ANTES de qualquer return
  // ─────────────────────────────────────────────
  const newBattery = Math.max(
    0,
    userStats.battery - task.battery_cost
  );

  // ─────────────────────────────────────────────
  // 6. Atualiza a energia do usuário
  // ─────────────────────────────────────────────
  const { error: batteryError } = await supabase
    .from("user_stats")
    .update({
      battery: newBattery,
    })
    .eq("id", userId);

  if (batteryError) {
    throw batteryError;
  }

  // ─────────────────────────────────────────────
  // 7. Se não existe próxima task, o Salmo terminou
  // ─────────────────────────────────────────────
  if (!nextTask) {
    const { error } = await supabase
      .from("user_progress")
      .update({
        completed: true,
        stars: progress.stars + task.star_reward,
        xp: progress.xp + task.xp_reward,
      })
      .eq("id", progressId);

    if (error) {
      throw error;
    }

    return {
      completed: true,
      nextTaskId: null,
      sessionCompleted: true,
      battery: newBattery,
    };
  }

  // ─────────────────────────────────────────────
  // 8. Verifica se mudou de stanza
  // ─────────────────────────────────────────────
  const sessionCompleted =
    nextTask.stanza_id !== task.stanza_id;

  // ─────────────────────────────────────────────
  // 9. Atualiza o progresso para a próxima task
  // ─────────────────────────────────────────────
  const { error } = await supabase
    .from("user_progress")
    .update({
      current_task_id: nextTask.id,
      stars: progress.stars + task.star_reward,
      xp: progress.xp + task.xp_reward,
    })
    .eq("id", progressId);

  if (error) {
    throw error;
  }

  // ─────────────────────────────────────────────
  // 10. Retorna resultado
  // ─────────────────────────────────────────────
  return {
    completed: false,
    nextTaskId: nextTask.id,
    sessionCompleted,
    battery: newBattery,
  };
}