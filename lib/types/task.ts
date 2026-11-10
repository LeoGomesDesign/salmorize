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

export interface TaskVerse {
  id: number;
  text: string;
  position: number;
  audio_url: string | null;
}

export interface TaskStanzaVerse {
  id: number;
  text: string;
  position: number;
}

export interface Task {
  id: number;

  type: TaskType;

  variant: string;

  task_order: number;

  global_order: number;

  recap: boolean;

  psalm_id: number;

  stanza_id: number;

  battery_cost: number;

  star_reward: number;

  xp_reward: number;

  verses: TaskVerse | null;

  recap_verses: TaskStanzaVerse[];

  psalm_verses: TaskStanzaVerse[];

  stanza_total_tasks: number;

  stanza_position: number;

  psalm_number: number;

  psalm_stanzas: number;
}
