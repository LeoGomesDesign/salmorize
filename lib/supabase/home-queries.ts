import type { SupabaseClient } from "@supabase/supabase-js";
import { buildPsalmNodes } from "@/lib/home/build-psalm-nodes";
import type { Profile, Psalm } from "@/lib/types/database"
import type { HomeData } from "@/lib/types/home";

function profileFromRow(
  row: Profile,
  battery: number
): HomeData["profile"] {
  return {
    displayName: row.display_name ?? "Ovelha",
    streak: row.streak,
    gems: row.gems,
    energy: battery,
  };
}

async function ensureProfile(
  supabase: SupabaseClient,
  userId: string,
  fallbackName: string
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (data) return data as Profile;

  if (error) throw error;

  const { data: created, error: insertError } = await supabase
    .from("profiles")
    .insert({ id: userId, display_name: fallbackName })
    .select("*")
    .single();

  if (insertError) throw insertError;
  return created as Profile;
}

export async function fetchHomeData(
  supabase: SupabaseClient
): Promise<HomeData> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("Usuário não autenticado");

  const fallbackName =
    (user.user_metadata?.full_name as string | undefined) ??
    (user.user_metadata?.name as string | undefined) ??
    user.email?.split("@")[0] ??
    "Viajante";

const profileRow = await ensureProfile(supabase, user.id, fallbackName);

const { data: userStats, error: userStatsError } = await supabase
  .from("user_stats")
  .select("battery")
  .eq("id", user.id)
  .single();

if (userStatsError) {
  throw userStatsError;
}

  const [psalmsResult, progressResult] = await Promise.all([
    supabase
    .from("psalms")
    .select("*")
    .order("number"),
    supabase
      .from("user_progress")
      .select(`
        psalm_id,
        current_task_id,
        completed
        `)
      .eq("user_id", user.id),
  ]);

  if (psalmsResult.error) throw psalmsResult.error;
  if (progressResult.error) throw progressResult.error;

  const psalms = (psalmsResult.data ?? []) as Psalm[];
  console.table(psalms);
  const progress = progressResult.data ?? [];

  const progressWithSteps = await Promise.all(
    progress.map(async (row) => {
      
      //Busca a task atual
      const { data: task, error: taskError } = await supabase
      .from("tasks")
      .select("stanza_id")
      .eq("id", row.current_task_id)
      .single();

      if (taskError) {
      throw taskError;
      
      }

      if(!task) {
        throw new Error("Task não encontrada.")
      }

    // Busca todas as stanzas do Salmo
    const { data: stanzas, error: stanzasError } = await supabase
      .from("stanzas")
      .select("id")
      .eq("psalm_id", row.psalm_id)
      .order("position");

    if (stanzasError) {
      throw stanzasError;
    }

    const totalSteps = stanzas.length;

    const currentStep =
      stanzas.findIndex(
        (stanza) => stanza.id === task.stanza_id
      ) + 1;

    const progress =
      Math.round((currentStep / totalSteps) * 100);

    return {
      ...row,
      current_step: currentStep,
      total_steps: totalSteps,
      progress,
    };
  })
);


  return {
    profile: profileFromRow(
      profileRow,
      userStats.battery
    ),
    psalms: buildPsalmNodes(psalms, progressWithSteps),
  };
}
