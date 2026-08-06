"use client";

import { useEffect, useState } from "react";

import { parsePsalm } from "@/lib/parser/parsePsalm";
import { ParsedPsalm, PsalmValidation } from "@/lib/types/psalm";

import ImportForm from "./components/ImportForm";
import PsalmPreview from "./components/PsalmPreview";
import { validatePsalm } from "@/lib/validator/validatePsalm";
import { importPsalm } from "@/lib/supabase/importPsalm";
import { getImportedPsalms } from "@/lib/supabase/getImportedPsalms";
import { deletePsalm } from "@/lib/supabase/deletePsalm";






export default function ImportPsalmPage() {
  const [text, setText] = useState("");
// ============================================================
// Dados da importação
// ============================================================
 
  const [number, setNumber] = useState(1);
  const [translation, setTranslation] = useState("Saltério");
  const [result, setResult] = useState<ParsedPsalm | null>(null);
  const [validation, setValidation] = 
  useState<PsalmValidation | null>(null);
  
// ============================================================
// Salmos já importados
// ============================================================

const [importedPsalms, setImportedPsalms] = useState<number[]>([]);
  

function handleParse() {
  const parsed = parsePsalm(text);
    
  setResult(parsed);

  setValidation(validatePsalm(parsed));
  }

// ============================================================
// Importa o Salmo para o banco de dados
// ============================================================

  async function handleImport() {

   // const progress = await getUserProgress(1);
   // console.log(progress);
   
  if (!result) {
    alert("Interprete o Salmo primeiro.");
    return;
  }

  try {
    await importPsalm(
      number,
      translation,
      result
    );

    await loadImportedPsalms();

    alert("Salmo importado com sucesso!");

 } catch (error) {
  console.error(error);

  if (
  error instanceof Error &&
  error.message === "PSALM_ALREADY_EXISTS"
) {
  const replace = window.confirm(
    `O Salmo ${number} já foi importado.\n\nDeseja substituí-lo?`
  );

  if (!replace) {
    return;
  }

  try {
    await deletePsalm(number);

    await importPsalm(
      number,
      translation,
      result
    );

    await loadImportedPsalms();

    alert("Salmo substituído com sucesso!");

    return;
  } catch (replaceError) {
    console.error(replaceError);

    alert("Erro ao substituir o salmo.");

    return;
  }
} {
    alert(
      `O Salmo ${number} já foi importado.\n\n` +
      "Na próxima etapa iremos adicionar a opção de substituí-lo."
    );

    return;
  }

  alert("Erro ao importar o salmo.");
}
}

async function loadImportedPsalms() {
  try {
    const psalms = await getImportedPsalms();
    setImportedPsalms(psalms);
  } catch (error) {
    console.error(error);
  }
}


useEffect(() => {
  loadImportedPsalms();
}, []);

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: 24,
      }}
    >
      <h1>Importar Salmo</h1>
{/* ============================================================
    Salmos já importados
    ============================================================ */}
<div
  style={{
    marginTop: 20,
    marginBottom: 24,
    padding: 16,
    border: "1px solid #DDD",
    borderRadius: 8,
  }}
>
  <strong>Salmos importados:</strong>

<div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 12,
    }}
  >
    {importedPsalms.length > 0 ? (
      importedPsalms.map((psalmNumber) => (
        <span
          key={psalmNumber}
          style={{
            padding: "6px 10px",
            backgroundColor: "#E8E8E8",
            borderRadius: 6,
            fontWeight: 600,
          }}
        >
          {psalmNumber}
        </span>
      ))
    ) : (
      <span>Nenhum salmo importado.</span>
    )}
  </div>
</div>

    <ImportForm
      text={text}
      onTextChange={setText}
      number={number}
      onNumberChange={setNumber}
      translation={translation}
      onTranslationChange={setTranslation}
      onParse={handleParse}
      onImport={handleImport}
    />

    {result && validation && ( 
      <PsalmPreview psalm={result} validation={validation} />
    )}
    </main>
    );
}
