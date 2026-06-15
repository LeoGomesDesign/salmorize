"use client";

import { useRef, useEffect, useState } from "react";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type PsalmStatus = "completed" | "active" | "locked";

interface PsalmNode {
  id: number;
  label: string;
  status: PsalmStatus;
  progress: number;
}

interface SelectedPsalm {
  psalm: PsalmNode;
  index: number;
}

// ─── Dados (em produção viriam do Supabase) ───────────────────────────────────
const PSALMS: PsalmNode[] = [
  { id:  1, label: "Salmo 1",  status: "completed", progress: 100 },
  { id:  2, label: "Salmo 2",  status: "completed", progress: 100 },
  { id:  3, label: "Salmo 3",  status: "completed", progress: 100 },
  { id:  4, label: "Salmo 4",  status: "active",    progress: 10  },
  { id:  5, label: "Salmo 5",  status: "locked",    progress: 0   },
  { id:  6, label: "Salmo 6",  status: "locked",    progress: 0   },
  { id:  7, label: "Salmo 7",  status: "locked",    progress: 0   },
  { id:  8, label: "Salmo 8",  status: "locked",    progress: 0   },
  { id:  9, label: "Salmo 9",  status: "locked",    progress: 0   },
  { id: 10, label: "Salmo 10", status: "locked",    progress: 0   },
];

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

// ─── Íiro ─────────────────────────────────────────────────────────────
function BookOpenIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M2 6.5C2 6.5 5 5 8.5 5C10.5 5 12 6 12 6C12 6 13.5 5 16.5 5C20 5 22 6.5 22 6.5V19.5C22 19.5 20 18 16.5 18C13.5 18 12 19.5 12 19.5C12 19.5 10.5 18 8.5 18C5 18 2 19.5 2 19.5V6.5Z"
        stroke={color} strokeWidth="1.6" strokeLinejoin="round"
      />
      <path d="M12 6v13.5" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

// ─── Degrau individual ────────────────────────────────────────────────────────
function PsalmStep({ psalm, onOpenModal }: { psalm: PsalmNode; onOpenMModal: (psalm: PsalmNode) => void }) {
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
        <BookOpenIcon size={size * 0.42} color={iconColor} />
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
          <BookOpenIcon size={32} color="#ffffff" />
        </div>

        {/* Título */}
        <div className="text-center">
          <h2 className="text-white font-black text-3xl mb-2">
            {psalm.label}
          </h2>
          <p className="text-blue-100 font-medium text-sm">
            Passo 1 de 6
          </p>
        </div>

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
  const [streak]  = useState(1);
  const [gems]    = useState(10);
  const [energy]  = useState(12);
  const [selectedPsalm, setSelectedPsalm] = useState<PsalmNode | null>(null);
  const userName  = "Leonardo";

  const scrollRef = useRef<HTMLDivElement>(null);
  const activePsalm = PSALMS.find(p => p.status === "active") ?? PSALMS[0];
  const activeIndex = PSALMS.findIndex(p => p.status === "active");

  const handleOpenModal = (psalm: PsalmNode) => {
    setSelectedPsalm(psalm);
  };

  const handleCloseModal = () => {
    setSelectedPsalm(null);
  };

  // Altura total da área scrollável
  const totalHeight = PSALMS.length * STEP_HEIGHT + PADDING_TOP + PADDING_BOT;

  // Posição top de cada degrau (0 = Salmo 10 no topo, último = Salmo 1 na base)
  // Invertemos: índice 0 do PSALMS = mais baixo = maior top
  const getTop = (index: number) =>
    PADDING_TOP + (PSALMS.length - 1 - index) * STEP_HEIGHT;

  // Centro de cada degrau para a linha tracejada
  const stepCenterX = (index: number) => getX(index);
  const stepCenterY = (index: number) => getTop(index) + (STEP_SIZE_ACT / 2) + 8; // +8 = metade do anel

  // Scroll automático para o salmo ativo ao montar
  useEffect(() => {
    if (!scrollRef.current) return;
    const activeTop = getTop(activeIndex);
    const viewH = scrollRef.current.clientHeight;
    // Centraliza o degrau ativo na viewport do scroll
    scrollRef.current.scrollTop = activeTop - viewH / 2 + STEP_SIZE_ACT / 2;
  }, [activeIndex]);

  // Linha tracejada: um único SVG cobrindo toda a altura
  const renderDashedPath = () => {
    const points = PSALMS.map((_, i) => ({
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
            {PSALMS.map((psalm, index) => {
              const top  = getTop(index);
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