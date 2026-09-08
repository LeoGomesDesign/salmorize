"use client";

import { useState } from "react";

type AudioImportFormProps = {
  psalmNumber: number;
  onPsalmNumberChange: (value: number) => void;

  files: File[];
  onFilesChange: (files: File[]) => void;

  onImport: () => void;
};

export default function AudioImportForm({
  psalmNumber,
  onPsalmNumberChange,
  files,
  onFilesChange,
  onImport
}: AudioImportFormProps) {

 
  function handleFilesChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!event.target.files) return;

    onFilesChange(Array.from(event.target.files));
  }

  return (
    <section
      style={{
        marginTop: 20,
      }}
    >
      <h2>Importar Áudios</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          marginTop: 24,
        }}
      >
        {/* ============================================================
            Número do Salmo
        ============================================================ */}

        <label>
          Número do Salmo

          <input
            type="number"
            min={1}
            value={psalmNumber}
            onChange={(event) =>
              onPsalmNumberChange(Number(event.target.value))
            }
            style={{
              display: "block",
              marginTop: 8,
              padding: 8,
            }}
          />
        </label>

        {/* ============================================================
            Arquivos
        ============================================================ */}

        <label>
          Arquivos MP3

          <input
            type="file"
            accept=".mp3,audio/mpeg"
            multiple
            onChange={handleFilesChange}
            style={{
              display: "block",
              marginTop: 8,
            }}
          />
        </label>

        {/* ============================================================
            Preview
        ============================================================ */}

        {files.length > 0 && (
          <div>
            <strong>
              Arquivos selecionados ({files.length})
            </strong>

            <ul>
              {files.map((file) => (
                <li key={file.name}>
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ============================================================
            Botão
        ============================================================ */}

        <button
          type="button"
          onClick={onImport}
          disabled={files.length === 0}
          style={{
            width: "fit-content",
            padding: "10px 16px",
            cursor:
              files.length === 0
                ? "not-allowed"
                : "pointer",
          }}
        >
          Importar Áudios
        </button>
      </div>
    </section>
  );
}