import { TaskType } from "@/lib/types/task";

const EXERCISE_TYPES: TaskType[] = [
  "typing",
  "speaking",
  "word_order",
];

export function generateExerciseSequence(
  seed: number
): TaskType[] {

  const exercises = [...EXERCISE_TYPES];

  let random = seed;

  for (let i = exercises.length - 1; i > 0; i--) {

    random = (random * 9301 + 49297) % 233280;

    const j = Math.floor((random / 233280) * (i + 1));

    [exercises[i], exercises[j]] =
    [exercises[j], exercises[i]];
  }

  return exercises;
}