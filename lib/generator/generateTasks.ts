import { ParsedStanza } from "@/lib/types/psalm";
import { GeneratedTask } from "@/lib/types/task";


const TASK_SEQUENCE = [
 "word_order",
  "speaking",
  
] as const;


export function generateTasks(
  stanza: ParsedStanza
): GeneratedTask[] {

  const tasks: GeneratedTask[] = [];

  let order = 1;

  const studiedVerses: number[] = [];

  stanza.verses.forEach((verse, index) => {

    tasks.push({
      order,
      versePosition: verse.position,
      type: TASK_SEQUENCE[index % TASK_SEQUENCE.length],
      variant: "default",
      recapVerses: [],
    });

    studiedVerses.push(verse.position);

    order++;

    if ((index + 1) % 2 === 0) {

      tasks.push({
        order,
        versePosition: null,
        type: "recap",
        variant: "default",
        recapVerses: [...studiedVerses],
      });

      order++;

    }

  });

  return tasks;
}