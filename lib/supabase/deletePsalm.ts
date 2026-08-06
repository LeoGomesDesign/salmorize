import { createClient } from "@/lib/supabase/client";

// ============================================================
// Remove um Salmo do banco de dados.
// As tabelas relacionadas são removidas automaticamente
// através das Foreign Keys (ON DELETE CASCADE).
// ============================================================

export async function deletePsalm(number: number) {
  const supabase = createClient();

  const { error } = await supabase
    .from("psalms")
    .delete()
    .eq("number", number);

  if (error) {
    throw error;
  }
}