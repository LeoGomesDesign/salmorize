export type TaskType =
  | "typing"
  | "speaking"
  | "word_order"
  | "recap";

export interface GeneratedTask {
  order: number;

  versePosition: number | null;

  type: TaskType;

  variant: string;

  recapVerses: number[];
}

export interface Task {
  id: string;

  type: TaskType;

  variant: string;

  verses: {
    text: string;
  } | null;
}