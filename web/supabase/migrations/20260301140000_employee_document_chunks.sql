-- pgvector extension for semantic document search
create extension if not exists vector;

-- extracted_text column on employee_documents (if not already present)
alter table public.employee_documents
  add column if not exists extracted_text text;

-- document chunks with 1536-dimensional embeddings (MiniLM-L6-v2)
create table if not exists public.employee_document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.employee_documents (id) on delete cascade,
  employee_id uuid not null references public.employees (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
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

alter table public.employee_document_chunks enable row level security;

drop policy if exists "employee_document_chunks_select_own" on public.employee_document_chunks;
drop policy if exists "employee_document_chunks_insert_own" on public.employee_document_chunks;
drop policy if exists "employee_document_chunks_delete_own" on public.employee_document_chunks;

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

-- Semantic similarity search scoped to employee + user
create or replace function public.match_employee_document_chunks(
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
    and 1 - (c.embedding <=> query_embedding) >= similarity_threshold
  order by c.embedding <=> query_embedding asc
  limit greatest(match_count, 1);
$$;

grant execute on function public.match_employee_document_chunks(
  vector(1536),
  uuid,
  uuid,
  integer,
  double precision
) to authenticated;
