-- =====================================================
-- Migration: create_psalm_content
-- =====================================================

-- =========================
-- Psalms
-- =========================

create table public.psalms (
    id bigint generated always as identity primary key,

    number integer not null unique,
    slug text not null unique,
    title text not null,

    total_stanzas integer not null default 0
        check (total_stanzas >= 0),

    total_verses integer not null default 0
        check (total_verses >= 0),

    is_published boolean not null default false,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);


-- =========================
-- Stanzas
-- =========================

create table public.stanzas (
    id bigint generated always as identity primary key,

    psalm_id bigint not null
        references public.psalms(id)
        on delete cascade,

    position integer not null
        check (position > 0),

    total_verses integer not null default 0
        check (total_verses >= 0),

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    unique(psalm_id, position)
);


-- =========================
-- Verses
-- =========================

create table public.verses (
    id bigint generated always as identity primary key,

    stanza_id bigint not null
        references public.stanzas(id)
        on delete cascade,

    position integer not null
        check (position > 0),

    text text not null,

    battery_cost integer not null default 5
        check (battery_cost >= 0),

    stars_reward integer not null default 10
        check (stars_reward >= 0),

    xp_reward integer not null default 10
        check (xp_reward >= 0),

    difficulty integer not null default 1
        check (difficulty between 1 and 3),

    word_count integer not null default 0
        check (word_count >= 0),

    is_title boolean not null default false,

    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),

    unique(stanza_id, position)
);


-- =========================
-- Índices
-- =========================

create index idx_stanzas_psalm
on public.stanzas(psalm_id);

create index idx_verses_stanza
on public.verses(stanza_id);

-- =========================
-- Updated_at Trigger
-- =========================

create trigger update_psalms_updated_at
before update on public.psalms
for each row
execute function public.update_updated_at_column();

create trigger update_stanzas_updated_at
before update on public.stanzas
for each row
execute function public.update_updated_at_column();

create trigger update_verses_updated_at
before update on public.verses
for each row
execute function public.update_updated_at_column();

-- =========================
-- RLS
-- =========================

alter table public.psalms enable row level security;
alter table public.stanzas enable row level security;
alter table public.verses enable row level security;

create policy "Anyone can read psalms"
on public.psalms
for select
using (true);

create policy "Anyone can read stanzas"
on public.stanzas
for select
using (true);

create policy "Anyone can read verses"
on public.verses
for select
using (true);
