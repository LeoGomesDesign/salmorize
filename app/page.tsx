"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Home() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error('Supabase auth error:', error.message);
        router.replace('/onboarding');
        return;
      }

      if (user) {
        router.replace('/dashboard');
      } else {
        router.replace('/onboarding');
      }
    };

    initAuth();
  }, [router]);

  return (
    <main className="bg-splash min-h-screen flex items-center justify-center">
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0px)" : "translateY(12px)",
          transition: "opacity 1s ease, transform 1.2s ease",
        }}
      >
        <Image
          src="/logo.svg"
          alt="Salmorize"
          width={180}
          height={80}
          priority
        />
      </div>
    </main>
  );
}