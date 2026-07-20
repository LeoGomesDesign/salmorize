import { createClient } from "@/lib/supabase/client";
import { getNextTask } from "./getNextTask";

export async function completeTask(
  progressId: number,
  currentTaskId: number
) {
  const supabase = createClient();

  // Busca informações da task atual
  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select("star_reward, xp_reward")
    .eq("id", currentTaskId)
    .single();

  if (taskError) {
    throw taskError;
  }

  // Descobre a próxima task
  const nextTask = await getNextTask(currentTaskId);

  // Se não existir próxima task, o Salmo terminou
  if (!nextTask) {
    const { error } = await supabase
      .from("user_progress")
      .update({
        completed: true,
      })
      .eq("id", progressId);

    if (error) throw error;

    return {
    completed: true,
    nextTaskId: null,
    };
  }

  // Busca progresso atual
  const { data: progress, error: progressError } = await supabase
    .from("user_progress")
    .select("stars, xp")
    .eq("id", progressId)
    .single();
   if (progressError) {
    throw progressError;
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
};  
}