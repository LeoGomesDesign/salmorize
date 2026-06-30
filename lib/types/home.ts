export type PsalmStatus = "completed" | "active" | "locked";

export const PSALM_TOTAL_STEPS = 6;

export type PsalmNode = {
  id: number;
  label: string;
  status: PsalmStatus;
  progress: number;
  currentStep: number;
};

export type HomeProfile = {
  displayName: string;
  streak: number;
  gems: number;
  energy: number;
};

export type HomeData = {
  profile: HomeProfile;
  psalms: PsalmNode[];
};
