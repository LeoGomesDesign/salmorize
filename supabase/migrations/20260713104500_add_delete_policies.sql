-- =====================================================
-- DELETE (MVP)
-- =====================================================

create policy "Authenticated users can delete psalms"
on public.psalms
for delete
to authenticated
using (true);

create policy "Authenticated users can delete stanzas"
on public.stanzas
for delete
to authenticated
using (true);

create policy "Authenticated users can delete verses"
on public.verses
for delete
to authenticated
using (true);

create policy "Authenticated users can delete tasks"
on public.tasks
for delete
to authenticated
using (true);