'use client';

import HeaderBackButton from './HeaderBackButton';
import Image from 'next/image';
import { useOnboarding } from '../context/OnboardingContext';
import { useState, useEffect } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────
 
type WordSlot = {
  id: number;
  word: string;
  isBlank: boolean;
};
 
type WordOption = {
  id: number;
  word: string;
  selected: boolean;
};

// Full phrase: "Os dois caminhos do Homem"
// Blanks: positions for "do" and "Homem"
const PHRASE_SLOTS: WordSlot[] = [
  { id: 1, word: "Os",       isBlank: false },
  { id: 2, word: "dois",     isBlank: false },
  { id: 3, word: "caminhos", isBlank: false },
  { id: 4, word: "do",       isBlank: true  },
  { id: 5, word: "Homem",    isBlank: true  },
];
 
const INITIAL_OPTIONS: WordOption[] = [
  { id: 1, word: "da",     selected: false },
  { id: 2, word: "do",     selected: false },
  { id: 3, word: "menino", selected: false },
  { id: 4, word: "Homem",  selected: false },
];

// ─── Sub-components ──────────────────────────────────────────────────────────
 
function DavidSpeechBubble({ visible }: { visible: boolean }) {
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        transitionDelay: visible ? "0.6s" : "0s",
      }}
      className="absolute -bottom-4.5 -right-20 z-10"
    >
      <div
        className="relative bg-white rounded-2xl px-5 py-4 shadow-lg"
        style={{ minWidth: 220, maxWidth: 260 }}
      >
        {/* Tail pointing left toward David */}
        <div
          className="absolute -left-2.5 top-5"
          style={{
            width: 0,
            height: 0,
            borderTop: "8px solid transparent",
            borderBottom: "8px solid transparent",
            borderRight: "12px solid white",
          }}
        />

                {/* Audio indicator */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1">
            <span style={{ fontSize: 18 }}>🔊</span>
            <span
              className="text-xs font-medium"
              style={{ color: "#6B6B6B", fontFamily: "var(--font-montserrat)" }}
            >
              Escute a frase novamente
            </span>
          </div>
        </div>
         {/* Phrase with blanks shown */}
        <p
          className="font-bold leading-snug"
          style={{
            fontFamily: "var(--font-domine)",
            fontSize: 17,
            color: "#141414",
            letterSpacing: "-0.01em",
          }}
        >
          Os dois caminhos
        </p>
 
        {/* Two blank lines */}
        <div className="mt-2 space-y-1">
          <div
            className="h-0.5 rounded-full"
            style={{ background: "#c8c8c8", width: "80%" }}
          />
          <div
            className="h-0.5 rounded-full"
            style={{ background: "#c8c8c8", width: "55%" }}
          />
        </div>
      </div>
    </div>
  );
}
function PhraseField({ slots, answers }: { slots: WordSlot[]; answers: (string | null)[] }) {
  // answers[0] → first blank, answers[1] → second blank
  let blankIndex = 0;
 
  return (
    <div
      className="flex flex-wrap items-center gap-x-2 gap-y-3 px-1"
      style={{ lineHeight: 1.6 }}
    >
      {slots.map((slot) => {
        if (!slot.isBlank) {
          return (
            <span
              key={slot.id}
              className="text-xl font-bold"
              style={{ fontFamily: "var(--font-domine)", color: "#141414" }}
            >
              {slot.word}
            </span>
          );
        }
 
        const currentIndex = blankIndex++;
        const filled = answers[currentIndex];
 
        return (
          <span
            key={slot.id}
            className="inline-flex items-end justify-center text-xl font-bold"
            style={{
              fontFamily: "var(--font-domine)",
              minWidth: 80,
              borderBottom: filled ? "2.5px solid #141414" : "2.5px solid #a8a8a8",
              color: filled ? "#141414" : "transparent",
              paddingBottom: 2,
              transition: "border-color 0.2s ease",
            }}
          >
            {filled ?? "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
          </span>
        );
      })}
    </div>
  );
}
 
function WordChip({
  word,
  selected,
  onClick,
}: {
  word: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "var(--font-montserrat)",
        fontWeight: 600,
        fontSize: 15,
        padding: "10px 20px",
        borderRadius: 14,
        border: selected ? "2px solid #141414" : "2px solid #e0e0e0",
        background: selected ? "#141414" : "#ffffff",
        color: selected ? "#ffffff" : "#2a2a2a",
        cursor: "pointer",
        transition: "all 0.18s ease",
        transform: selected ? "scale(0.97)" : "scale(1)",
        boxShadow: selected ? "none" : "0 1px 4px rgba(0,0,0,0.08)",
      }}
    >
      {word}
    </button>
  );
}
 
// ─── Main Screen ─────────────────────────────────────────────────────────────
 
export default function OnboardingStep2() {
  const { previousStep } = useOnboarding();
  const [mounted, setMounted] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [options, setOptions] = useState<WordOption[]>(INITIAL_OPTIONS);
  const [answers, setAnswers] = useState<(string | null)[]>([null, null]);
 
  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setBubbleVisible(true), 400);
    return () => clearTimeout(t);
  }, []);
 
  const blanks = PHRASE_SLOTS.filter((s) => s.isBlank);
  const correctWords = blanks.map((s) => s.word); // ["do", "Homem"]
 
  const canVerify = answers.every((a) => a !== null);
 
  function handleOptionClick(optionId: number) {
    const opt = options.find((o) => o.id === optionId);
    if (!opt) return;
 
    if (opt.selected) {
      // Deselect: remove from answers
      const wordIndex = answers.indexOf(opt.word);
      if (wordIndex !== -1) {
        const newAnswers = [...answers];
        newAnswers[wordIndex] = null;
        setAnswers(newAnswers);
      }
      setOptions(options.map((o) => (o.id === optionId ? { ...o, selected: false } : o)));
      return;
    }
 
    // Find first empty slot
    const firstEmpty = answers.findIndex((a) => a === null);
    if (firstEmpty === -1) return; // all slots filled
 
    const newAnswers = [...answers];
    newAnswers[firstEmpty] = opt.word;
    setAnswers(newAnswers);
    setOptions(options.map((o) => (o.id === optionId ? { ...o, selected: true } : o)));
  }
 
  function handleVerify() {
    const isCorrect = answers.every((a, i) => a === correctWords[i]);
    alert(isCorrect ? "✅ Correto! Muito bem!" : "❌ Tente novamente.");
  }
 
  return (
    <div
      className="min-h-screen flex flex-col bg-app"
      style={{ maxWidth: 430, margin: "0 auto" }}
    >
      {/* ── Header ── */}
      <div className="flex items-center px-5 pt-12 pb-2">
        <HeaderBackButton onClick={previousStep}>
        Voltar
        </HeaderBackButton>
      </div>
 
      {/* ── Title ── */}
      <div className="px-6 pt-4 pb-2">
        <h1
          className="font-bold leading-tight text-gray-9"
          style={{
            fontFamily: "var(--font-domine)",
            fontSize: 24,
            
            marginBottom: 4,
          }}
        >
          Vamos começar!
        </h1>
        <p
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: 14,
            color: "#6B6B6B",
            fontWeight: 500,
          }}
        >
          Complete a frase conforme você ouviu
        </p>
      </div>
 
      {/* ── David + Bubble ── */}
      <div className="px-6 pt-4 pb-6">
        <div className="relative" style={{ width: 200 }}>
          {/* David illustration placeholder */}
          <Image
            src="/img/DaviSpeaking.png"
            alt="David"
            width={200}
            height={260}
          />

          {/* Speech bubble 
          <DavidSpeechBubble visible={bubbleVisible} />
          */}
        </div>
      </div>
 
      
 
      {/* ── Phrase Field ── */}
      <div className="px-6 pt-6 pb-4">
        <div
          className="rounded-2xl p-5"
          style={{
            background: "#ffffff",
            border: "1.5px solid #e0e0e0",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          }}
        >
          <PhraseField slots={PHRASE_SLOTS} answers={answers} />
        </div>
      </div>
 
      {/* ── Word Options ── */}
      <div className="px-6 pt-2 pb-4">
        <p
          className="mb-3"
          style={{
            fontFamily: "var(--font-montserrat)",
            fontSize: 13,
            fontWeight: 600,
            color: "#6B6B6B",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Selecione as palavras corretas:
        </p>
        <div className="flex flex-wrap gap-3">
          {options.map((opt) => (
            <WordChip
              key={opt.id}
              word={opt.word}
              selected={opt.selected}
              onClick={() => handleOptionClick(opt.id)}
            />
          ))}
        </div>
      </div>
 
      {/* ── Spacer ── */}
      <div className="flex-1" />
 
      {/* ── Verify Button ── */}
      <div className="px-6 pb-10 pt-4">
        <button
          onClick={handleVerify}
          disabled={!canVerify}
          style={{
            width: "100%",
            padding: "18px 0",
            borderRadius: 18,
            fontFamily: "var(--font-montserrat)",
            fontWeight: 700,
            fontSize: 16,
            letterSpacing: "0.02em",
            border: "none",
            cursor: canVerify ? "pointer" : "not-allowed",
            background: canVerify
              ? "linear-gradient(135deg, #2a2a2a 0%, #444444 100%)"
              : "#c8c8c8",
            color: canVerify ? "#ffffff" : "#888888",
            boxShadow: canVerify ? "0 4px 16px rgba(0,0,0,0.18)" : "none",
            transition: "all 0.25s ease",
            transform: canVerify ? "scale(1)" : "scale(0.99)",
          }}
        >
          Verificar
        </button>
      </div>
    </div>
  );
}