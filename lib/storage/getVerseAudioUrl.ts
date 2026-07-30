import { createClient } from "@/lib/supabase/client";

export function getVerseAudioUrl(verseId: number) {
  const supabase = createClient();
  const { data } = supabase.storage
    .from("verse-audios")
    .getPublicUrl(`${verseId}.mp3`);

  return data.publicUrl;
}