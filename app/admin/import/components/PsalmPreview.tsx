import {
  ParsedPsalm,
  PsalmValidation,
} from "@/lib/types/psalm";

import { generateTasks } from "@/lib/generator/generateTasks";

interface PsalmPreviewProps {
  psalm: ParsedPsalm;
  validation: PsalmValidation;
}

export default function PsalmPreview({
  psalm,
  validation,
}: PsalmPreviewProps) {
  return (
    <div
      style={{
        marginTop: 40,
        border: "1px solid #DDD",
        borderRadius: 12,
        padding: 24,
      }}
    >
      <h2>{psalm.title}</h2>

      <div
        style={{
          marginTop: 20,
          padding: 16,
          background: "#F5F5F5",
          borderRadius: 10,
        }}
      >
        <p>
          <strong>Status:</strong>{" "}
          {validation.valid
            ? "✅ Pronto para importar"
            : "❌ Possui erros"}
        </p>

        <p>
          <strong>Estrofes:</strong>{" "}
          {psalm.totalStanzas}
        </p>

        <p>
          <strong>Versos:</strong>{" "}
          {psalm.totalVerses}
        </p>

        <p>
          <strong>Tempo estimado:</strong>{" "}
          {validation.estimatedMinutes} min
        </p>

        <p>
          <strong>Battery estimada:</strong>{" "}
          {validation.estimatedBattery}
        </p>
      </div>

      {psalm.stanzas.map((stanza) => {
        const tasks = generateTasks(stanza);

        return (
          <div
            key={stanza.position}
            style={{
              marginTop: 32,
              paddingTop: 20,
              borderTop: "1px solid #EEE",
            }}
          >
            <h3>
              📚 Estrofe {stanza.position}
            </h3>

            <p>
              {stanza.totalVerses} versos
            </p>

            {/* VERSOS */}
            {stanza.verses.map((verse) => (
              <div
                key={verse.position}
                style={{
                  marginBottom: 16,
                }}
              >
                <strong>
                  {verse.position}.
                </strong>

                <div>{verse.text}</div>

                <small>
                  {verse.wordCount} palavras
                </small>
              </div>
            ))}

            <hr
              style={{
                margin: "24px 0",
              }}
            />

            {/* TASKS */}
            <h4>
              🎯 Tasks Geradas
            </h4>

            {tasks.map((task) => (
              <div
                key={task.order}
                style={{
                  marginBottom: 8,
                }}
              >
                <strong>
                  Task {task.order}
                </strong>

                {" — "}

                {task.type}

                {task.type === "recap"
                  ? ` (Versos: ${task.recapVerses.join(", ")})`
                  : ` (Verso ${task.versePosition})`}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}