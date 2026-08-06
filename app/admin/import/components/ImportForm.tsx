"use client";

interface ImportFormProps {
  // Texto do salmo
  text: string;
  onTextChange: (value: string) => void;

  // Número do salmo
  number: number;
  onNumberChange: (value: number) => void;

  // Tradução
  translation: string;
  onTranslationChange: (value: string) => void;

  // Ações
  onParse: () => void;
  onImport: () => void;
}

const TRANSLATIONS = ["Saltério"];

export default function ImportForm({
  text,
  onTextChange,
  number,
  onNumberChange,
  translation,
  onTranslationChange,
  onParse,
  onImport,
}: ImportFormProps) {
  return (
    
    <>
  {/* ============================================================
      Dados do Salmo
      ============================================================ */}
  <div
    style={{
      display: "flex",
      gap: 16,
      marginTop: 20,
      marginBottom: 20,
    }}
  >
    {/* Número do Salmo */}
    <div style={{ flex: 1 }}>
      <label
        style={{
          display: "block",
          marginBottom: 6,
          fontWeight: 600,
        }}
      >
        Salmo:
      </label>

      <select
        value={number}
        onChange={(e) => onNumberChange(Number(e.target.value))}
        style={{
          width: "100%",
          padding: 12,
          border: "1px solid #DDD",
          borderRadius: 8,
        }}
        >
       {Array.from({ length: 150 }, (_, index) => (
        <option key={index + 1} value={index + 1}>
          {index + 1}
        </option>
        ))}
      </select>

    </div>

    {/* Tradução */}
    <div style={{ flex: 2 }}>
      <label
        style={{
          display: "block",
          marginBottom: 6,
          fontWeight: 600,
        }}
      >
        Tradução:
      </label>

      <select
        value={translation}
        onChange={(e) => onTranslationChange(e.target.value)}
        style={{
          width: "100%",
          padding: 12,
          border: "1px solid #DDD",
          borderRadius: 8,
        }}
        >
        {TRANSLATIONS.map((translation) => ( 
         <option key={translation} value={translation}>
           {translation}
         </option>
        ))}
      </select>
      
    </div>
  </div>
      <textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Cole aqui o Salmo..."
        style={{
          width: "100%",
          height: 300,
          marginTop: 20,
          padding: 16,
          border: "1px solid #DDD",
          borderRadius: 8,
        }}
      />

      <button
        onClick={onParse}
        style={{
          marginTop: 20,
          padding: "12px 24px",
          cursor: "pointer",
          backgroundColor: "#c4c4c4",
          borderRadius: 8,
          color: "#000",
        }}
      >
        Interpretar Salmo
      </button>
      <button
        onClick={onImport}
        style={{
          marginTop: 12,
          marginLeft: 12,
          padding: "12px 24px",
          cursor: "pointer",
          }}
      >
        Salvar no Banco
      </button>
    </>
  );
}