"use client";

import { useState } from "react";

// Dados dos salmos — em produção viriam do banco
const PSALMS = [
  { id: 1, label: "Salmo 1", status: "active" as const, progress: 10 },
  { id: 2, label: "Salmo 2", status: "locked" as const, progress: 0 },
  { id: 3, label: "Salmo 3", status: "locked" as const, progress: 0 },
  { id: 4, label: "Salmo 4", status: "locked" as const, progress: 0 },
  { id: 5, label: "Salmo 5", status: "locked" as const, progress: 0 },
  { id: 6, label: "Salmo 6", status: "locked" as const, progress: 0 },
];

type PsalmStatus = "completed" | "active" | "locked";

interface StepNode {
  id: number;
  label: string;
  status: PsalmStatus;
  progress: number;
}

// Posições em zigue-zague para a escada espiritual
// side: "left" | "right" = qual lado da tela
const POSITIONS: Array<{ side: "left" | "right"; offsetX: number }> = [
  { side: "right", offsetX: 60 },
  { side: "right", offsetX: 30 },
  { side: "right", offsetX: 15 },
  { side: "right", offsetX: 5 },
  { side: "left", offsetX: 10 },
  { side: "left", offsetX: 25 },
];

function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 6.5C10.5 5 8.5 4 6 4v14c2.5 0 4.5 1 6 2.5C13.5 19 15.5 18 18 18V4c-2.5 0-4.5 1-6 2.5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 6.5v14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="9" y="2" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M5 10a7 7 0 0 0 14 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="3" y="4" width="18" height="17" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M3 9h18" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function GemIcon({ className }: { className?: string }) {
  return (
    <span className={className}>💎</span>
    
  );
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" fill="currentColor" />
    </svg>
  );
}

function DavidMascot() {
  return (
    <div className="relative w-48 h-64 select-none pointer-events-none">
      {/* Corpo do Rei Davi como SVG estilizado */}
      <svg viewBox="0 0 200 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-xl">
        {/* Grama / base */}
        <ellipse cx="100" cy="268" rx="70" ry="10" fill="#8B9E6B" opacity="0.4" />
        <path d="M60 265 Q65 248 70 255 Q75 242 80 258 Q85 245 90 260" stroke="#6B8050" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M115 260 Q120 245 125 255 Q130 240 135 258 Q140 248 145 262" stroke="#6B8050" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

        {/* Sandálias */}
        <ellipse cx="85" cy="264" rx="14" ry="6" fill="#8B6914" />
        <ellipse cx="115" cy="264" rx="14" ry="6" fill="#8B6914" />
        <rect x="78" y="248" width="14" height="18" rx="3" fill="#A07820" />
        <rect x="108" y="248" width="14" height="18" rx="3" fill="#A07820" />

        {/* Roupa — manto azul */}
        <path d="M55 160 Q35 200 40 264 L85 264 L85 200 Z" fill="#2B4C7E" />
        <path d="M145 160 Q165 200 160 264 L115 264 L115 200 Z" fill="#2B4C7E" />
        {/* Dobras do manto */}
        <path d="M55 160 Q50 190 45 220" stroke="#1E3A6E" strokeWidth="2" fill="none"/>
        <path d="M145 160 Q150 190 155 220" stroke="#1E3A6E" strokeWidth="2" fill="none"/>

        {/* Veste clara */}
        <rect x="82" y="155" width="36" height="115" rx="4" fill="#E8D89A" />
        <rect x="82" y="155" width="36" height="115" rx="4" fill="url(#vesteFold)" opacity="0.3"/>
        {/* Barra dourada */}
        <rect x="82" y="228" width="36" height="12" rx="2" fill="#C9A227" />

        {/* Broche */}
        <circle cx="100" cy="165" r="5" fill="#C9A227" />
        <circle cx="100" cy="165" r="3" fill="#E8C040" />

        {/* Harpa */}
        <g transform="translate(115, 175)">
          <path d="M5 0 Q30 10 25 55" stroke="#8B6914" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M5 0 L5 55" stroke="#8B6914" strokeWidth="3" fill="none" strokeLinecap="round"/>
          <path d="M5 55 Q15 60 25 55" stroke="#8B6914" strokeWidth="3" fill="none" strokeLinecap="round"/>
          {[10, 18, 26, 34, 42].map((y, i) => (
            <line key={i} x1="5" y1={y} x2={22 - i * 1.5} y2={y + 1} stroke="#C9A227" strokeWidth="1.2" strokeLinecap="round"/>
          ))}
        </g>

        {/* Braços */}
        <path d="M82 165 Q60 180 65 205" stroke="#D4A96A" strokeWidth="14" strokeLinecap="round" fill="none"/>
        <path d="M118 165 Q140 178 132 200" stroke="#D4A96A" strokeWidth="14" strokeLinecap="round" fill="none"/>
        {/* Mãos */}
        <ellipse cx="65" cy="207" rx="9" ry="8" fill="#D4A96A" />
        <ellipse cx="132" cy="201" rx="9" ry="8" fill="#D4A96A" />

        {/* Pescoço */}
        <rect x="92" y="133" width="16" height="25" rx="4" fill="#D4A96A" />

        {/* Rosto */}
        <ellipse cx="100" cy="118" rx="30" ry="34" fill="#D4A96A" />

        {/* Cabelo ruivo */}
        <path d="M70 108 Q72 75 100 72 Q128 75 130 108" fill="#8B3A1A" />
        <path d="M70 108 Q65 90 68 78 Q72 68 80 65 Q90 60 100 62 Q110 60 120 65 Q128 68 132 78 Q135 90 130 108" fill="#A04020" />
        {/* Cachos laterais */}
        <path d="M70 108 Q60 115 62 128 Q66 138 72 135" fill="#A04020" />
        <path d="M130 108 Q140 115 138 128 Q134 138 128 135" fill="#A04020" />

        {/* Barba */}
        <path d="M76 130 Q75 152 100 158 Q125 152 124 130 Q112 140 100 141 Q88 140 76 130Z" fill="#7A2E10" />
        <path d="M80 138 Q78 148 84 153" stroke="#5A200A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M100 141 Q100 152 100 157" stroke="#5A200A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <path d="M120 138 Q122 148 116 153" stroke="#5A200A" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

        {/* Olhos */}
        <ellipse cx="88" cy="112" rx="6" ry="6.5" fill="white" />
        <ellipse cx="112" cy="112" rx="6" ry="6.5" fill="white" />
        <ellipse cx="89" cy="113" rx="3.5" ry="3.8" fill="#3D2008" />
        <ellipse cx="113" cy="113" rx="3.5" ry="3.8" fill="#3D2008" />
        {/* Brilho nos olhos */}
        <circle cx="91" cy="111" r="1.2" fill="white" />
        <circle cx="115" cy="111" r="1.2" fill="white" />

        {/* Sobrancelhas */}
        <path d="M82 104 Q88 100 94 103" stroke="#5A200A" strokeWidth="2.2" fill="none" strokeLinecap="round"/>
        <path d="M106 103 Q112 100 118 104" stroke="#5A200A" strokeWidth="2.2" fill="none" strokeLinecap="round"/>

        {/* Nariz */}
        <path d="M97 115 Q95 122 97 126 Q100 128 103 126 Q105 122 103 115" stroke="#C07838" strokeWidth="1.5" fill="none"/>

        {/* Sorriso */}
        <path d="M88 132 Q100 140 112 132" stroke="#8B3A10" strokeWidth="2" fill="none" strokeLinecap="round"/>

        {/* Coroa */}
        <path d="M72 88 L72 72 L80 82 L88 68 L100 78 L112 68 L120 82 L128 72 L128 88 Z" fill="#C9A227" />
        <path d="M72 88 L128 88" stroke="#A07820" strokeWidth="1.5" />
        {/* Joias da coroa */}
        <circle cx="88" cy="78" r="4" fill="#1E90FF" />
        <circle cx="100" cy="82" r="4" fill="#DC143C" />
        <circle cx="112" cy="78" r="4" fill="#1E90FF" />

        {/* Gradiente veste */}
        <defs>
          <linearGradient id="vesteFold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#000" stopOpacity="0.3"/>
            <stop offset="40%" stopColor="#fff" stopOpacity="0.1"/>
            <stop offset="100%" stopColor="#000" stopOpacity="0.2"/>
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function PsalmStep({ psalm, position, isLast }: { psalm: StepNode; position: typeof POSITIONS[0]; isLast: boolean }) {
  const isActive = psalm.status === "active";
  const isCompleted = psalm.status === "completed";
  const isLocked = psalm.status === "locked";

  const baseX = position.side === "right"
    ? `calc(50% + ${position.offsetX}px)`
    : `calc(50% - ${position.offsetX + 48}px)`;

  const bgColor = isCompleted
    ? "bg-emerald-500"
    : isActive
    ? "bg-emerald-700"
    : "bg-stone-200";

  const iconColor = isCompleted || isActive ? "text-white" : "text-stone-400";
  const ringColor = isActive ? "ring-4 ring-emerald-300/60" : "";

  // Ícone do microfone para o penúltimo salmo (simulando)
  const showMic = isLast && isLocked;

  return (
    <div
      style={{ left: baseX }}
      className={`absolute flex items-center justify-center rounded-full shadow-md transition-all duration-300
        ${isActive ? "w-20 h-20" : "w-16 h-16"}
        ${bgColor} ${ringColor}
      `}
    >
      {showMic ? (
        <MicIcon className={`w-7 h-7 ${iconColor}`} />
      ) : (
        <BookIcon className={`${isActive ? "w-9 h-9" : "w-7 h-7"} ${iconColor}`} />
      )}

      {/* Arco de progresso no salmo ativo */}
      {isActive && (
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" stroke="#86efac" strokeWidth="4" strokeDasharray="226" strokeDashoffset="0" opacity="0.3"/>
          <circle cx="40" cy="40" r="36" fill="none" stroke="#16a34a" strokeWidth="4"
            strokeDasharray="226"
            strokeDashoffset={226 - (226 * psalm.progress) / 100}
            strokeLinecap="round"
          />
        </svg>
      )}
    </div>
  );
}

export default function HomePage() {
  const [streak] = useState(1);
  const [gems] = useState(10);
  const [hearts] = useState(5);

  const activePsalm = PSALMS.find(p => p.status === "active") ?? PSALMS[0];

  // Alturas de cada degrau (de baixo para cima), em px
  const stepHeights = [460, 360, 275, 200, 135, 80];

  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundColor: "#F2EDE4" }}>

      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-12 pb-4">
        {/* Streak */}
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-7 h-7 text-stone-600" />
          <span className="font-bold text-stone-700 text-lg">{streak}</span>
        </div>

        {/* Gemas */}
        <div className="flex items-center gap-2">
          <GemIcon className="w-7 h-7 text-blue-500" />
          <span className="font-bold text-stone-700 text-lg">{gems}</span>
        </div>

        {/* Corações / Vidas */}
        <div className="flex items-center gap-2 bg-stone-800 rounded-xl px-3 py-1.5">
          <BoltIcon className="w-5 h-5 text-yellow-300" />
          <span className="font-bold text-white text-lg">{hearts}</span>
        </div>
      </header>

      {/* Área da escada espiritual */}
      <div className="flex-1 relative overflow-hidden" style={{ minHeight: 540 }}>

        {/* Mascote Rei Davi — fixado à esquerda */}
        <div className="absolute bottom-4 left-0" style={{ zIndex: 10 }}>
          <DavidMascot />
        </div>

        {/* Degraus dos salmos */}
        {PSALMS.map((psalm, index) => (
          <div
            key={psalm.id}
            className="absolute"
            style={{
              bottom: stepHeights[index],
              left: 0,
              right: 0,
              zIndex: 5,
            }}
          >
            <PsalmStep
              psalm={psalm}
              position={POSITIONS[index]}
              isLast={index === PSALMS.length - 2}
            />
          </div>
        ))}
      </div>

      {/* Barra de progresso inferior — CTA */}
      <div className="px-4 pb-10">
        <button
          className="w-full rounded-2xl px-6 py-5 flex items-center justify-between shadow-lg active:scale-95 transition-transform"
          style={{ backgroundColor: "#E8A920", boxShadow: "0 6px 0 #B07A10" }}
        >
          <div className="flex flex-col items-start gap-1.5">
            <span
              className="text-stone-900 font-black text-xl tracking-wider"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {activePsalm.label.toUpperCase()}
            </span>
            <div className="w-40 h-2.5 bg-stone-800/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${activePsalm.progress}%` }}
              />
            </div>
          </div>
          <span
            className="text-stone-900 font-black text-4xl tabular-nums"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {activePsalm.progress}
            <span className="text-2xl">%</span>
          </span>
        </button>
      </div>
    </main>
  );
}