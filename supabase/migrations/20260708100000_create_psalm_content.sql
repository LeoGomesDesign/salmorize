-- =====================================================
-- PSALMS
-- =====================================================

create table if not exists public.psalms (

    id bigint generated always as identity primary key,

    number integer not null unique,

    title text not null,

    translation text not null,

    total_stanzas integer not null default 0,

    total_verses integer not null default 0,

    created_at timestamptz not null default now()

);

-- =====================================================
-- STANZAS
-- =====================================================

create table if not exists public.stanzas (

    id bigint generated always as identity primary key,

    psalm_id bigint not null
        references public.psalms(id)
        on delete cascade,

    position integer not null,

    created_at timestamptz not null default now(),

    unique(psalm_id, position)

);

-- =====================================================
-- VERSES
-- =====================================================

create table if not exists public.verses (

    id bigint generated always as identity primary key,

    stanza_id bigint not null
        references public.stanzas(id)
        on delete cascade,

    position integer not null,

    text text not null,

    word_count integer not null,

    created_at timestamptz not null default now(),

    unique(stanza_id, position)

);

-- =====================================================
-- TASKS
-- =====================================================

create table if not exists public.tasks (

    id bigint generated always as identity primary key,

    verse_id bigint
        references public.verses(id)
        on delete cascade,

    "order" integer not null,
    stanza_position integer not null,

    task_type text not null,

    recap boolean not null default false,

    recap_verses integer[] default '{}',

    battery_cost integer not null default 5,

    star_reward integer not null default 10,

    xp_reward integer not null default 10,

    created_at timestamptz not null default now()

);

-- =====================================================
-- INDEXES
-- =====================================================

create index if not exists idx_stanzas_psalm
on public.stanzas(psalm_id);

create index if not exists idx_verses_stanza
on public.verses(stanza_id);

create index if not exists idx_tasks_verse
on public.tasks(verse_id);