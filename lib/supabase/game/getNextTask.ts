import type { SupabaseClient } from "@supabase/supabase-js";

export async function getNextTask(
  supabase: SupabaseClient,
  psalmId: number,
  globalOrder: number
) {
  const { data, error } = await supabase
    .from("tasks")
    .select(`
      id,
      stanza_id
    `)
    .eq("psalm_id", psalmId)
    .eq("global_order", globalOrder + 1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}
