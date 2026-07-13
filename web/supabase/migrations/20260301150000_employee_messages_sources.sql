-- Persist RAG source citations on assistant messages
alter table public.employee_messages
  add column if not exists sources jsonb;
