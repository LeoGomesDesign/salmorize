
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { createClient } from "@/lib/supabase/client";
import {
  fetchPsalmVerses,
  type PsalmVerse,
} from "@/lib/supabase/psalm-queries";

import type { PsalmNode } from "@/lib/types/home";

import SuccessModal from "@/app/features/game/modals/SuccessModal";
import FailureModal from "@/app/features/game/modals/FailureModal";

type CompletePsalmModalProps = {
  psalm: PsalmNode;
  onClose: () => void;
};

type MemorizationLine = {
  id: string;
  text: string;
  type: "title" | "verse";
};

export default function CompletePsalmModal({
  psalm,
  onClose,
}: CompletePsalmModalProps) {
  const [verses, setVerses] = useState<PsalmVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isVisible, setIsVisible] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [inputMode, setInputMode] = useState<"speaking" | "typing">("speaking");
  const [typedAnswer, setTypedAnswer] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  const recognitionRef = useRef<any>(null);

  // Indica se o microfone deve continuar automaticamente
  // para a próxima linha depois de um acerto.
  const continueRecordingRef = useRef(false);

  // ============================================================
  // CARREGAR VERSOS
  // ============================================================

  useEffect(() => {
    async function loadVerses() {
      try {
        setLoading(true);
        setError(null);

        const supabase = createClient();

        const data = await fetchPsalmVerses(
          supabase,
          psalm.id
        );

        setVerses(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Erro ao carregar o Salmo."
        );
      } finally {
        setLoading(false);
      }
    }

    loadVerses();
  }, [psalm.id]);

  // ============================================================
  // ORGANIZAÇÃO DAS LINHAS
  // ============================================================

  const orderedVerses = useMemo(() => {
    return [...verses].sort((a, b) => {
      if (a.stanzaPosition !== b.stanzaPosition) {
        return a.stanzaPosition - b.stanzaPosition;
      }

      return a.position - b.position;
    });
  }, [verses]);

  const lines = useMemo<MemorizationLine[]>(() => {
    return [
      {
        id: "title",
        text: psalm.label,
        type: "title",
      },
      ...orderedVerses.map((verse) => ({
        id: String(verse.id),
        text: verse.text,
        type: "verse" as const,
      })),
    ];
  }, [orderedVerses, psalm.label]);

  const currentLine = lines[currentIndex];

  // ============================================================
  // NORMALIZAÇÃO
  // ============================================================

  const normalizeText = (text: string) => {
    return text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  // ============================================================
  // VERIFICAÇÃO
  // ============================================================

  const verifyLine = useCallback(
    (spokenText: string) => {
      if (!currentLine) return;



      const targetWords = normalizeText(
        currentLine.text
      ).split(" ");

      const spokenWords = normalizeText(
        spokenText
      ).split(" ");

      let correct = 0;

      const usedIndexes = new Set<number>();

      for (const targetWord of targetWords) {
        const foundIndex = spokenWords.findIndex(
          (word, index) =>
            !usedIndexes.has(index) &&
            word === targetWord
        );

        if (foundIndex !== -1) {
          usedIndexes.add(foundIndex);
          correct++;
        }
      }

      const accuracy =
        targetWords.length > 0
          ? correct / targetWords.length
          : 0;

      const percentage = Math.round(
        accuracy * 100
      );

      console.log("Esperado:", targetWords);
      console.log("Falado:", spokenWords);
      console.log(`Acerto: ${percentage}%`);

      // ========================================================
      // ACERTO
      // ========================================================

      if (accuracy >= 0.7) {
        setTranscript("");

        // Última linha: encerra definitivamente.
        if (currentIndex === lines.length - 1) {
          continueRecordingRef.current = false;
          setIsRecording(false);
          setShowSuccess(true);
          return;
        }

        // Ainda existem linhas:
        // a próxima linha deverá iniciar automaticamente.
        continueRecordingRef.current = true;

        setCurrentIndex((index) => index + 1);

        return;
      }

      // ========================================================
      // ERRO
      // ========================================================

      // Errou: não continua automaticamente.
      continueRecordingRef.current = false;
      setIsRecording(false);

      setShowFailure(true);
    },
    [currentIndex, currentLine, lines.length]
  );

  const verifyTypedAnswer = () => {
  if (!currentLine) return;

  const targetWords = normalizeText(currentLine.text).split(" ");
  const typedWords = normalizeText(typedAnswer).split(" ");

  let correct = 0;

  const usedIndexes = new Set<number>();

  for (const targetWord of targetWords) {
    const foundIndex = typedWords.findIndex(
      (word, index) =>
        !usedIndexes.has(index) &&
        word === targetWord
    );

    if (foundIndex !== -1) {
      usedIndexes.add(foundIndex);
      correct++;
    }
  }

  const accuracy =
    targetWords.length > 0
      ? correct / targetWords.length
      : 0;

  if (accuracy >= 0.7) {
    setTypedAnswer("");

    if (currentIndex === lines.length - 1) {
      setShowSuccess(true);
      return;
    }

    setCurrentIndex((index) => index + 1);
    return;
  }

  setShowFailure(true);
};

  // ============================================================
  // RECONHECIMENTO DE VOZ
  // ============================================================

  useEffect(() => {
    if (!currentLine) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error(
        "Speech Recognition não suportado."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let currentTranscript = "";

      for (
        let i = 0;
        i < event.results.length;
        i++
      ) {
        currentTranscript +=
          event.results[i][0].transcript;
      }

      setTranscript(currentTranscript);

      console.log(
        "Texto reconhecido:",
        currentTranscript
      );

      const lastResult =
        event.results[event.results.length - 1];

      if (lastResult.isFinal) {
        verifyLine(currentTranscript);
      }
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.onerror = (event: any) => {
      console.error(
        "SpeechRecognition Error:",
        event.error
      );

      continueRecordingRef.current = false;

      switch (event.error) {
        case "not-allowed":
          alert(
            "Permissão do microfone negada."
          );
          break;

        case "audio-capture":
          alert(
            "Nenhum microfone encontrado."
          );
          break;

        case "network":
          alert("Erro de rede.");
          break;

        default:
          alert(`Erro: ${event.error}`);
      }

      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    // ========================================================
    // CONTINUAÇÃO AUTOMÁTICA
    //
    // Depois que uma linha é acertada, currentIndex muda.
    // O efeito é recriado para a nova linha e o reconhecimento
    // começa automaticamente.
    // ========================================================

    if (continueRecordingRef.current) {
      setTranscript("");
      setIsRecording(true);

      try {
        recognition.start();
      } catch (error) {
        console.error(
          "Erro ao continuar reconhecimento:",
          error
        );

        continueRecordingRef.current = false;
        setIsRecording(false);
      }
    }

    return () => {
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;

      try {
        recognition.stop();
      } catch {
        // O reconhecimento pode já ter sido encerrado.
      }
    };
  }, [currentIndex, currentLine, verifyLine]);

  // ============================================================
  // INICIAR / PARAR VOZ MANUALMENTE
  // ============================================================

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert(
        "Reconhecimento de voz não suportado ou não carregado."
      );
      return;
    }

    if (isRecording) {
      continueRecordingRef.current = false;
      recognitionRef.current.stop();
      return;
    }

    setTranscript("");

    continueRecordingRef.current = true;
    setIsRecording(true);

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error(
        "Erro ao iniciar reconhecimento:",
        error
      );

      continueRecordingRef.current = false;
      setIsRecording(false);
    }
  };

  // ============================================================
  // PALAVRAS RECONHECIDAS
  // ============================================================

  const getWordState = (
    word: string,
    index: number
  ) => {
    if (!transcript) {
      return "hidden";
    }

    const targetWords = normalizeText(
      currentLine?.text ?? ""
    ).split(" ");

    const spokenWords = normalizeText(
      transcript
    ).split(" ");

    const usedIndexes = new Set<number>();

    for (let i = 0; i < index; i++) {
      const previousWord = targetWords[i];

      const foundIndex = spokenWords.findIndex(
        (spokenWord, spokenIndex) =>
          !usedIndexes.has(spokenIndex) &&
          spokenWord === previousWord
      );

      if (foundIndex !== -1) {
        usedIndexes.add(foundIndex);
      }
    }

    const currentWord = normalizeText(word);

    const foundIndex = spokenWords.findIndex(
      (spokenWord, spokenIndex) =>
        !usedIndexes.has(spokenIndex) &&
        spokenWord === currentWord
    );

    return foundIndex !== -1
      ? "correct"
      : "wrong";
  };

  // ============================================================
  // PROGRESSO
  // ============================================================

  const progress =
    lines.length > 0
      ? Math.round(
          (currentIndex / lines.length) * 100
        )
      : 0;

  // ============================================================
  // AGRUPAMENTO POR ESTROFES
  // ============================================================

  const stanzas = verses.reduce<
    Record<number, PsalmVerse[]>
  >((groups, verse) => {
    if (!groups[verse.stanzaId]) {
      groups[verse.stanzaId] = [];
    }

    groups[verse.stanzaId].push(verse);

    return groups;
  }, {});

  const orderedStanzas = Object.entries(
    stanzas
  ).sort(
    ([, versesA], [, versesB]) =>
      versesA[0].stanzaPosition -
      versesB[0].stanzaPosition
  );

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="fixed inset-0 z-[70]">

      {/* Overlay */}
      <button
        type="button"
        aria-label="Fechar"
        onClick={onClose}
        className="absolute inset-0 bg-black/70"
      />

      {/* Modal */}
      <div className="relative z-10 mx-auto h-full max-w-3xl">

        <div className="relative mx-auto flex h-full max-w-2xl flex-col overflow-hidden bg-[#F2EDE4] shadow-2xl">

          {/* ========================================================
              HEADER
              ======================================================== */}

          <header className="relative shrink-0 border-b border-stone-300 bg-[#F2EDE4] px-6 pb-5 pt-8">

            {/* Fechar */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="absolute right-5 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full text-4xl font-bold text-stone-700 transition-opacity hover:opacity-70"
            >
              ×
            </button>

            {/* Visualizar */}
            <button
              type="button"
              onClick={() =>
                setIsVisible(
                  (current) => !current
                )
              }
              aria-label={
                isVisible
                  ? "Ocultar Salmo"
                  : "Visualizar Salmo"
              }
              className="absolute right-16 top-5 z-20 flex h-10 w-10 items-center justify-center rounded-full text-xl text-stone-700 transition-opacity hover:opacity-70"
            >
              {isVisible ? "◉" : "◌"}
            </button>

            {/* Título */}
            <div className="pr-24 text-left">
              <p className="font-domine text-sm font-bold uppercase tracking-wider text-stone-500">
                Salmo {psalm.number}
              </p>

              
            </div>

            {/* Progresso */}
            <div className="mx-auto mt-5 w-full max-w-md">

              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500">
                  Progresso
                </span>

                <span className="font-domine text-sm font-bold text-stone-700">
                  {progress}%
                </span>
              </div>

              <div
                className="h-3 w-full overflow-hidden rounded-full"
                style={{
                  backgroundColor: "#D8D2C8",
                }}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    background:
                      "linear-gradient(90deg, #279838 0%, #35DE4F 100%)",
                  }}
                />
              </div>

            </div>
          </header>

          {/* ========================================================
              CONTEÚDO
              ======================================================== */}

          <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-40 pt-6">

            {/* Loading */}
            {loading && (
              <div className="flex justify-center py-12">
                <p className="text-sm text-stone-500">
                  Carregando Salmo...
                </p>
              </div>
            )}

            {/* Erro */}
            {!loading && error && (
              <div className="py-12 text-center">
                <p className="text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}

            {!loading && !error && (
              <article className="font-domine text-[14px] leading-8 text-stone-800">

                {/* ==================================================
                    TÍTULO
                    ================================================== */}

                <div className="mb-8">

                  <div className="mb-2 flex items-start gap-3">

                    <div className="flex-1">
                      {isVisible ||
                      currentIndex > 0 ? (
                        <p className="font-bold">
                          {psalm.label}
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-x-2 gap-y-2">
                          {psalm.label
                            .split(/\s+/)
                            .map(
                              (_, index) => (
                                <span
                                  key={index}
                                  className="inline-block h-[10px] w-10 border-b-2 border-dashed border-stone-400"
                                />
                              )
                            )}
                        </div>
                      )}
                    </div>

                    {currentIndex > 0 && (
                      <span className="mt-1 text-lg font-bold text-green-600">
                        ✓
                      </span>
                    )}

                  </div>

                </div>

                {/* ==================================================
                    ESTROFES
                    ================================================== */}

                {orderedStanzas.map(
                  ([stanzaId, stanzaVerses]) => (
                    <div
                      key={stanzaId}
                      className="mb-8 last:mb-0"
                    >

                      {stanzaVerses
                        .sort(
                          (a, b) =>
                            a.position -
                            b.position
                        )
                        .map((verse) => {

                          const lineIndex =
                            lines.findIndex(
                              (line) =>
                                line.id ===
                                String(
                                  verse.id
                                )
                            );

                          const isCompleted =
                            lineIndex <
                            currentIndex;

                          const isCurrent =
                            lineIndex ===
                            currentIndex;

                          const isFuture =
                            lineIndex >
                            currentIndex;

                          return (
                            <div
                              key={verse.id}
                              className="mb-3 last:mb-0"
                            >

                              <div className="flex items-start gap-3">

                                <div className="flex-1">

                                  {isVisible ||
                                  isCompleted ? (
                                    <p>
                                      {verse.text}
                                    </p>
                                  ) : isCurrent ? (
                                    <p className="flex flex-wrap gap-x-2 gap-y-2">

                                      {verse.text
                                        .split(
                                          /\s+/
                                        )
                                        .map(
                                          (
                                            word,
                                            index
                                          ) => {

                                            const state =
                                              getWordState(
                                                word,
                                                index
                                              );

                                            return (
                                              <span
                                                key={`${verse.id}-${index}`}
                                                className={
                                                  state ===
                                                  "correct"
                                                    ? "font-bold text-stone-800"
                                                    : state ===
                                                      "wrong"
                                                    ? "font-bold text-red-600 line-through"
                                                    : "inline-block h-[10px] w-10 border-b-2 border-dashed border-stone-400"
                                                }
                                              >
                                                {state ===
                                                "hidden"
                                                  ? ""
                                                  : word}
                                              </span>
                                            );
                                          }
                                        )}

                                    </p>
                                  ) : isFuture ? (
                                    <div className="flex flex-wrap gap-x-2 gap-y-2">

                                      {verse.text
                                        .split(
                                          /\s+/
                                        )
                                        .map(
                                          (
                                            _,
                                            index
                                          ) => (
                                            <span
                                              key={`${verse.id}-${index}`}
                                              className="inline-block h-[10px] w-10 border-b-2 border-dashed border-stone-400"
                                            />
                                          )
                                        )}

                                    </div>
                                  ) : null}

                                </div>

                                {isCompleted && (
                                  <span className="mt-1 text-lg font-bold text-green-600">
                                    ✓
                                  </span>
                                )}

                                {isCurrent &&
                                  transcript &&
                                  !isRecording && (
                                    <span className="mt-1 text-lg font-bold text-red-600">
                                      ✕
                                    </span>
                                  )}

                              </div>

                            </div>
                          );
                        })}

                    </div>
                  )
                )}

              </article>
            )}

          </div>

          {/* ========================================================
              CONTROLES
              ======================================================== */}

          {!loading &&
            !error &&
            !isVisible &&
            currentLine && (
              <div className="absolute bottom-0 left-0 right-0 border-t border-stone-300 bg-[#F2EDE4] px-6 pb-8 pt-4">

               {inputMode === "speaking" ? (
                <>  
                {!isRecording ? (
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className="w-full rounded-2xl border-2 border-b-4 border-gray-200 bg-white py-4 text-lg font-bold tracking-wider text-[#00A2E8] shadow-md transition-transform active:translate-y-1 active:border-b-2"
                  >
                    <span className="mr-2">
                      🎙️
                    </span>

                    Falar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className="flex min-h-16 w-full items-center justify-center gap-1.5 rounded-2xl border-2 border-gray-200 bg-white py-4 shadow-md animate-pulse"
                  >
                    <div className="h-6 w-1.5 animate-bounce rounded-full bg-[#00A2E8]" />
                    <div className="h-10 w-1.5 animate-bounce rounded-full bg-[#00A2E8]" />
                    <div className="h-14 w-1.5 animate-bounce rounded-full bg-[#00A2E8]" />
                    <div className="h-8 w-1.5 animate-bounce rounded-full bg-[#00A2E8]" />
                    <div className="h-12 w-1.5 animate-bounce rounded-full bg-[#00A2E8]" />
                    <div className="h-5 w-1.5 animate-bounce rounded-full bg-[#00A2E8]" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    continueRecordingRef.current = false;

                    if (recognitionRef.current) {
                      try {
                        recognitionRef.current.stop();
                      } catch {}
                    }
                    
                    setIsRecording(false);
                    setTranscript("");
                    setInputMode("typing");
                  }}
                  className="mt-3 w-full text-sm font-bold tracking-wide text-gray-500"
                >
                  Digitar
                </button>
                </>
               ) : (
                <>
                    <div className="rounded-2xl border-2 border-gray-200 bg-white p-3 shadow-md">
      <textarea
        value={typedAnswer}
        onChange={(event) =>
          setTypedAnswer(event.target.value)
        }
        placeholder="Digite o verso aqui..."
        className="min-h-24 w-full resize-none bg-transparent font-domine text-sm leading-7 text-stone-800 outline-none placeholder:text-stone-400"
        autoFocus
      />

      <button
        type="button"
        onClick={verifyTypedAnswer}
        disabled={!typedAnswer.trim()}
        className="mt-2 w-full rounded-xl bg-[#2D4D42] py-3 text-sm font-bold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
      >
        Verificar
      </button>
    </div>

    <button
      type="button"
      onClick={() => {
        setTypedAnswer("");
        setInputMode("speaking");
      }}
      className="mt-3 w-full text-sm font-bold tracking-wide text-gray-500"
    >
      Quero falar
    </button>
  </>
)}
              </div>
            )}

          {/* ========================================================
              SUCCESS
              ======================================================== */}

          <SuccessModal
            visible={showSuccess}
            onContinue={() => {
              setShowSuccess(false);
              onClose();
            }}
            title="Perfeito!"
            buttonLabel="Continuar"
          />

          {/* ========================================================
              FAILURE
              ======================================================== */}

          <FailureModal
            visible={showFailure}
            onRetry={() => {
              setShowFailure(false);
              setTranscript("");
              setTypedAnswer("");
              setIsRecording(false);
              continueRecordingRef.current = false;

              // Depois de um erro, o microfone NÃO
              // volta automaticamente.
              continueRecordingRef.current = false;
            }}
          />

        </div>
      </div>
    </div>
  );
}

