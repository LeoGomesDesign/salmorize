"use client";


import type { PsalmNode } from "@/lib/types/home";
import HexButton from "./HexButton";
import HexProgress from "./HexProgress";

// ─── Layout da escada ─────────────────────────────────────────────────────────

const RING_PADDING = 16;

const STEP_VARIANTS = {
  active: {
    size: 90,
    icon: "/img/OpenBible.png",
  },

  completed: {
    size: 82,
    icon: "/img/bibliComplete.png",
  },

  locked: {
    size: 82,
    icon: "/img/booksClose.png",
  },
} as const;




export default function PsalmStep({ psalm, onOpenModal }: { psalm: PsalmNode; onOpenModal: (psalm: PsalmNode) => void }) {
 const variant = STEP_VARIANTS[psalm.status];
 
 const isActive = psalm.status === "active";
 const isLocked = psalm.status === "locked";
  // Arco de progresso
  const ringSize = variant.size + RING_PADDING;
  const radius = (ringSize - 8) / 2;
  const circumference = 2 * Math.PI * radius;

  const dashOffset =
  circumference - (circumference * psalm.progress) / 100;

  

  return (
  // ───────────────────────────────────────────────────────────────
  // Botão do Salmo
  // ───────────────────────────────────────────────────────────────
  <button
    onClick={() => !isLocked && onOpenModal(psalm)}
    disabled={isLocked}
    className="cursor-pointer hover:scale-110 active:scale-95 transition-transform disabled:cursor-not-allowed"
    style={{
      position: "relative",
      width: ringSize,
      height: ringSize,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      background: "none",
      padding: 0,
    }}
  >

   <>
  {/* ============================================================
      STATUS ACTIVE
      Apenas o salmo atual possui o anel de progresso.
      ============================================================ */}
  {isActive && (
     <HexProgress
      size={ringSize}
      progress={psalm.progress}
    />
  )}

  {/* ============================================================
      BOTÃO
      O visual é controlado pelo HexButton.
      ============================================================ */}
  <HexButton
    size={variant.size}
    icon={variant.icon}
    status={psalm.status}
   
  />
</>

  </button>
);
}