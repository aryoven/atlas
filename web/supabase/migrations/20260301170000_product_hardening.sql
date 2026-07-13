-- Conversations, message scoping, and document processing lifecycle

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
  on public.employee_conversations
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "employee_conversations_insert_own"
  on public.employee_conversations
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "employee_conversations_update_own"
  on public.employee_conversations
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "employee_conversations_delete_own"
  on public.employee_conversations
  for delete
  to authenticated
  using (auth.uid() = user_id);

alter table public.employee_messages
  add column if not exists conversation_id uuid references public.employee_conversations (id) on delete cascade;

create index if not exists employee_messages_conversation_id_created_at_idx
  on public.employee_messages (conversation_id, created_at);

alter table public.employee_documents
  add column if not exists processing_status text not null default 'ready';

alter table public.employee_documents
  add column if not exists processing_error text;

-- Backfill one legacy conversation per employee/user thread
do $$
declare
  legacy record;
  new_conversation_id uuid;
begin
  for legacy in
    select
      employee_id,
      user_id,
      min(created_at) as first_message_at,
      max(created_at) as last_message_at
    from public.employee_messages
    where conversation_id is null
    group by employee_id, user_id
  loop
    new_conversation_id := gen_random_uuid();

    insert into public.employee_conversations (
      id,
      employee_id,
      user_id,
      title,
      created_at,
      updated_at
    )
    values (
      new_conversation_id,
      legacy.employee_id,
      legacy.user_id,
      'Previous conversation',
      legacy.first_message_at,
      legacy.last_message_at
    );

    update public.employee_messages
    set conversation_id = new_conversation_id
    where employee_id = legacy.employee_id
      and user_id = legacy.user_id
      and conversation_id is null;
  end loop;
end $$;

notify pgrst, 'reload schema';
