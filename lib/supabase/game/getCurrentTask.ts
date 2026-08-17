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

  psalm_verses: {
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

  stanza_total_tasks: number;
}

export async function getCurrentTask(
  taskId: number
): Promise<CurrentTask> {
  const supabase = createClient();

  // Busca a task atual
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

  // Busca quantas tasks existem na stanza atual
  const { count: stanzaTotalTasks, error: stanzaCountError } =
    await supabase
      .from("tasks")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("stanza_id", data.stanza_id);

  if (stanzaCountError) {
    throw stanzaCountError;
  }

  // Versos usados pelo Recap
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

  // Todos os versos do Salmo só são necessários pelo Recap
let psalmVerses: CurrentTask["psalm_verses"] = [];

if (data.type === "recap") {
  const { data: stanzas, error: stanzasError } = await supabase
    .from("stanzas")
    .select("id")
    .eq("psalm_id", data.psalm_id);

  if (stanzasError) {
    throw stanzasError;
  }

  if (stanzas?.length) {
    const stanzaIds = stanzas.map((stanza) => stanza.id);

    const { data: verses, error: versesError } = await supabase
      .from("verses")
      .select(`
        id,
        text,
        position
      `)
      .in("stanza_id", stanzaIds)
      .order("position");

    if (versesError) {
      throw versesError;
    }

    psalmVerses = verses ?? [];
  }
}

  const verse = Array.isArray(data.verses)
    ? data.verses[0] ?? null
    : data.verses ?? null;

  return {
    ...data,
    verses: verse,
    recap_verses: recapVerses,
    psalm_verses: psalmVerses,
    stanza_total_tasks: stanzaTotalTasks ?? 0,
  };
}