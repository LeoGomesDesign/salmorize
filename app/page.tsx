"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import SalmorizeLoading from "@/app/features/game/components/loading/SalmorizeLoading";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const supabase = createClient();

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Supabase auth error:", error.message);
        router.replace("/onboarding");
        return;
      }

      if (user) {
        router.replace("/home");
      } else {
        router.replace("/onboarding");
      }
    };

    initAuth();
  }, [router]);

  return <SalmorizeLoading variant="splash" />;
}