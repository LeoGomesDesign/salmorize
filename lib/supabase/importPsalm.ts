import { createClient } from "@/lib/supabase/client";
import { ParsedPsalm } from "@/lib/types/psalm";
import { generateTasks } from "@/lib/generator/generateTasks";

export async function importPsalm(
  number: number,
  translation: string,
  psalm: ParsedPsalm
) {
  const supabase = createClient();
  // Verifica se já existe um Salmo com esse número
const { data: existingPsalm } = await supabase
  .from("psalms")
  .select("id")
  .eq("number", number)
  .maybeSingle();

if (existingPsalm) {
  console.log("Removendo Salmo existente...");

  const { error: deleteError } = await supabase
    .from("psalms")
    .delete()
    .eq("id", existingPsalm.id);

  if (deleteError) {
    console.error(deleteError);
    throw deleteError;
  }

  console.log("Salmo removido.");
}
  const { data: insertedPsalm, error: psalmError } = await supabase
  .from("psalms")
  .insert({
    number,
    title: psalm.title,
    translation,
    total_stanzas: psalm.totalStanzas,
    total_verses: psalm.totalVerses,
  })
  .select()
  .single();

if (psalmError) {
  console.error("Erro ao inserir salmo:", psalmError);
  throw psalmError;
}

let globalOrder = 1;

for (const stanza of psalm.stanzas) {
  const { data: insertedStanza, error: stanzaError } =
    await supabase
      .from("stanzas")
      .insert({
        psalm_id: insertedPsalm.id,
        position: stanza.position,
      })
      .select()
      .single();

  if (stanzaError) {
    throw stanzaError;
  }

  console.log(
    `✓ Estrofe ${stanza.position} criada`
  );

 const tasks = generateTasks(stanza);
 const verseMap = new Map<number, number>();

 for (const verse of stanza.verses) {
   const { data: insertedVerse, error: verseError } = await supabase
    .from("verses")
    .insert({
      stanza_id: insertedStanza.id,
      position: verse.position,
      text: verse.text,
      word_count: verse.wordCount,
    })
    .select()
    .single();

    if (verseError) {
    throw verseError;
    }
    verseMap.set(
    verse.position,
    insertedVerse.id
    );

    console.log(`   ✓ Verso ${verse.position} inserido`);

  
  }

  for (const task of tasks) {
    const verseId = 
      task.versePosition === null
      ? null
      : verseMap.get(task.versePosition);
    
    const { error: taskError } = await supabase
      .from("tasks")
      .insert({
        psalm_id: insertedPsalm.id,
        stanza_id: insertedStanza.id,
        verse_id: verseId,
        global_order: globalOrder,
        task_order: task.order,
        type: task.type,
        recap: task.type === "recap",
        recap_verses: task.recapVerses.map(
          (position) => verseMap.get(position)
        ),
        battery_cost: 5,
        star_reward: 10,
        xp_reward: 10,
        variant: task.variant,
    });

    globalOrder++;

    if (taskError) {
      throw taskError;
    }

    console.log(`   ✓ Task ${task.order} (${task.type})`
    );
  }

  
}



return insertedPsalm;
  
}
