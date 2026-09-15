'use client';

import { useMemo } from "react";
import type { Task } from "@/lib/types/task";

export default function ProgressBar({ task }: { task: Task }) {

const progressPercent = useMemo(() => {
  return (task.task_order / task.stanza_total_tasks) * 100;
}, [task.task_order, task.stanza_total_tasks]);

  return (
    <div className="flex items-center w-full">
          {/* Barra de progresso amarela */}
          <div className="position-fixed w-full bg-gray-200 h-6 rounded-md  overflow-hidden shadow-inner">
            <div className="bg-linear-to-r from-[#E7AF65] to-[#BC4D38] h-full rounded-sm transition-all duration-500"
                 style={{width: `${progressPercent}%`,}} 
            ></div>
          </div>
          
        </div>
  );
}