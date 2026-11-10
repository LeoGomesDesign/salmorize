'use client';

import RecapTask from "@/app/features/game/tasks/RecapTask";
import type { Task } from "@/lib/types/task";

const mockTask: Task = {
  id: 999,
  type: "recap",
  variant: "default",

  task_order: 2,
  global_order: 2,

  recap: true,

  psalm_id: 28,
  stanza_id: 1,
  battery_cost: 0,
  star_reward: 10,
  xp_reward: 10,

  verses: null,

  recap_verses: [
    {
      id: 166,
      text: "Bem-aventurado o homem que não segue o conselho dos ímpios",
      position: 1,
    },
    {
      id: 167,
      text: "Mas encontra seu prazer na lei do Senhor",
      position: 2,
    },
  ],

  psalm_verses: [
    {
      id: 166,
      text: "Bem-aventurado o homem que não segue o conselho dos ímpios",
      position: 1,
    },
    {
      id: 167,
      text: "Mas encontra seu prazer na lei do Senhor",
      position: 2,
    },
    {
      id: 168,
      text: "É como árvore plantada junto às águas",
      position: 3,
    },
    {
      id: 169,
      text: "Que dá seu fruto no tempo certo",
      position: 4,
    },
  ],

  stanza_total_tasks: 3,

  stanza_position: 1,
  psalm_number: 28,
  psalm_stanzas: 3,
};

export default function RecapDevPage() {
  const handleCompleted = async () => {
    console.log("Recap concluído!");
  };

  return (
    <RecapTask
      task={mockTask}
      onCompleted={handleCompleted}
      sessionTime={() => "03:33" }
      stanzaNumber={1}
      psalmNumber={1}
      isPsalmComplete={false}
    />
  );
}
