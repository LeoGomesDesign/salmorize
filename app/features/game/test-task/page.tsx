"use client";

import { useEffect } from "react";
import { getCurrentTask } from "@/lib/supabase/game/getCurrentTask";

export default function TestTaskPage() {
  useEffect(() => {
    async function load() {
      try {
        const task = await getCurrentTask(109);

        console.log("TASK:", task);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, []);
  
  return <div>Veja o console do navegador.</div>;
}