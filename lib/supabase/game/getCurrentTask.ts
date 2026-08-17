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
  }[];

  battery_cost: number;
  star_reward: number;
  xp_reward: number;

  verses: {
    id: number;
    text: string;
    position: number;
    audio_url: string | null;
  } | null;

  stanza_id: number;
  psalm_id: number;
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

  let recapVerses: CurrentTask["recap_verses"] = [];

  if (data.recap_verses?.length) {
    const { data: verses, error: recapError } = await supabase
      .from("verses")
      .select(`
        id,
        text,
        position
      `)
      .in("id", data.recap_verses)
      .order("position");

    if (recapError) {
      throw recapError;
    }

    recapVerses = verses ?? [];
  }

  const verse = Array.isArray(data.verses)
    ? data.verses[0] ?? null
    : data.verses ?? null;

  return {
    ...data,
    verses: verse,
    recap_verses: recapVerses,
  };
}