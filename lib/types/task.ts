export type TaskType =
  | "word_order"
  | "speaking"
  | "recap";

export interface GeneratedTask {
  order: number;

  versePosition: number | null;

  type: TaskType;

  variant: string;

  recapVerses: number[];
}

export interface Task {
  id: string | number;

  type: TaskType;

  variant: string;

  verses: {
    id: number;
    text: string;
    position: number;
  } | null;

  recap_verses: {
    id: number;
    text: string;
    position: number;
  }[];

  psalm_verses: {
    id: number;
    text: string;
    position: number;
  }[];

  task_order: number;
  stanza_total_tasks: number;
  battery: number;
  max_battery: number;
}