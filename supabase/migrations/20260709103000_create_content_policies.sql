-- =====================================================
-- RLS
-- =====================================================

alter table public.psalms enable row level security;
alter table public.stanzas enable row level security;
alter table public.verses enable row level security;
alter table public.tasks enable row level security;

-- =====================================================
-- SELECT
-- =====================================================

create policy "Authenticated users can read psalms"
on public.psalms
for select
to authenticated
using (true);

create policy "Authenticated users can read stanzas"
on public.stanzas
for select
to authenticated
using (true);

create policy "Authenticated users can read verses"
on public.verses
for select
to authenticated
using (true);

create policy "Authenticated users can read tasks"
on public.tasks
for select
to authenticated
using (true);

-- =====================================================
-- INSERT
-- (MVP)
-- =====================================================

create policy "Authenticated users can insert psalms"
on public.psalms
for insert
to authenticated
with check (true);

create policy "Authenticated users can insert stanzas"
on public.stanzas
for insert
to authenticated
with check (true);

create policy "Authenticated users can insert verses"
on public.verses
for insert
to authenticated
with check (true);

create policy "Authenticated users can insert tasks"
on public.tasks
for insert
to authenticated
with check (true);