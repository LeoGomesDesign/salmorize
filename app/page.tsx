"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import SalmorizeLoading from "@/app/features/game/components/loading/SalmorizeLoading";

export default function Home() {
  const router = useRouter();
  const initializationRef = useRef<Promise<void> | null>(null);
  const [initializationError, setInitializationError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    if (!initializationRef.current) {
      initializationRef.current = (async () => {
        const supabase = createClient();
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (!session) {
          const { data, error: anonymousSignInError } =
            await supabase.auth.signInAnonymously();

          if (anonymousSignInError) {
            throw anonymousSignInError;
          }

          if (!data.session) {
            throw new Error("O Supabase não retornou uma sessão anônima.");
          }
        }
      })();
    }

    initializationRef.current
      .then(() => {
        if (!cancelled) {
          router.replace("/home");
        }
      })
      .catch((error: unknown) => {
        initializationRef.current = null;
        if (!cancelled) {
          console.error("Falha ao iniciar sessão:", error);
          setInitializationError(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [retryCount, router]);

  if (initializationError) {
    return (
      <main className="bg-splash min-h-screen flex flex-col items-center justify-center gap-5 px-6">
        <p role="alert" className="max-w-sm text-center text-stone-800">
          Não foi possível iniciar sua jornada. Verifique sua conexão e tente novamente.
        </p>
        <button
          type="button"
          onClick={() => {
            setInitializationError(false);
            setRetryCount((count) => count + 1);
          }}
          className="rounded-2xl px-6 py-3 font-bold text-white"
          style={{ backgroundColor: "#1E4639" }}
        >
          Tentar novamente
        </button>
      </main>
    );
  }

  return (
    <SalmorizeLoading
      variant="splash"
      message="Comece agora. Você pode entrar com Google depois para manter seu progresso."
    />
  );
}