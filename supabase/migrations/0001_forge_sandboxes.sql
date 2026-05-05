-- Forge Sandboxes schema
-- Tracks sandbox sessions, agent runs, and audit log

create table if not exists public.sandbox_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  vm_id       text not null check (vm_id in ('vm1','vm2','vm3')),
  task        text not null,
  model       text not null default 'auto',
  status      text not null default 'pending'
                check (status in ('pending','running','success','error','timeout')),
  output      text,
  duration_ms integer,
  forge_phase text,
  created_at  timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.audit_log (
  id         bigserial primary key,
  user_id    uuid references auth.users(id) on delete set null,
  event      text not null,
  metadata   jsonb,
  ip_address inet,
  created_at timestamptz not null default now()
);

-- RLS
alter table public.sandbox_sessions enable row level security;
alter table public.audit_log       enable row level security;

create policy "Users see own sessions"
  on public.sandbox_sessions for select
  using (auth.uid() = user_id);

create policy "Users insert own sessions"
  on public.sandbox_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users update own sessions"
  on public.sandbox_sessions for update
  using (auth.uid() = user_id);

create policy "Users see own audit log"
  on public.audit_log for select
  using (auth.uid() = user_id);

-- Indexes
create index on public.sandbox_sessions (user_id, created_at desc);
create index on public.audit_log (user_id, created_at desc);
