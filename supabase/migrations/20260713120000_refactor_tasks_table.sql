-- =====================================================
-- Refatoração da tabela tasks
-- =====================================================

-- Renomeia colunas
alter table public.tasks
rename column "order" to task_order;

alter table public.tasks
rename column task_type to type;

-- Remove coluna antiga
alter table public.tasks
drop column stanza_position;

-- Adiciona relacionamento com stanzas
alter table public.tasks
add column stanza_id bigint
references public.stanzas(id)
on delete cascade;