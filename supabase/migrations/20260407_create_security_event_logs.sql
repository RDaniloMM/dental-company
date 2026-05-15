create extension if not exists pgcrypto;

create table if not exists public.security_event_logs (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  actor_user_id uuid references auth.users(id) on delete set null,
  identifier_hash text,
  ip_hash text,
  user_agent text,
  severity text not null default 'info' check (severity in ('info', 'warning', 'critical')),
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index if not exists security_event_logs_occurred_at_idx
  on public.security_event_logs (occurred_at desc);

create index if not exists security_event_logs_event_type_idx
  on public.security_event_logs (event_type);

create index if not exists security_event_logs_actor_user_id_idx
  on public.security_event_logs (actor_user_id);

alter table public.security_event_logs enable row level security;

drop policy if exists security_event_logs_admin_read on public.security_event_logs;
create policy security_event_logs_admin_read
on public.security_event_logs
for select
to authenticated
using (
  exists (
    select 1
    from public.personal
    where personal.id = auth.uid()
      and personal.activo = true
      and personal.rol = 'Admin'
  )
);
