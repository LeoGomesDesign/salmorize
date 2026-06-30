-- Salmorize initial schema
-- Run in Supabase SQL Editor (Dashboard → SQL → New query)

-- ─── Profiles ────────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  streak int not null default 0,
  gems int not null default 0,
  energy int not null default 12,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'full_name',
      new.raw_user_meta_data ->> 'name',
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Psalms catalog ──────────────────────────────────────────────────────────
create table public.psalms (
  id int primary key,
  number int not null unique,
  label text not null
);

alter table public.psalms enable row level security;

create policy "Authenticated users can read psalms"
  on public.psalms for select
  to authenticated
  using (true);

-- ─── User progress per psalm ─────────────────────────────────────────────────
create table public.user_psalm_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  psalm_id int not null references public.psalms (id) on delete cascade,
  current_step int not null default 1 check (current_step between 1 and 6),
  progress int not null default 0 check (progress between 0 and 100),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, psalm_id)
);

alter table public.user_psalm_progress enable row level security;

create policy "Users can read own progress"
  on public.user_psalm_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on public.user_psalm_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on public.user_psalm_progress for update
  using (auth.uid() = user_id);

create index user_psalm_progress_user_id_idx
  on public.user_psalm_progress (user_id);

-- ─── Seed psalms (MVP: first 10) ─────────────────────────────────────────────
insert into public.psalms (id, number, label) values
  (1,  1,  'Salmo 1'),
  (2,  2,  'Salmo 2'),
  (3,  3,  'Salmo 3'),
  (4,  4,  'Salmo 4'),
  (5,  5,  'Salmo 5'),
  (6,  6,  'Salmo 6'),
  (7,  7,  'Salmo 7'),
  (8,  8,  'Salmo 8'),
  (9,  9,  'Salmo 9'),
  (10, 10, 'Salmo 10')
on conflict (id) do nothing;
