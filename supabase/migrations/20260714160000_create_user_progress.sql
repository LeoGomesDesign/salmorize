-- =====================================================
-- USER PROGRESS
-- =====================================================

create table public.user_progress (

    id bigint generated always as identity primary key,

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    psalm_id bigint not null
        references public.psalms(id)
        on delete cascade,

    current_task_id bigint
        references public.tasks(id)
        on delete set null,

    completed boolean not null default false,

    stars integer not null default 0,

    xp integer not null default 0,

    started_at timestamptz not null default now(),

    completed_at timestamptz,

    updated_at timestamptz not null default now(),

    unique(user_id, psalm_id)
);

alter table public.user_progress
enable row level security;

create policy "Users can read own progress"
on public.user_progress
for select
to authenticated
using (
    auth.uid() = user_id
);

create policy "Users can create own progress"
on public.user_progress
for insert
to authenticated
with check (
    auth.uid() = user_id
);

create policy "Users can update own progress"
on public.user_progress
for update
to authenticated
using (
    auth.uid() = user_id
);