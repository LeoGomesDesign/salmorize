"use client";

interface ImportFormProps {
  text: string;
  onTextChange: (value: string) => void;
  onParse: () => void;
  onImport: () => void;
}

export default function ImportForm({
  text,
  onTextChange,
  onParse,
  onImport,
}: ImportFormProps) {
  return (
    <>
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