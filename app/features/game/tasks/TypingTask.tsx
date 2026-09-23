"use client";

import { useState } from "react";
import SuccessModal from "@/app/features/game/modals/SuccessModal";
import FailureModal from "@/app/features/game/modals/FailureModal";
import type { Task } from "@/lib/types/task";
import HeaderBackButton from "@/app/features/game/components/task/HeaderBackButton";
import ProgressBar from "@/app/features/game/components/task/ProgressBar";
import Image from "next/image";

interface Props {
  task: Task;
  onCompleted: () => Promise<void>;
}

function normalizeText(text: string) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function TypingTask({ task, onCompleted }: Props) {
  const [answer, setAnswer] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  const targetPhrase = task.verses?.text ?? "";

  function handleCheck() {
    const isCorrect = normalizeText(answer) === normalizeText(targetPhrase);

    if (isCorrect) {
      setShowSuccess(true);
    } else {
      setShowFailure(true);
    }
  }

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-app pt-6 pb-16 px-6">
      <div className="flex items-center gap-2">
        <HeaderBackButton onClick={() => window.history.back()} />
        <ProgressBar task={task} />
      </div>

      <div className="flex flex-col flex-1 mt-6 gap-6">
        <h1 className="text-2xl font-domine font-bold">Digite a frase</h1>

        <div className="relative flex flex-col justify-center items-center mb-4">
                  {/* Substitua o 'src' pela imagem real do Rei Davi quando tiver */}
                  <Image
                    src="/img/DaviSpeaking.png" 
                    height={224}
                    width={192}
                    alt="Rei Davi com Harpa" 
                    className="object-contain mt-8"
                  />

          <div className="rounded-3xl border-2 border-gray-200 bg-white p-5 text-center shadow-sm mb-4">
            <p className="text-xl font-serif leading-relaxed">{targetPhrase}</p>
          </div>

          <textarea
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Digite o verso aqui..."
            className="min-h-32 w-full resize-none rounded-2xl border-2 border-gray-200 bg-white p-4 text-lg outline-none focus:border-[#00A2E8]"
            aria-label="Resposta digitada"
          />
        </div>

        <button
          type="button"
          disabled={!answer.trim()}
          onClick={handleCheck}
          className={answer.trim() ? "btn btn-primary mt-auto w-full" : "btn btn-disabled mt-auto w-full"}
        >
          Verificar
        </button>
      </div>

      <SuccessModal
        visible={showSuccess}
        onContinue={async () => {
          setShowSuccess(false);
          await onCompleted();
        }}
        title="Perfeito!"
        buttonLabel="Continuar"
      />

      <FailureModal
        visible={showFailure}
        onRetry={() => setShowFailure(false)}
      />
    </div>
  );
}
