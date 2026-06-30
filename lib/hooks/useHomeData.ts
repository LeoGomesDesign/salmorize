"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { fetchHomeData } from "@/lib/supabase/home-queries";
import type { HomeData } from "@/lib/types/home";

type UseHomeDataResult = {
  loading: boolean;
  error: string | null;
  profile: HomeData["profile"] | null;
  psalms: HomeData["psalms"];
  refetch: () => Promise<void>;
};

export function useHomeData(): UseHomeDataResult {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<HomeData["profile"] | null>(null);
  const [psalms, setPsalms] = useState<HomeData["psalms"]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/onboarding");
        return;
      }

      const data = await fetchHomeData(supabase);
      setProfile(data.profile);
      setPsalms(data.psalms);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Erro ao carregar dados";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  return { loading, error, profile, psalms, refetch: load };
}
