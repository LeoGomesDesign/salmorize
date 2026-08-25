"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type SalmorizeLoadingProps = {
  variant?: "splash" | "loading";
};

export default function SalmorizeLoading({
  variant = "loading",
}: SalmorizeLoadingProps) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const visibleTimer = setTimeout(() => {
      setVisible(true);
    }, variant === "splash" ? 300 : 0);

    const progressTimer = setTimeout(() => {
      setProgress(true);
    }, variant === "splash" ? 700 : 300);

    return () => {
      clearTimeout(visibleTimer);
      clearTimeout(progressTimer);
    };
  }, [variant]);

  return (
    <main
      className="bg-splash min-h-screen flex items-center justify-center"
      style={{
        opacity: exiting ? 0 : 1,
        transition: "opacity 500ms ease",
      }}
    >
      <div
        className="flex flex-col items-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0px)" : "translateY(12px)",
          transition: "opacity 1s ease, transform 1.2s ease",
        }}
      >
        <Image
          src="/svg/logo.svg"
          alt="Salmorize"
          width={180}
          height={80}
          priority
        />

        {variant === "loading" && (
          <div className="mt-6 w-40 h-2 rounded-full overflow-hidden bg-black/10">
            <div
              className="h-full rounded-full"
              style={{
                width: progress ? "100%" : "0%",
                background:
                  "linear-gradient(90deg, #538A78 0%, #1E4639 100%)",
                transition: "width 1.5s cubic-bezier(0.65, 0, 0.35, 1)",
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}