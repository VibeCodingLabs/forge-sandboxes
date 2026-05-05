-- Migration: fix_rls_auth_initplan
-- Fix: wrap auth.uid() in (select ...) to prevent per-row re-evaluation
-- Resolves: 4x auth_rls_initplan WARN on sandbox_sessions (3 policies) + audit_log (1 policy)
-- Perf impact: O(n) -> O(1) auth check per query at scale
-- Ref: https://supabase.com/docs/guides/database/database-linter?lint=0003_auth_rls_initplan

-- sandbox_sessions (3 policies)
drop policy if exists "Users see own sessions"    on public.sandbox_sessions;
drop policy if exists "Users insert own sessions" on public.sandbox_sessions;
drop policy if exists "Users update own sessions" on public.sandbox_sessions;

create policy "Users see own sessions"
  on public.sandbox_sessions for select
  using ((select auth.uid()) = user_id);

create policy "Users insert own sessions"
  on public.sandbox_sessions for insert
  with check ((select auth.uid()) = user_id);

create policy "Users update own sessions"
  on public.sandbox_sessions for update
  using ((select auth.uid()) = user_id);

-- audit_log (1 policy)
drop policy if exists "Users see own audit log" on public.audit_log;

create policy "Users see own audit log"
  on public.audit_log for select
  using ((select auth.uid()) = user_id);
