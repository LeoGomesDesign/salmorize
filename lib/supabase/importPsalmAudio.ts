import { createClient } from "@/lib/supabase/client";

export async function importPsalmAudio(
  psalmNumber: number,
  files: File[]
) {
  const supabase = createClient();
  const {
  data: { user },
} = await supabase.auth.getUser();

console.log("AUDIO IMPORT USER:", user?.id);

  // ============================================================
  // Busca o Salmo
  // ============================================================

  const { data: psalm, error: psalmError } = await supabase
    .from("psalms")
    .select("id, number")
    .eq("number", psalmNumber)
    .single();

  if (psalmError || !psalm) {
    throw new Error("PSALM_NOT_FOUND");
  }

  // ============================================================
  // Busca os versos do Salmo através das estrofes
  // ============================================================

  const { data: stanzas, error: stanzasError } = await supabase
    .from("stanzas")
    .select(`
      id,
      verses (
        id
      )
    `)
    .eq("psalm_id", psalm.id);

  if (stanzasError) {
    throw stanzasError;
  }

  // ============================================================
  // Cria uma lista com todos os verse_ids do Salmo
  // ============================================================

  const verseIds = new Set<number>();

  for (const stanza of stanzas ?? []) {
    for (const verse of stanza.verses ?? []) {
      verseIds.add(verse.id);
    }
  }

  // ============================================================
  // Processa os arquivos
  // ============================================================

  for (const file of files) {
    // 184.mp3 → 184
    const fileName = file.name.replace(/\.mp3$/i, "");
    const verseId = Number(fileName);

    // ------------------------------------------------------------
    // Valida o nome do arquivo
    // ------------------------------------------------------------

    if (!Number.isInteger(verseId)) {
      throw new Error(`INVALID_FILE_NAME: ${file.name}`);
    }

    // ------------------------------------------------------------
    // Verifica se o verso pertence ao Salmo
    // ------------------------------------------------------------

    if (!verseIds.has(verseId)) {
      throw new Error(
        `VERSE_DOES_NOT_BELONG_TO_PSALM: ${file.name}`
      );
    }

    // ------------------------------------------------------------
    // Define o caminho no Storage
    // ------------------------------------------------------------

    const storagePath =
      `Psalm-${psalmNumber}/${verseId}.mp3`;

    // ------------------------------------------------------------
    // Upload para Supabase Storage
    // ------------------------------------------------------------

    const { error: uploadError } = await supabase.storage
      .from("verse-audios")
      .upload(storagePath, file, {
        contentType: "audio/mpeg",
        upsert: true,
      });

    if (uploadError) {
      throw uploadError;
    }

    // ============================================================
    // Verifica se já existe registro para esse verso
    // ============================================================

    const { data: existingAudio, error: existingAudioError } =
      await supabase
        .from("audio_assets")
        .select("id")
        .eq("verse_id", verseId)
        .maybeSingle();

    if (existingAudioError) {
      throw existingAudioError;
    }

    // ============================================================
    // Atualiza ou cria o audio_asset
    // ============================================================

    if (existingAudio) {
      const { error: updateError } = await supabase
        .from("audio_assets")
        .update({
          type: "verse",
          psalm_id: psalm.id,
          language: "pt-BR",
          storage_path: storagePath,
        })
        .eq("id", existingAudio.id);

      if (updateError) {
        throw updateError;
      }
    } else {
      const { error: insertError } = await supabase
        .from("audio_assets")
        .insert({
          type: "verse",
          psalm_id: psalm.id,
          verse_id: verseId,
          language: "pt-BR",
          storage_path: storagePath,
        });

      if (insertError) {
        throw insertError;
      }
    }
  }

  return {
    success: true,
    imported: files.length,
  };
}