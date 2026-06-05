"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

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