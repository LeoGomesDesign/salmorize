"use client";

import { useRef, useEffect, useState } from "react";

import { useHomeData } from "@/lib/hooks/useHomeData";
import { PSALM_TOTAL_STEPS, type PsalmNode } from "@/lib/types/home";
// ─── Layout da escada ─────────────────────────────────────────────────────────
const STEP_HEIGHT   = 120;   // px entre cada degrau
const STEP_SIZE     = 64;    // px do círculo padrão
const STEP_SIZE_ACT = 64;    // px do círculo ativo
const AREA_WIDTH    = 390;   // largura da área (max-w-md)
const PADDING_TOP   = 72;    // espaço acima do último degrau
const PADDING_BOT   = 40;    // espaço abaixo do primeiro degrau

// Alternância X: índice 0 = degrau mais baixo (Salmo 1)
const X_RIGHT = AREA_WIDTH * 0.84;
const X_LEFT  = AREA_WIDTH * 0.16;
const getX = (index: number) => (index % 2 === 0 ? X_RIGHT : X_LEFT);



// ─── Degrau individual ────────────────────────────────────────────────────────
function PsalmStep({ psalm, onOpenModal }: { psalm: PsalmNode; onOpenModal: (psalm: PsalmNode) => void }) {
  const isActive    = psalm.status === "active";
  const isCompleted = psalm.status === "completed";
  const isLocked = psalm.status === "locked";

  const size      = isActive ? STEP_SIZE_ACT : STEP_SIZE;
  const bg        = isCompleted ? "#22c55e" : isActive ? "#1D5C4A" : "#E2E0DB";
  const iconColor = isCompleted || isActive ? "#ffffff" : "#B0ADA8";
  const shadow    = isCompleted || isActive
    ? "0 8px 0 rgba(0,0,0,0.22), 0 2px 10px rgba(0,0,0,0.12)"
    : "0 6px 0 #C4C0B8, 0 2px 6px rgba(0,0,0,0.07)";

  // Arco de progresso
  const R     = (size / 2) + 4;
  const circ  = 2 * Math.PI * R;
  const dash  = circ - (circ * psalm.progress) / 100;
  const ring  = size + 16;

  return (
    <button
      onClick={() => !isLocked && onOpenModal(psalm)}
      disabled={isLocked}
      className="cursor-pointer hover:scale-110 active:scale-95 transition-transform disabled:cursor-not-allowed"
      style={{ position: "relative", width: ring, height: ring, display: "flex", alignItems: "center", justifyContent: "center", border: "none", background: "none", padding: 0 }}
    >
      {/* Arco de progresso */}
      {isActive && (
        <svg
          width={ring} height={ring}
          viewBox={`0 0 ${ring} ${ring}`}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <circle cx={ring / 2} cy={ring / 2} r={R}
            fill="none" stroke="#D4D0C8" strokeWidth="4" />
          <circle cx={ring / 2} cy={ring / 2} r={R}
            fill="none" stroke="#22c55e" strokeWidth="4"
            strokeDasharray={circ} strokeDashoffset={dash}
            strokeLinecap="round"
            style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
          />
        </svg>
      )}

      {/* Círculo principal */}
      <div style={{
        width: size, height: size, borderRadius: "50%",
        backgroundColor: bg, boxShadow: shadow,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", zIndex: 2,
      }}>
        
      </div>
    </button>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function PsalmModal({ 
  psalm, 
  onClose 
}: { 
  psalm: PsalmNode | null; 
  onClose: () => void 
}) {
  if (!psalm) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", animation: "fadeIn 0.3s ease-in-out" }}
      onClick={onClose}
    >
      <div
        className="relative rounded-3xl px-8 py-8 flex flex-col items-center gap-6 max-w-sm mx-4 shadow-2xl"
        style={{ backgroundColor: "#2B5FA6" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fechar modal */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:opacity-80 transition-opacity"
          style={{ fontSize: "24px", background: "none", border: "none", cursor: "pointer" }}
        >
          ✕
        </button>

        {/* Ícone do livro no topo */}
        <div
          className="rounded-full flex items-center justify-center"
          style={{ width: 64, height: 64, backgroundColor: "#1D5C4A" }}
        >
          
        </div>

        {/* Título */}
        <div className="text-center">
          <h2 className="text-white font-black text-3xl mb-2">
            {psalm.label}
          </h2>
          <p className="text-blue-100 font-medium text-sm">
            Passo {psalm.currentStep} de {PSALM_TOTAL_STEPS}
          </p>        </div>

        {/* Botão Continuar */} 
        <button
          onClick={onClose}
          className="w-full rounded-2xl px-6 py-3 font-bold text-base text-stone-800 active:scale-95 transition-transform"
          style={{ backgroundColor: "#F2EDE4" }}
        >
          Continuar
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────
export default function HomePage() {
  const { loading, error, profile, psalms, refetch } = useHomeData();
  const [selectedPsalm, setSelectedPsalm] = useState<PsalmNode | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const activePsalm = psalms.find((p) => p.status === "active") ?? psalms[0];

  const handleOpenModal = (psalm: PsalmNode) => {
    setSelectedPsalm(psalm);
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
    console.log("HOME RENDERIZOU"),
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
          className="w-full rounded-2xl px-6 py-5 flex items-center justify-between active:scale-95 transition-transform"
          style={{ backgroundColor: "#E8A920", boxShadow: "0 6px 0 #B07A10" }}
        >
          <div className="flex flex-col items-start gap-2">
            <span className="text-stone-900 font-black text-xl tracking-widest">
              {activePsalm.label.toUpperCase()}
            </span>
            <div
              className="rounded-full overflow-hidden"
              style={{ width: 160, height: 10, backgroundColor: "rgba(0,0,0,0.15)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${activePsalm.progress}%`, backgroundColor: "#22c55e" }}
              />
            </div>
          </div>
          <span className="text-stone-900 font-black text-4xl tabular-nums">
            {activePsalm.progress}
            <span className="text-2xl">%</span>
          </span>
        </button>
      </div>

      {/* ── Modal ──────────────────────────────────────────────────────── */}
      <PsalmModal psalm={selectedPsalm} onClose={handleCloseModal} />
    </main>
  );
}

// ─── Avatar da ovelha ────────────────────────────────────────────────────────
function SheepAvatar() {
  return (
    <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <circle cx="26" cy="23" r="16" fill="#F0EDE8" />
      <circle cx="14" cy="20" r="8"  fill="#F0EDE8" />
      <circle cx="38" cy="20" r="8"  fill="#F0EDE8" />
      <circle cx="20" cy="14" r="7"  fill="#F0EDE8" />
      <circle cx="32" cy="14" r="7"  fill="#F0EDE8" />
      <circle cx="26" cy="12" r="6"  fill="#F0EDE8" />
      <ellipse cx="26" cy="30" rx="11" ry="10" fill="#D8C9B0" />
      <circle cx="22" cy="28" r="2.2" fill="#2A1A0A" />
      <circle cx="30" cy="28" r="2.2" fill="#2A1A0A" />
      <circle cx="22.8" cy="27.2" r="0.8" fill="white" />
      <circle cx="30.8" cy="27.2" r="0.8" fill="white" />
      <ellipse cx="26" cy="32" rx="3" ry="2" fill="#C4A882" />
      <path d="M23 34.5 Q26 37 29 34.5" stroke="#8B6040" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      <path d="M15 38 Q26 42 37 38 Q37 44 26 44 Q15 44 15 38Z" fill="#2B5FA6" />
      <path d="M15 38 Q26 41 37 38" stroke="#1E4A8A" strokeWidth="1" fill="none"/>
      <circle cx="26" cy="44" r="3.5" fill="#C9A227" />
      <circle cx="26" cy="44" r="2"   fill="#E8C040" />
    </svg>
  );
}