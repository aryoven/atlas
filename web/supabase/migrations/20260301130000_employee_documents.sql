-- employee_documents: knowledge base files per AI employee
create table if not exists public.employee_documents (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.employees (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  filename text not null,
  storage_path text not null,
  mime_type text,
  size bigint,
  created_at timestamptz not null default now()
);

create index if not exists employee_documents_employee_id_created_at_idx
  on public.employee_documents (employee_id, created_at desc);

create index if not exists employee_documents_user_id_idx
  on public.employee_documents (user_id);

alter table public.employee_documents enable row level security;

drop policy if exists "Users can view their own documents" on public.employee_documents;
drop policy if exists "Users can insert their own documents" on public.employee_documents;
drop policy if exists "Users can update their own documents" on public.employee_documents;
drop policy if exists "Users can delete their own documents" on public.employee_documents;

create policy "employee_documents_select_own"
  on public.employee_documents
  for select
  to authenticated
  using (auth.uid() = user_id);

create policy "employee_documents_insert_own"
  on public.employee_documents
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "employee_documents_update_own"
  on public.employee_documents
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "employee_documents_delete_own"
  on public.employee_documents
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Private storage bucket
insert into storage.buckets (id, name, public)
values ('employee-documents', 'employee-documents', false)
on conflict (id) do update set public = false;

drop policy if exists "Users can read own employee documents storage" on storage.objects;
drop policy if exists "Users can upload own employee documents storage" on storage.objects;
drop policy if exists "Users can delete own employee documents storage" on storage.objects;
drop policy if exists "employee_documents_storage_select_own" on storage.objects;
drop policy if exists "employee_documents_storage_insert_own" on storage.objects;
drop policy if exists "employee_documents_storage_delete_own" on storage.objects;

create policy "employee_documents_storage_select_own"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'employee-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "employee_documents_storage_insert_own"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'employee-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "employee_documents_storage_delete_own"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'employee-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
