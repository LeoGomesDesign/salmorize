"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

export default function GoogleLoginButton() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);

    try {
      const supabase = createClient();

      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="btn btn-secondary w-full gap-2"
      disabled={loading}
      style={{ opacity: loading ? 0.75 : 1 }}
    >
      <Image src="/img/GoogleLogo.png" alt="Google" width={20} height={20} />
      {loading ? "Conectando..." : "Continuar com Google"}
    </button>
  );
}