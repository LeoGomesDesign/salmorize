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

  task_order: number;
  global_order: number;
  recap: boolean;
  psalm_id: number;

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

  
  stanza_total_tasks: number;
  // battery: number;
  // max_battery: number;
  // battery_cost: number;
  star_reward: number;
}