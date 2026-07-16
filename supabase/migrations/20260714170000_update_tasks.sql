-- =====================================================
-- TASKS
-- =====================================================

alter table public.tasks
add column psalm_id bigint
references public.psalms(id)
on delete cascade;

alter table public.tasks
add column global_order integer;