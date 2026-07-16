import { createClient } from "@/lib/supabase/client";

export async function getNextTask(currentTaskId: number) {
  const supabase = createClient();

  // Busca a task atual
  const { data: currentTask, error: currentTaskError } = await supabase
    .from("tasks")
    .select("psalm_id, global_order")
    .eq("id", currentTaskId)
    .single();

  if (currentTaskError) {
    throw currentTaskError;
  }

  // Busca a próxima task
  const { data: nextTask, error: nextTaskError } = await supabase
    .from("tasks")
    .select("id")
    .eq("psalm_id", currentTask.psalm_id)
    .eq("global_order", currentTask.global_order + 1)
    .maybeSingle();

  if (nextTaskError) {
    throw nextTaskError;
  }

  return nextTask;
}