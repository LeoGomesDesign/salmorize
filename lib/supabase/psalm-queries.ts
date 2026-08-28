import type { SupabaseClient } from "@supabase/supabase-js";

export type PsalmVerse = {
  id: number;
  stanzaId: number;
  stanzaPosition: number;
  position: number;
  text: string;
};

export async function fetchPsalmVerses(
  supabase: SupabaseClient,
  psalmId: number
): Promise<PsalmVerse[]> {
  const { data, error } = await supabase
    .from("stanzas")
    .select(`
      id,
      position,
      verses (
        id,
        position,
        text
      )
    `)
    .eq("psalm_id", psalmId)
    .order("position");

  if (error) {
    throw error;
  }

  return (data ?? []).flatMap((stanza) =>
    (stanza.verses ?? []).map((verse) => ({
      id: verse.id,
      stanzaId: stanza.id,
      stanzaPosition: stanza.position,
      position: verse.position,
      text: verse.text,
    }))
  );
}