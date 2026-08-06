"use client";

import { useMemo } from "react";

// ============================================================================
// Propriedades
// ============================================================================

type HexProgressProps = {
  size: number;
  progress: number; // 0 → 100
};

// ============================================================================
// Barra de progresso Hexagonal
// ============================================================================

export default function HexProgress({
  size,
  progress,
}: HexProgressProps) {

  // ==========================================================================
  // Caminho do hexágono exportado do Figma
  // ==========================================================================

  const path =
    "M2.95483 46.2148C1.9141 44.4122 1.9141 42.1913 2.95483 40.3887L23.3357 5.08789C24.3764 3.28529 26.3001 2.1748 28.3816 2.1748L69.1433 2.1748C71.2248 2.1748 73.1485 3.28529 74.1892 5.08789L94.5701 40.3887C95.6108 42.1913 95.6108 44.4122 94.5701 46.2148L74.1892 81.5156C73.1485 83.3182 71.2248 84.4287 69.1433 84.4287L28.3816 84.4287C26.3001 84.4287 24.3764 83.3182 23.3357 81.5156L2.95483 46.2148Z";

  // ==========================================================================
  // Comprimento total do caminho
  // ==========================================================================

  const pathLength = useMemo(() => {
    if (typeof window === "undefined") return 0;

    const svgPath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );

    svgPath.setAttribute("d", path);

    return svgPath.getTotalLength();
  }, []);

  // ==========================================================================
  // Quanto do caminho ficará escondido
  // ==========================================================================

  const dashOffset =
    pathLength - (pathLength * progress) / 100;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 98 87"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "visible",
      }}
    >
      {/* ==========================================================
          Fundo cinza
      ========================================================== */}

      <path
        d={path}
        fill="none"
        stroke="#D8D8D8"
        strokeWidth="4.5"
      />

      {/* ==========================================================
          Progresso
      ========================================================== */}

      <path
        d={path}
        fill="none"
        stroke="#22C55E"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeDasharray={pathLength}
        strokeDashoffset={dashOffset}
        style={{
          transition: "stroke-dashoffset .35s ease",
        }}
      />
    </svg>
  );
}