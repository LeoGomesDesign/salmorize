import { ParsedPsalm, PsalmValidation } from "@/lib/types/psalm";

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
        marginTop:20,
        padding:16,
        background:"#F5F5F5",
        borderRadius:10
    }}
>

<p>

<strong>Status:</strong>

{validation.valid
? " ✅ Pronto para importar"
: " ❌ Possui erros"}

</p>

<p>

Tempo estimado:
{validation.estimatedMinutes} minutos

</p>

<p>

Battery estimada:
{validation.estimatedBattery}

</p>

</div>

      <p>
        <strong>Estrofes:</strong> {psalm.totalStanzas}
      </p>

      <p>
        <strong>Versos:</strong> {psalm.totalVerses}
      </p>

      {psalm.stanzas.map((stanza) => (
        <div
          key={stanza.position}
          style={{
            marginTop: 32,
            borderTop: "1px solid #EEE",
            paddingTop: 20,
          }}
        >
          <h3>📚 Estrofe {stanza.position}</h3>

          {stanza.verses.map((verse) => (
            <div
              key={verse.position}
              style={{
                marginBottom: 16,
              }}
            >
              <strong>{verse.position}.</strong>

              <div>{verse.text}</div>

              <small>{verse.wordCount} palavras</small>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}