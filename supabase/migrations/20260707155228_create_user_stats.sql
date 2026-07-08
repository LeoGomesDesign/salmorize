-- =====================================================
-- Migration: create_user_stats
-- Sprint: 1 - Foundation
--
-- Responsabilidade:
-- Armazena o estado atual do jogador.
--
-- Dependências:
-- - profiles
--
-- Tabelas criadas:
-- - user_stats
-- =====================================================

create table public.user_stats (
    id uuid primary key
        references public.profiles(id)
        on delete cascade,

    battery integer not null default 100
        check (battery >= 0),
    max_battery integer not null default 100
        check (max_battery > 0),

    stars integer not null default 0
        check (stars >= 0),
    total_xp integer not null default 0
        check (total_xp >= 0),

    streak integer not null default 0,
        check (streak >= 0),
    best_streak integer not null default 0
        check (best_streak >= 0),

    completed_psalms integer not null default 0
        check (completed_psalms >= 0),
    completed_verses integer not null default 0
        check (completed_verses >= 0),

    last_task_completed_at timestamptz,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);


-- =====================================================
-- Atualiza updated_at automaticamente
-- =====================================================

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create trigger update_user_stats_updated_at
before update on public.user_stats
for each row
execute function public.update_updated_at_column();


-- =====================================================
-- Cria automaticamente as estatísticas do usuário
-- =====================================================

create or replace function public.handle_new_user_stats()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.user_stats (
        id
    )
    values (
        new.id
    );

    return new;
end;
$$;

create trigger on_profile_created
after insert on public.profiles
for each row
execute function public.handle_new_user_stats();


-- =====================================================
-- Row Level Security
-- =====================================================

alter table public.user_stats
enable row level security;

-- =====================================================
-- Policies
-- =====================================================

create policy "Users can view their own stats"
on public.user_stats
for select
using (
    auth.uid() = id
);

create policy "Users can update their own stats"
on public.user_stats
for update
using (
    auth.uid() = id
);

create policy "Users can insert their own stats"
on public.user_stats
for insert
with check (
    auth.uid() = id
);