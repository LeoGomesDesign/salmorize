import { createClient } from "@/lib/supabase/client";
import type { TaskType } from "@/lib/types/task";

export interface CurrentTask {
  id: number;
  type: TaskType;
  variant: string;
  task_order: number;
  global_order: number;
  recap: boolean;
  recap_verses: number[];
  battery_cost: number;
  star_reward: number;
  xp_reward: number;

  verses: {
    id: number;
    text: string;
    position: number;
  } | null;
}


export async function getCurrentTask(
  taskId: number
): Promise<CurrentTask> {

  const supabase = createClient();

  const { data, error } = await supabase
    .from("tasks")
    .select(`
      id,
      type,
      variant,
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