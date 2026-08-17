import { createClient } from "@/lib/supabase/client";

export async function getNextTask(
  psalmId: number,
  globalOrder: number
) {
  const supabase = createClient();

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