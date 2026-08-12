import { createClient } from "@/lib/supabase/client";
import type { TaskType } from "@/lib/types/task";

export interface CurrentTask {
  id: number;
  type: TaskType;
  variant: string;
  task_order: number;
  global_order: number;
  recap: boolean;
  recap_verses: {
    id: number;
    text: string;
    position: number;
  } [];
  battery_cost: number;
  star_reward: number;
  xp_reward: number;

  verses: {
    id: number;
    text: string;
    position: number;
    audio_url: string | null;
  } | null;

  psalm_id: number;

  psalm_verses: {
  id: number;
  text: string;
  position: number;
}[];

stanza_total_tasks: number;
psalm_total_tasks: number;
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
      stanza_id,
      psalm_id,
      battery_cost,
      star_reward,
      xp_reward,
      verses (
        id,
        text,
        position,
        audio_url
      )
    `)
    .eq("id", taskId)
    .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("Task não encontrada.");
    }

  const { count: stanzaTotalTasks, error: countError } = await supabase
  .from("tasks")
  .select("*", { count: "exact", head: true })
  .eq("stanza_id", data.stanza_id);

  if (countError) {
  throw countError;
  }

  const { count: psalmTotalTasks, error: psalmCountError } = await supabase
  .from("tasks")
  .select("*", { count: "exact", head: true })
  .eq("psalm_id", data.psalm_id);

if (psalmCountError) {
  throw psalmCountError;
}
    

    let psalmVerses: CurrentTask["psalm_verses"] = [];

    const { data: stanzas } = await supabase
    .from("stanzas")
    .select("id")
    .eq("psalm_id", data.psalm_id);

    if (stanzas?.length) {
     const stanzaIds = stanzas.map(s => s.id);

      const { data: verses } = await supabase
      .from("verses")
      .select(`
      id,
      text,
      position
      `)
      .in("stanza_id", stanzaIds)
      .order("position");

      psalmVerses = verses ?? [];
    }


 

  let recapVerses: CurrentTask["recap_verses"] = [];

    if (data.recap_verses?.length) {
    const { data: verses } = await supabase
    .from("verses")
    .select(`
      id,
      text,
      position
      `)
      .in("id", data.recap_verses)
      .order("position");

      recapVerses = verses ?? [];
    }


  return {
    ...data,
    recap_verses: recapVerses,
    psalm_verses: psalmVerses,
    stanza_total_tasks: stanzaTotalTasks ?? 0,
    psalm_total_tasks: psalmTotalTasks ?? 0,
  }
};