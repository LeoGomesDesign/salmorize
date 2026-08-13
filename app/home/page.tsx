"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useHomeData } from "@/lib/hooks/useHomeData";

import PsalmModal from "../features/game/modals/PsalmModal";
import PsalmStep from "../features/game/components/PsalmStep";
import type { HomeData } from "@/lib/types/home";

const STEP_HEIGHT = 120;
const STEP_SIZE_ACT = 64;

const AREA_WIDTH = 390;

const PADDING_TOP = 72;
const PADDING_BOT = 40;

const X_RIGHT = AREA_WIDTH * 0.84;
const X_LEFT = AREA_WIDTH * 0.16;

const getX = (index: number) =>
  index % 2 === 0 ? X_RIGHT : X_LEFT;



// ─── Página principal ─────────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const { loading, error, profile, psalms, refetch } = useHomeData();
  
  const [selectedPsalm, setSelectedPsalm] =
  useState<HomeData["psalms"][number] | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const activePsalm = psalms.find((p) => p.status === "active") ?? psalms[0];

  const handleOpenModal = (
    psalm: HomeData["psalms"][number]
    ) => {
    setSelectedPsalm(psalm);
  };

  const handleContinue = (
    psalm: HomeData["psalms"][number]
    ) => {
  if (energy <= 0) {
    alert("Você está sem energia.");
    return;
  }

  router.push(`/lesson/${psalm.number}`);
  };

  const handleCloseModal = () => {
    setSelectedPsalm(null);
  };

  const psalmCount = psalms.length;
  const scrollActiveIndex = psalms.findIndex((p) => p.status === "active");

  useEffect(() => {
    if (loading || psalmCount === 0 || scrollActiveIndex < 0 || !scrollRef.current) return;
    const activeTop =
      PADDING_TOP + (psalmCount - 1 - scrollActiveIndex) * STEP_HEIGHT;
    const viewH = scrollRef.current.clientHeight;
    scrollRef.current.scrollTop = activeTop - viewH / 2 + STEP_SIZE_ACT / 2;
  }, [loading, psalmCount, scrollActiveIndex]);

  if (loading) {
    return (
      <main
        className="h-screen flex items-center justify-center"
        style={{ backgroundColor: "#F2EDE4", fontFamily: "var(--font-montserrat)" }}
      >
        <p className="text-stone-600 font-medium">Carregando jornada...</p>
      </main>
    );
  }

  if (error || !profile || psalms.length === 0) {
    return (
      <main
        className="h-screen flex flex-col items-center justify-center gap-4 px-6"
        style={{ backgroundColor: "#F2EDE4", fontFamily: "var(--font-montserrat)" }}
      >
        <p className="text-stone-700 text-center">
          {error ?? "Não foi possível carregar sua jornada."}
        </p>
        <button
          onClick={refetch}
          className="rounded-2xl px-6 py-3 font-bold text-stone-800 active:scale-95 transition-transform"
          style={{ backgroundColor: "#E8A920" }}
        >
          Tentar novamente
        </button>
      </main>
    );
  }

  const userName = profile.displayName;
  const streak = profile.streak;
  const gems = profile.gems;
  const energy = profile.energy;
  // Altura total da área scrollável
  const totalHeight = psalms.length * STEP_HEIGHT + PADDING_TOP + PADDING_BOT;

  // Posição top de cada degrau (0 = último salmo no topo, índice 0 = Salmo 1 na base)
  const getTop = (index: number) =>
    PADDING_TOP + (psalms.length - 1 - index) * STEP_HEIGHT;
  // Centro de cada degrau para a linha tracejada
  const stepCenterX = (index: number) => getX(index);
  const stepCenterY = (index: number) => getTop(index) + (STEP_SIZE_ACT / 2) + 8;

  const renderDashedPath = () => {
    const points = psalms.map((_, i) => ({
      x: stepCenterX(i),
      y: stepCenterY(i),
    }));

    // Monta um polyline passando por todos os centros
    const d = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
      .join(" ");

    return (
      <svg
        width={AREA_WIDTH}
        height={totalHeight}
        viewBox={`0 0 ${AREA_WIDTH} ${totalHeight}`}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 1 }}
      >
        <path
          d={d}
          fill="none"
          stroke="#C8C4BE"
          strokeWidth="4"
          strokeDasharray="14 10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    
    <main
      className="h-screen flex flex-col select-none overflow-hidden"
      style={{ backgroundColor: "#F2EDE4", fontFamily: "var(--font-montserrat)" }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="flex items-center justify-between px-5 pt-12 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="rounded-full overflow-hidden border-2 border-stone-300 shrink-0"
            style={{ width: 52, height: 52, backgroundColor: "#E8E2D8" }}
          >
            <SheepAvatar />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-stone-500 text-sm font-medium">Olá, 👋</span>
            <span className="text-stone-800 font-bold text-lg">{userName}</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-stone-700 text-base">{streak}</span>
            <span className="text-lg">📅</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-stone-700 text-base">{gems}</span>
            <span className="text-lg">💎</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-stone-700 text-base">{energy}</span>
            <span className="text-lg">⚡</span>
          </div>
        </div>
      </header>

      {/* ── Área scrollável da escada ────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto"
        style={{ overscrollBehavior: "contain", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
      >
        {/* Container externo que centraliza a área da escada */}
        <div style={{ position: "relative", width: "100%", height: totalHeight, display: "flex", justifyContent: "center" }}>

          {/* Área fixa da escada: aqui colocamos a linha tracejada e os degraus na mesma div */}
          <div style={{ position: "relative", width: AREA_WIDTH, height: totalHeight }}>
            {renderDashedPath()}

            {/* Degraus */}
            {psalms.map((psalm, index) => {              const top  = getTop(index);
              const cx   = getX(index);
              const ring = STEP_SIZE_ACT + 16;

              return (
                <div
                  key={psalm.id}
                  style={{
                    position: "absolute",
                    top,
                    left: cx - ring / 2,
                    zIndex: 10,
                  }}
                >
                  <PsalmStep psalm={psalm} onOpenModal={handleOpenModal} />

                  
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Barra CTA ───────────────────────────────────────────────────── */}
      <div className="px-4 pb-10 pt-3 shrink-0">
        <button
        onClick={() => handleOpenModal(activePsalm)}
          className="w-full rounded-3xl px-6 py-5 flex items-center justify-between active:scale-95 transition-transform"
          style={{ background: "linear-gradient(90deg, #538A78 0%, #1E4639 100%)", boxShadow: "0 8px 0 #0F3F2F" }}
        >
          <div className="flex flex-col items-start gap-2">
            <span className="text-gray-2 font-black font-domine text-xl text-left">
              Salmo {activePsalm.number}
            </span>
            <span className="text-gray-2 font-medium text-lg text-left">
              {activePsalm.label}
            </span>

          {/*Progress bar*/}
            <div
              className="rounded-full overflow-hidden w-full"
              style={{ 
                height: 10, 
                backgroundColor: "rgba(255, 255, 255, 0.18)", 
              }}
            >
              
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ 
                 width: `${activePsalm.progress}%`,
                 background: "linear-gradient(90deg, #279838 0%, #35DE4F 100%)",
                 }}
              />
            </div>
          </div>
          <span className="text-gray-1 font-black text-4xl font-domine tabular-nums">
            {activePsalm.progress}
            <span className="text-2xl">%</span>
          </span>
        </button>
      </div>

      {/* ── Modal ──────────────────────────────────────────────────────── */}
      <PsalmModal 
        psalm={selectedPsalm} 
        onClose={handleCloseModal}
        onContinue={handleContinue}
      />
    </main>
  );
}

// ─── Avatar da ovelha ────────────────────────────────────────────────────────
function SheepAvatar() {
  return (
    <img 
    src="/img/ovelha_Recap.png"
    alt="Avatar da ovelha" />
  );
}