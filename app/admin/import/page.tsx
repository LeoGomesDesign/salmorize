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
import AudioImportForm from "./components/AudioImportForm";
import { importPsalmAudio } from "@/lib/supabase/importPsalmAudio";






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

// ============================================================
// Importação de áudios
// ============================================================

const [audioPsalmNumber, setAudioPsalmNumber] = useState(1);
const [audioFiles, setAudioFiles] = useState<File[]>([]);

// ============================================================
// Importa os áudios do Salmo
// ============================================================

async function handleAudioImport() {
  if (audioFiles.length === 0) {
    alert("Selecione os arquivos de áudio.");
    return;
  }

  try {
    const result = await importPsalmAudio(
      audioPsalmNumber,
      audioFiles
    );

    alert(
      `${result.imported} áudio(s) importado(s) com sucesso!`
    );

    setAudioFiles([]);
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      alert(`Erro ao importar áudios: ${error.message}`);
      return;
    }

    alert("Erro ao importar áudios.");
  }
}
  

function handleParse() {
  const parsed = parsePsalm(text);
    
  setResult(parsed);

  setValidation(validatePsalm(parsed));
  }

// ============================================================
// Importa o Salmo para o banco de dados
// ============================================================

  async function handleImport() {
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
    width: "900px",
    
    margin: "auto",
    padding: 24,
    boxSizing: "border-box",
    
  }}
>
     
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
 <h1>Importar Salmo</h1>
    <div
      style={{
        display: "flex",
        
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 32,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
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
      </div>

      <div style={{ width: 2, height: "550px", border: "1px solid #DDD" }}> </div> 

      <div style={{ flex: 1, minWidth: 0 }}>
        <AudioImportForm
          psalmNumber={audioPsalmNumber}
          onPsalmNumberChange={setAudioPsalmNumber}
          files={audioFiles}
          onFilesChange={setAudioFiles}
          onImport={handleAudioImport}
        />
      </div>
    </div>

    {result && validation && ( 
      <PsalmPreview psalm={result} validation={validation} />
    )}

    

    </main>
  
    );
}
