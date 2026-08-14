'use client';

import { useMemo } from "react";
import type { Task } from "@/lib/types/task";
import Image from "next/image";

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
          
          {/* Ícone de raio/energia */}
          <div className="position-absolute z-10 translate-x-[-11px] flex items-center gap-2 font-bold text-lg text-[#2D2D2D]">
            <Image
              src="/img/battery.png"
              width={28}
              height={28}
              alt="Ícone de bateria"
            />
            {task.battery}
          </div>
        </div>
  );
}