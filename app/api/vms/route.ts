import { NextResponse } from 'next/server';
import { getVMStatus } from '@/lib/firecracker/client';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const status = await getVMStatus();
  return NextResponse.json(status);
}
