import { createClient } from "@/lib/supabase/client";

export async function getUserProgress(psalmNumber: number) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Usuário não autenticado.");
  }

  const { data: psalm, error: psalmError } = await supabase
  .from("psalms")
  .select("id")
  .eq("number", psalmNumber)
  .single();

    if (psalmError || !psalm) {
        throw new Error(`Salmo ${psalmNumber} não encontrado.`);
    }

const psalmId = psalm.id;

  // Verifica se já existe progresso
  const { data: progress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("psalm_id", psalmId)
    .maybeSingle();

  if (progress) {
    return progress;
  }

  // Busca a primeira task do Salmo
  const { data: firstTask, error: taskError } = await supabase
    .from("tasks")
    .select("id")
    .eq("psalm_id", psalmId)
    .order("global_order")
    .limit(1)
    .single();

  if (taskError) {
    throw taskError;
  }

  // Cria o progresso inicial
  const { data: newProgress, error } = await supabase
    .from("user_progress")
    .insert({
      user_id: user.id,
      psalm_id: psalmId,
      current_task_id: firstTask.id,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return newProgress;
}