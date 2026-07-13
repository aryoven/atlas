-- employee_messages: persistent chat history per AI employee
create table if not exists public.employee_messages (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz not null default now()
);

create index if not exists employee_messages_employee_id_created_at_idx
  on public.employee_messages (employee_id, created_at);

create index if not exists employee_messages_user_id_idx
  on public.employee_messages (user_id);

alter table public.employee_messages enable row level security;

create policy "Users can view their own messages"
  on public.employee_messages
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own messages"
  on public.employee_messages
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own messages"
  on public.employee_messages
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own messages"
  on public.employee_messages
  for delete
  using (auth.uid() = user_id);
