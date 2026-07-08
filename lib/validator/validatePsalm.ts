import { ParsedPsalm, PsalmValidation } from "../types/psalm";

export function validatePsalm(
  psalm: ParsedPsalm
): PsalmValidation {

  const errors: string[] = [];
  const warnings: string[] = [];

  if (!psalm.title.trim()) {
    errors.push("O Salmo precisa ter um título.");
  }

  if (psalm.totalStanzas === 0) {
    errors.push("Nenhuma estrofe encontrada.");
  }

  if (psalm.totalVerses === 0) {
    errors.push("Nenhum verso encontrado.");
  }

  psalm.stanzas.forEach((stanza) => {

    if (stanza.verses.length === 0) {
      errors.push(
        `Estrofe ${stanza.position} está vazia.`
      );
    }

  });

  const estimatedMinutes = Math.ceil(
    psalm.totalVerses * 0.7
  );

  const estimatedBattery = Math.min(
    100,
    psalm.totalVerses * 5
  );

  return {

    valid: errors.length === 0,

    errors,

    warnings,

    estimatedMinutes,

    estimatedBattery,

  };
}