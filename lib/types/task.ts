export type TaskType =
  | "typing"
  | "speaking"
  | "word_order"
  | "recap";

export interface GeneratedTask {
  order: number;

  versePosition: number | null;

  type: TaskType;

  recapVerses: number[];
}