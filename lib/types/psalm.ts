export interface ParsedVerse {
  position: number;
  text: string;
  wordCount: number;
}

export interface ParsedStanza {
  position: number;
  totalVerses: number;
  verses: ParsedVerse[];
}

export interface ParsedPsalm {
  title: string;
  totalStanzas: number;
  totalVerses: number;
  stanzas: ParsedStanza[];
}

export interface PsalmValidation {

  valid: boolean;

  errors: string[];

  warnings: string[];

  estimatedMinutes: number;

  estimatedBattery: number;

}