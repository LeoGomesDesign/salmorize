import type { Psalm } from "@/lib/types/database";
import type { PsalmNode } from "@/lib/types/home";

function isCompleted(
  row: {
    completed: boolean;
} | undefined
): boolean {
  return row?.completed ?? false;
}

export function buildPsalmNodes(
   
  psalms: Psalm[],
  progressRows: {
    psalm_id: number;
    current_task_id: number;
    completed: boolean;
    current_step: number;
    total_steps: number;
    progress: number;
  }[]
): PsalmNode[] {
  console.log(psalms);
  console.log(progressRows);
  const progressByPsalmId = new Map(
    progressRows.map((row) => [row.psalm_id, row])
  );

  let activeAssigned = false;

  //Procurando o erro:
  const nodes = psalms.map((psalm) => {
  const row = progressByPsalmId.get(psalm.id);

  if (isCompleted(row)) {
    return {
      id: psalm.id,
      number: psalm.number,
      label: psalm.title,
      status: "completed" as const,
      progress: row.progress,
      currentStep: row.total_steps,
    };
  }

  if (!activeAssigned) {
    activeAssigned = true;
    return {
      id: psalm.id,
      number: psalm.number,
      label: psalm.title,
      status: "active" as const,
      progress: row?.progress ?? 0,
      currentStep: row?.current_step ?? 1,
    };
  }

  return {
    id: psalm.id,
    number: psalm.number,
    label: psalm.title,
    status: "locked" as const,
    progress: 0,
    currentStep: 1,
  };
});

console.log("NODES:", nodes);

return nodes;
//vai até aqui o teste

  
}
