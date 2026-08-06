import { createClient } from "@/lib/supabase/client";

export async function getImportedPsalms() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("psalms")
    .select("number")
    .order("number");

  if (error) {
    throw error;
  }

  return data.map((psalm) => psalm.number);
}