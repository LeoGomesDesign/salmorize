import { createClient } from "@/lib/supabase/client";

export async function getCurrentTask(taskId: number) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select(`
      id,
      type,
      task_order,
      global_order,
      recap,
      recap_verses,
      battery_cost,
      star_reward,
      xp_reward,
      verses (
        id,
        text,
        position
      )
    `)
    .eq("id", taskId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}