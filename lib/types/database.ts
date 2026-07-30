export type Profile = {
  id: string;
  display_name: string | null;
  streak: number;
  gems: number;
  energy: number;
  created_at: string;
  updated_at: string;
};

export type Psalm = {
  id: number;
  number: number;
  title: string;
  translation: string;
  total_stanzas: number;
  total_verses: number;
};

export type UserProgress = {
  id: number;
  user_id: string;
  psalm_id: number;
  current_task_id: number;
  stars: number;
  xp: number;
  completed: boolean;
};
