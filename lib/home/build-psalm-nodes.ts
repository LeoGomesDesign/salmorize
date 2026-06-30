import type { Psalm, UserPsalmProgress } from "@/lib/types/database";
import type { PsalmNode } from "@/lib/types/home";

function isCompleted(row: UserPsalmProgress | undefined): boolean {
  if (!row) return false;
  return row.completed_at != null || row.progress >= 100;
}

export function buildPsalmNodes(
  psalms: Psalm[],
  progressRows: UserPsalmProgress[]
): PsalmNode[] {
  const progressByPsalmId = new Map(
    progressRows.map((row) => [row.psalm_id, row])
  );

  let activeAssigned = false;

  return psalms.map((psalm) => {
    const row = progressByPsalmId.get(psalm.id);

    if (isCompleted(row)) {
      return {
        id: psalm.id,
        label: psalm.label,
        status: "completed",
        progress: row?.progress ?? 100,
        currentStep: row?.current_step ?? 6,
      };
    }

    if (!activeAssigned) {
      activeAssigned = true;
      return {
        id: psalm.id,
        label: psalm.label,
        status: "active",
        progress: row?.progress ?? 0,
        currentStep: row?.current_step ?? 1,
      };
    }

    return {
      id: psalm.id,
      label: psalm.label,
      status: "locked",
      progress: 0,
      currentStep: 1,
    };
  });
}
