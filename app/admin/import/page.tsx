"use client";

import { useState } from "react";

import { parsePsalm } from "@/lib/parser/parsePsalm";
import { ParsedPsalm, PsalmValidation } from "@/lib/types/psalm";

import ImportForm from "./components/ImportForm";
import PsalmPreview from "./components/PsalmPreview";
import { validatePsalm } from "@/lib/validator/validatePsalm";

export default function ImportPsalmPage() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<ParsedPsalm | null>(null);
  const [validation, setValidation] = 
  useState<PsalmValidation | null>(null);

  function handleParse() {
    const parsed = parsePsalm(text);
    
    setResult(parsed);

    setValidation(validatePsalm(parsed));
  }

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: 24,
      }}
    >
      <h1>Importar Salmo</h1>

    <ImportForm
      text={text}
      onTextChange={setText}
      onParse={handleParse}
    />

    {result && validation && ( 
      <PsalmPreview psalm={result} validation={validation} />
    )}
    </main>
            );
}
