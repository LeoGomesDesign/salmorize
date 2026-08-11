import { createClient } from "@/lib/supabase/client";

export async function getVerseAudioUrl(verseId: number) {
  const supabase = createClient();

  const { data: audio, error } = await supabase
    .from("audio_assets")
    .select("storage_path")
    .eq("verse_id", verseId)
    .eq("type", "verse")
    .eq("language", "pt-BR")
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar áudio do verso:", error);
    return null;
  }

  if (!audio) {
    console.warn(`Áudio não encontrado para o verso ${verseId}`);
    return null;
  }

  const { data } = supabase.storage
    .from("verse-audios")
    .getPublicUrl(audio.storage_path);

  return data.publicUrl;
}