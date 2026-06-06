"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Verificar se o usuário já completou o onboarding
    const userEmail = localStorage.getItem('userEmail');
    const timer = setTimeout(() => {
      if (!userEmail) {
        router.push('/onboarding');
      } else {
        router.push('/dashboard');
      }
    }, 2000);
    
    return () => clearTimeout(timer);
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