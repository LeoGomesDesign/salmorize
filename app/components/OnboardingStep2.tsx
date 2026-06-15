'use client';

import HeaderBackButton from './HeaderBackButton';
import Image from 'next/image';

import { useOnboarding } from '../context/OnboardingContext';
import { useState, useEffect, useRef } from 'react';
import { createClient } from "@/lib/supabase/client";




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

// Full phrase: "Salmo 1: Os dois caminhos do Homem"
// Blanks: positions for "do" and "Homem"
const PHRASE_SLOTS: WordSlot[] = [
  { id: 1, word: "Salmo",    isBlank: false },
  { id: 2, word: "1:",       isBlank: false },
  { id: 3, word: "Os",       isBlank: false },
  { id: 4, word: "dois",     isBlank: false },
  { id: 5, word: "caminhos", isBlank: false },
  { id: 6, word: "do",       isBlank: true  },
  { id: 7, word: "Homem",    isBlank: true  },
];
 
const INITIAL_OPTIONS: WordOption[] = [
  { id: 1, word: "dos",    selected: false },
  { id: 2, word: "do",     selected: false },
  { id: 3, word: "menino", selected: false },
  { id: 4, word: "Homem",  selected: false },
];

// ─── Sub-components ──────────────────────────────────────────────────────────
 

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

function DavidSpeechBubble({
  visible,
  audioRef,
  onPlay,
}: {
  visible: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  onPlay: () => void;
}) {
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        transitionDelay: visible ? "0.6s" : "0s",
      }}
      className="absolute -bottom-4.5 -right-20 z-10"
    >
      <button
        type="button"
        onClick={onPlay}
        className="relative bg-white rounded-2xl px-4 py-2 shadow-lg flex items-center gap-1"
      >
        <span style={{ fontSize: 18 }}>🔊</span>
        <span
          className="text-xs font-medium"
          style={{ color: "#6B6B6B", fontFamily: "var(--font-montserrat)" }}
        >
          Escutar novamente
        </span>
      </button>
      <audio ref={audioRef} src="/audio/Salmo1Onboarding.mp3" preload="auto" />
    </div>
  );
}

function SuccessModal({
  visible,
  onContinue,
}: {
  visible: boolean;
  onContinue: () => void;
}) {
  if (!visible) return null;

  return (  
    <div className= "w-lg px-6 pt-4"
      style={{
        position: "fixed",
        bottom: 0,
        backgroundColor: "#CBFFB8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <h2
        className="text-align-left w-full mb-4"
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#141414",
          fontFamily: "var(--font-domine)",
          
        }}
      >
        Correto!
      </h2>
      <button
        onClick={onContinue}
        className="btn btn-success mb-16"
        style={{
          fontSize: 18,
          fontWeight: 700,
          paddingLeft: 40,
          paddingRight: 40,
          paddingTop: 16,
          paddingBottom: 16,
          borderRadius: 16,
        }}
      >
        Continuar
      </button>
    </div>
  );
}

function RewardModal({
  visible,
 
  errorMessage,
}: {
  visible: boolean;
  onGoogleContinue: () => void;
  loading: boolean;
  errorMessage: string | null;
}) {
  const [showDavi, setShowDavi] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleLogin = async () => {
    setLoading(true);

    try {
      const supabase = createClient();

      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!visible) return;
    setShowDavi(false);
    const timer = setTimeout(() => setShowDavi(true), 250);
    return () => clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(2,2,2,0.6)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        transition: "opacity 0.3s ease",
        
        zIndex: 60,
      }}
    >
      <div
        className="bg-app pt-10"
        style={{
          
          width: "100%",
          maxWidth: 380,
          borderRadius: 16,
          height: 320,
          padding: 32,
          boxShadow: "0 24px 72px rgba(0,0,0,0.18)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transition: "opacity 0.5s ease, transform 0.7s ease",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            left: 0,
            right: 0,
            opacity: showDavi ? 1 : 0,
            transform: showDavi ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.35s ease 0.2s, transform 0.35s ease 0.s",
            display: "flex",
            justifyContent: "center",
            
          }}
        >
          <Image
            src="/img/daviCelebrateModal.png"
            alt="Davi"
            width={205}
            height={218}
          />
        </div>

        <div style={{ textAlign: "center" }}>
          <div
            style={{
             
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              
            }}
          >

            <span
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: "#1CB0F6",
              }}
            >
              10
            </span>

            <span
              style={{
                fontSize: 40,
            }}
            >
              💎
            </span>
            
          </div>

          <h3
            style={{
              fontFamily: "var(--font-domine)",
              fontSize: 24,
              fontWeight: 700,
              color: "#141414",
              marginBottom: 10,
            }}
          >
            Você ganhou 10 cristais!
          </h3>
          <p
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: 14,
              color: "#6B6B6B",
              lineHeight: 1.6,
              marginBottom: 24,
            }}
          >
            Salve seu progresso criando uma conta com seu email google
          </p>

          <button
                onClick={handleLogin}
                className="btn btn-secondary w-full gap-2"
                disabled={loading}
                style={{ opacity: loading ? 0.75 : 1 }}
              >
                <Image src="/img/GoogleLogo.png" alt="Google" width={20} height={20} />
                {loading ? "Conectando..." : "Continuar com Google"}
              </button>
       
          {errorMessage ? (
            <p
              style={{
                marginTop: 14,
                fontSize: 14,
                color: '#D64545',
                fontFamily: 'var(--font-montserrat)',
              }}
            >
              {errorMessage}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function FailureModal({
  visible,
  onRetry,
}: {
  visible: boolean;
  onRetry: () => void;
}) {
  if (!visible) return null;

  return (
    <div className="w-full px-6 pt-4"
      style={{
        position: "fixed",
        bottom: 0,
        backgroundColor: "#F8BEC4",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      <h2
        className="w-full "
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "#141414",
          fontFamily: "var(--font-domine)",
        }}
      >
        Algo está errado!
      </h2>
      <p
        className="w-full mb-6"
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: "#141414",
          fontFamily: "var(--font-montserrat)",
        }}
      >
        Verifique as palavras escolhidas
      </p>
      <button
        onClick={onRetry}
        className="btn btn-fail w-full mb-16"
        style={{
          fontSize: 18,
          fontWeight: 700,
          paddingLeft: 40,
          paddingRight: 40,
          paddingTop: 16,
          paddingBottom: 16,
          borderRadius: 16,
        }}
      >
        Tente novamente
      </button>
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
  const { previousStep, nextStep, userProgress, completeStep } = useOnboarding();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);
 
  const [options, setOptions] = useState<WordOption[]>(INITIAL_OPTIONS);
  const [answers, setAnswers] = useState<(string | null)[]>([null, null]);
 
  useEffect(() => {
    const t = setTimeout(() => setBubbleVisible(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const audioTimer = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          // autoplay may be blocked until user interaction
        });
      }
    }, 200);

    return () => clearTimeout(audioTimer);
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
    if (isCorrect) {
      completeStep(2);
      setShowSuccess(true);
    } else {
      setShowFailure(true);
    }
  }
 
  return (
    <>
      <SuccessModal
        visible={showSuccess}
        onContinue={() => {
          setShowSuccess(false);
          setShowRewardModal(true);
        }}
      />
    
      <RewardModal
        visible={showRewardModal}
        onGoogleContinue={() => {
          setGoogleLoading(true);
          setGoogleError(null);
        }}
        loading={googleLoading}
        errorMessage={googleError}
      />
      <FailureModal
        visible={showFailure}
        onRetry={() => {
          setShowFailure(false);
        }}
      />
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

          {/* Speech bubble */}
          <DavidSpeechBubble
            visible={bubbleVisible}
            audioRef={audioRef}
            onPlay={() => {
              if (audioRef.current) {
                audioRef.current.play().catch(() => {
                  // browser may block play until interaction
                });
              }
            }}
          />
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
            fontSize: 16,
            fontWeight: 400,
            color: "#6B6B6B",
            
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
      <div className="px-6 pb-16 pt-4">
        <button
          className={`btn ${canVerify ? 'btn-primary' : ''} w-full`}
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
            ...(canVerify
              ? {}
              : {
                  background: "#c8c8c8",
                  color: "#888888",
                  boxShadow: "none",
                }),
            transition: "all 0.25s ease",
            transform: canVerify ? "scale(1)" : "scale(0.99)",
          }}
        >
          Verificar
        </button>
      </div>
    </div>
    </>
  );
}