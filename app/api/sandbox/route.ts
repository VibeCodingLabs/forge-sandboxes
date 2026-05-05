/**
 * POST /api/sandbox
 * The /sandbox slash command entry point for Forge agents.
 * Auth: Supabase JWT (enforced via middleware)
 * Body: { task: string, vmId?: 'vm1'|'vm2'|'vm3', model?: string }
 */
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import { runInSandbox, SandboxRequestSchema } from '@/lib/firecracker/client';
import { z } from 'zod';

export const runtime = 'nodejs'; // Needs fetch + long timeout
export const maxDuration = 60;   // 60s for VM boot + agent exec

export async function POST(req: NextRequest) {
  // 1. Auth check
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Parse + validate body (OWASP LLM01 — no raw user input in prompts)
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const parsed = SandboxRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const admin = createAdminSupabaseClient();

  // 3. Create session record
  const { data: session, error: insertError } = await admin
    .from('sandbox_sessions')
    .insert({
      user_id: user.id,
      vm_id:   parsed.data.vmId,
      task:    parsed.data.task,
      model:   parsed.data.model,
      status:  'running',
    })
    .select('id')
    .single();

  if (insertError) {
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }

  // 4. Execute in Firecracker VM
  let result;
  try {
    result = await runInSandbox(parsed.data);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    await admin.from('sandbox_sessions').update({
      status: 'error',
      output: msg,
      completed_at: new Date().toISOString(),
    }).eq('id', session.id);

    return NextResponse.json({ error: msg }, { status: 502 });
  }

  // 5. Update session with result
  await admin.from('sandbox_sessions').update({
    status:       result.ok ? 'success' : 'error',
    output:       result.output,
    duration_ms:  result.duration,
    completed_at: new Date().toISOString(),
  }).eq('id', session.id);

  // 6. Audit log
  await admin.from('audit_log').insert({
    user_id:  user.id,
    event:    'sandbox.run',
    metadata: { session_id: session.id, vm_id: parsed.data.vmId, model: parsed.data.model, ok: result.ok },
    ip_address: req.headers.get('x-forwarded-for') ?? req.ip,
  });

  return NextResponse.json({ sessionId: session.id, ...result });
}

export async function GET(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data } = await supabase
    .from('sandbox_sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  return NextResponse.json({ sessions: data ?? [] });
}
