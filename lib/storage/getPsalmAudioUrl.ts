import { createClient } from "@/lib/supabase/client";

type PsalmAudioType = "psalm_title" | "psalm_recap";

export async function getPsalmAudioUrl(
  psalmNumber: number,
  type: PsalmAudioType
) {
  const supabase = createClient();

  // ============================================================
  // 1. Encontra o Salmo pelo número
  // ============================================================
  const { data: psalm, error: psalmError } = await supabase
    .from("psalms")
    .select("id")
    .eq("number", psalmNumber)
    .maybeSingle();

  if (psalmError) {
    console.error("Erro ao buscar Salmo:", psalmError);
    return null;
  }

  if (!psalm) {
    console.warn(`Salmo ${psalmNumber} não encontrado`);
    return null;
  }

  // ============================================================
  // 2. Busca o áudio relacionado ao Salmo
  // ============================================================
  const { data: audio, error: audioError } = await supabase
    .from("audio_assets")
    .select("storage_path")
    .eq("psalm_id", psalm.id)
    .eq("type", type)
    .eq("language", "pt-BR")
    .maybeSingle();

  if (audioError) {
    console.error("Erro ao buscar áudio do Salmo:", audioError);
    return null;
  }

  if (!audio) {
    console.warn(
      `Áudio "${type}" não encontrado para o Salmo ${psalmNumber}`
    );
    return null;
  }

  // ============================================================
  // 3. Converte o caminho em URL pública do Storage
  // ============================================================
  const { data } = supabase.storage
    .from("verse-audios")
    .getPublicUrl(audio.storage_path);

  return data.publicUrl;
}