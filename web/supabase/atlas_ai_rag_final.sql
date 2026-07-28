-- Atlas AI RAG final schema
-- Safe/idempotent migration for current Atlas AI project

create extension if not exists vector;

alter table public.employee_documents
  add column if not exists extracted_text text;

alter table public.employee_messages
  add column if not exists sources jsonb;

create table if not exists public.employee_document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null
    references public.employee_documents (id)
    on delete cascade,
  employee_id uuid not null
    references public.employees (id)
    on delete cascade,
  user_id uuid not null
    references auth.users (id)
    on delete cascade,
  content text not null,
  chunk_index integer not null,
  embedding vector(1536) not null,
  created_at timestamptz not null default now()
);

create index if not exists employee_document_chunks_document_id_idx
  on public.employee_document_chunks (document_id);

create index if not exists employee_document_chunks_employee_user_idx
  on public.employee_document_chunks (employee_id, user_id);

create index if not exists employee_document_chunks_embedding_idx
  on public.employee_document_chunks
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

alter table public.employee_document_chunks
  enable row level security;

drop policy if exists "employee_document_chunks_select_own"
  on public.employee_document_chunks;

drop policy if exists "employee_document_chunks_insert_own"
  on public.employee_document_chunks;

drop policy if exists "employee_document_chunks_delete_own"
  on public.employee_document_chunks;

create policy "employee_document_chunks_select_own"
  on public.employee_document_chunks
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "employee_document_chunks_insert_own"
  on public.employee_document_chunks
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "employee_document_chunks_delete_own"
  on public.employee_document_chunks
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Remove previous RPC signatures to prevent PostgREST ambiguity

drop function if exists public.match_employee_document_chunks(
  vector,
  uuid,
  uuid,
  integer
);

drop function if exists public.match_employee_document_chunks(
  vector,
  uuid,
  uuid,
  integer,
  double precision
);

create function public.match_employee_document_chunks(
  query_embedding vector(1536),
  match_employee_id uuid,
  match_user_id uuid,
  match_count integer default 5,
  similarity_threshold double precision default 0.5
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  chunk_index integer,
  similarity double precision
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    c.id,
    c.document_id,
    c.content,
    c.chunk_index,
    1 - (c.embedding <=> query_embedding) as similarity
  from public.employee_document_chunks c
  where c.employee_id = match_employee_id
    and c.user_id = match_user_id
    and c.user_id = auth.uid()
    and 1 - (c.embedding <=> query_embedding) >= similarity_threshold
  order by c.embedding <=> query_embedding asc
  limit greatest(match_count, 1);
$$;

grant execute on function public.match_employee_document_chunks(
  vector,
  uuid,
  uuid,
  integer,
  double precision
) to authenticated;

notify pgrst, 'reload schema';

-- Product hardening: conversations and document processing lifecycle

create table if not exists public.employee_conversations (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists employee_conversations_employee_user_updated_idx
  on public.employee_conversations (employee_id, user_id, updated_at desc);

alter table public.employee_conversations enable row level security;

drop policy if exists "employee_conversations_select_own" on public.employee_conversations;
drop policy if exists "employee_conversations_insert_own" on public.employee_conversations;
drop policy if exists "employee_conversations_update_own" on public.employee_conversations;
drop policy if exists "employee_conversations_delete_own" on public.employee_conversations;

create policy "employee_conversations_select_own"
  on public.employee_conversations for select to authenticated
  using (auth.uid() = user_id);

create policy "employee_conversations_insert_own"
  on public.employee_conversations for insert to authenticated
  with check (auth.uid() = user_id);

create policy "employee_conversations_update_own"
  on public.employee_conversations for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "employee_conversations_delete_own"
  on public.employee_conversations for delete to authenticated
  using (auth.uid() = user_id);

alter table public.employee_messages
  add column if not exists conversation_id uuid
  references public.employee_conversations (id) on delete cascade;

create index if not exists employee_messages_conversation_id_created_at_idx
  on public.employee_messages (conversation_id, created_at);

alter table public.employee_documents
  add column if not exists processing_status text not null default 'ready';

alter table public.employee_documents
  add column if not exists processing_error text;

do $$
declare
  legacy record;
  new_conversation_id uuid;
begin
  for legacy in
    select employee_id, user_id, min(created_at) as first_message_at, max(created_at) as last_message_at
    from public.employee_messages
    where conversation_id is null
    group by employee_id, user_id
  loop
    new_conversation_id := gen_random_uuid();

    insert into public.employee_conversations (id, employee_id, user_id, title, created_at, updated_at)
    values (new_conversation_id, legacy.employee_id, legacy.user_id, 'Previous conversation', legacy.first_message_at, legacy.last_message_at);

    update public.employee_messages
    set conversation_id = new_conversation_id
    where employee_id = legacy.employee_id and user_id = legacy.user_id and conversation_id is null;
  end loop;
end $$;

notify pgrst, 'reload schema';