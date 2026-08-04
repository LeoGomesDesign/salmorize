import { createClient } from "@/lib/supabase/client";
import { getNextTask } from "./getNextTask";

export async function completeTask(
  progressId: number,
  currentTaskId: number,
  userId: string
) {
  const supabase = createClient();

  // Busca informações da task atual
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
const { data: userStats, error: userStatsError } = await supabase
  .from("user_stats")
  .select("battery")
  .eq("id", userId)
  .single();

if (userStatsError) {
  throw userStatsError;
}

  // Descobre a próxima task
  const nextTask = await getNextTask(currentTaskId);

  // Busca progresso atual
  const { data: progress, error: progressError } = await supabase
    .from("user_progress")
    .select("stars, xp")
    .eq("id", progressId)
    .single();
   if (progressError) {
    throw progressError;
  } 

  // Se não existir próxima task, o Salmo terminou
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

  const sessionCompleted =
  nextTask.stanza_id !== task.stanza_id;

const newBattery = Math.max(
  0,
  userStats.battery - task.battery_cost
);

const { error: batteryError } = await supabase
  .from("user_stats")
  .update({
    battery: newBattery,
  })
  .eq("id", userId);

if (batteryError) {
  throw batteryError;
}  

  

  // Atualiza progresso
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

  return {
    completed: false,
    nextTaskId: nextTask.id,
    sessionCompleted,
    battery: newBattery,
  };  
}