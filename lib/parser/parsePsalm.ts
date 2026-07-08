import { ParsedPsalm } from "../types/psalm";

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function parsePsalm(text: string): ParsedPsalm {
  // Remove espaços extras no início e no fim
  const cleaned = text.trim();

  // Divide o texto em blocos (estrofes)
  const blocks = cleaned.split(/\n\s*\n/);

  // Primeira linha do primeiro bloco = título
  const firstBlock = blocks[0].split("\n");

  const title = firstBlock[0].trim();

  // Remove o título da primeira estrofe
  firstBlock.shift();

  blocks[0] = firstBlock.join("\n");

  const stanzas = blocks
  .map((block) =>
    block
      .split("\n")
      .map((v) => v.trim())
      .filter((v) => v.length > 0)
  )
  .filter((verses) => verses.length > 0)
  .map((verses, stanzaIndex) => ({
    position: stanzaIndex + 1,
    totalVerses: verses.length,
    verses: verses.map((verse, verseIndex) => ({
      position: verseIndex + 1,
      text: verse,
      wordCount: countWords(verse),
    })),
  }));


const totalVerses = stanzas.reduce(
    (total, stanza) => total + stanza.totalVerses,
    0
  );

  return {
    title,
    totalStanzas: stanzas.length,
    totalVerses,
    stanzas,
  };
}