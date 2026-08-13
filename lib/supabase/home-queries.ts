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
  
  const progress = progressResult.data ?? [];

  const taskIds = progress.map((row) => row.current_task_id);
  const psalmIds = [...new Set(progress.map((row) => row.psalm_id))];
  
  const [tasksResult, stanzasResult] = await Promise.all([
    taskIds.length > 0
      ? supabase.from("tasks").select("id, stanza_id").in("id", taskIds)
      : Promise.resolve({ data: [], error: null }),
    psalmIds.length > 0
      ? supabase
          .from("stanzas")
          .select("id, psalm_id")
          .in("psalm_id", psalmIds)
          .order("psalm_id")
          .order("position")
      : Promise.resolve({ data: [], error: null }),
  ]);
  
  if (tasksResult.error) throw tasksResult.error;
  if (stanzasResult.error) throw stanzasResult.error;
  
  const taskById = new Map(
    (tasksResult.data ?? []).map((task) => [task.id, task])
  );
  
  const stanzasByPsalmId = new Map<number, { id: number }[]>();
  for (const stanza of stanzasResult.data ?? []) {
    const list = stanzasByPsalmId.get(stanza.psalm_id) ?? [];
    list.push({ id: stanza.id });
    stanzasByPsalmId.set(stanza.psalm_id, list);
  }
  
  const progressWithSteps = progress.map((row) => {
    const task = taskById.get(row.current_task_id);
    if (!task) {
      throw new Error("Task não encontrada.");
    }
  
    const stanzas = stanzasByPsalmId.get(row.psalm_id) ?? [];
    const totalSteps = stanzas.length;
  
    const currentStep =
      stanzas.findIndex((stanza) => stanza.id === task.stanza_id) + 1;
  
    const completedSteps = row.completed ? totalSteps : currentStep - 1;
  
    const progressPercent =
      totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
  
    return {
      ...row,
      current_step: currentStep,
      total_steps: totalSteps,
      progress: progressPercent,
    };
  });
 


  return {
    profile: profileFromRow(
      profileRow,
      userStats.battery
    ),
    psalms: buildPsalmNodes(psalms, progressWithSteps),
  };
}
