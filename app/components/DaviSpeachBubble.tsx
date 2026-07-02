'use client';

import React from 'react';

interface DavidSpeechBubbleProps {
  visible: boolean;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  onPlay: () => void;
  audioSrc: string; // <-- Nova propriedade para mudar o áudio em cada página
}


export default function DavidSpeechBubble({
  visible,
  audioRef,
  onPlay,
  audioSrc,
}: DavidSpeechBubbleProps) {

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        transitionDelay: visible ? "0.6s" : "0s",
      }}
      
    >
      <button
        type="button"
        onClick={onPlay}
        className="relative bg-white rounded-2xl px-4 py-2 shadow-lg flex items-center gap-1 cursor-pointer"
      >
        <span style={{ fontSize: 18 }}>🔊</span>
        <span
          className="text-xs font-medium"
          style={{ color: "#6B6B6B", fontFamily: "var(--font-montserrat)" }}
        >
          Escutar novamente
        </span>
      </button>
       {/* O src agora recebe a variável dinâmica passada pela página */}
      <audio ref={audioRef} src={audioSrc} preload="auto" />
    </div>
  );
}
