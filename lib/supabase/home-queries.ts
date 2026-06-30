import type { SupabaseClient } from "@supabase/supabase-js";
import { buildPsalmNodes } from "@/lib/home/build-psalm-nodes";
import type { Profile, Psalm, UserPsalmProgress } from "@/lib/types/database";
import type { HomeData } from "@/lib/types/home";

function profileFromRow(row: Profile): HomeData["profile"] {
  return {
    displayName: row.display_name ?? "Viajante",
    streak: row.streak,
    gems: row.gems,
    energy: row.energy,
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

  const [psalmsResult, progressResult] = await Promise.all([
    supabase.from("psalms").select("*").order("number"),
    supabase
      .from("user_psalm_progress")
      .select("*")
      .eq("user_id", user.id),
  ]);

  if (psalmsResult.error) throw psalmsResult.error;
  if (progressResult.error) throw progressResult.error;

  const psalms = (psalmsResult.data ?? []) as Psalm[];
  const progress = (progressResult.data ?? []) as UserPsalmProgress[];

  return {
    profile: profileFromRow(profileRow),
    psalms: buildPsalmNodes(psalms, progress),
  };
}
