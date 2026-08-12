"use client";

type DavidSpeechBubbleProps = {
  visible: boolean;
  onPlay: () => void;
};

export default function DavidSpeechBubble({
  visible,
  onPlay,
}: DavidSpeechBubbleProps) {
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        transitionDelay: visible ? "0.6s" : "0s",
      }}
      className="absolute -bottom-4.5 z-1"
    >
      <button
        type="button"
        onClick={onPlay}
        className="relative bg-white rounded-2xl px-6 py-2 shadow-lg flex items-center gap-1 cursor-pointer"
      >
        <span style={{ fontSize: 18 }}>🔊</span>

        <span
          className="text-xs font-medium"
          style={{
            color: "#6B6B6B",
            fontFamily: "var(--font-montserrat)",
          }}
        >
          Escutar novamente
        </span>
      </button>
    </div>
  );
}