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
  label: string;
};

export type UserPsalmProgress = {
  id: string;
  user_id: string;
  psalm_id: number;
  current_step: number;
  progress: number;
  completed_at: string | null;
  updated_at: string;
};
