-- =====================================================
-- INITIAL SCHEMA
-- Salmorize Backend
-- =====================================================

-- =====================================================
-- TABLE: profiles
-- =====================================================
create table public.profiles (
    id uuid primary key
     references auth.users(id)
     on delete cascade,
    name text not null,
    avatar_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- =====================================================
-- FUNCTION
-- Create profile automatically after signup
-- =====================================================
create or replace function public.handle_new_user()
returns trigger 
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (
        id,
        name,
        avatar_url
    )
    values (
        NEW.id,
        coalesce(
        NEW.raw_user_meta_data->>'name','Usuário'
        ),
        coalesce(
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data ->>'picture'
        )
    );

    return NEW;
    end;
    $$;

-- =====================================================
-- Trigger
-- =====================================================
    create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function public.handle_new_user();

-- =====================================================
-- FUNCTION
-- Update updated_at automatically
-- =====================================================

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin

    NEW.updated_at = now();

    return NEW;

end;
$$;

-- =====================================================
-- TRIGGER
-- Update updated_at automatically
-- =====================================================

create trigger update_profiles_updated_at

before update on public.profiles

for each row

execute function public.update_updated_at_column();

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================

alter table public.profiles
enable row level security;

-- =====================================================
-- POLICIES
-- =====================================================

create policy "Users can view own profile"

on public.profiles

for select

using (

    auth.uid() = id

);

create policy "Users can update own profile"

on public.profiles

for update

using (

    auth.uid() = id

)

with check (

    auth.uid() = id

);