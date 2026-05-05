#!/usr/bin/env node
// Integration test: /sandbox slash command end-to-end
'use strict';

const BASE = process.env.TEST_URL || 'http://localhost:3000';
const TOKEN = process.env.TEST_SUPABASE_TOKEN || '';

async function run(label, fn) {
  process.stdout.write(`  ${label}... `);
  try {
    await fn();
    console.log('\u2705 PASS');
  } catch (e) {
    console.log(`\u274c FAIL: ${e.message}`);
    process.exitCode = 1;
  }
}

(async () => {
  console.log('\nforge-sandboxes integration tests\n');

  // T1: health check
  await run('GET /api/vms — unauthenticated returns 401', async () => {
    const r = await fetch(`${BASE}/api/vms`);
    if (r.status !== 401) throw new Error(`Expected 401 got ${r.status}`);
  });

  // T2: sandbox requires auth
  await run('POST /api/sandbox — no token returns 401', async () => {
    const r = await fetch(`${BASE}/api/sandbox`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task: 'echo hello' }),
    });
    if (r.status !== 401) throw new Error(`Expected 401 got ${r.status}`);
  });

  // T3: validation
  await run('POST /api/sandbox — empty task returns 422', async () => {
    if (!TOKEN) { console.log('(skipped — no TEST_SUPABASE_TOKEN)'); return; }
    const r = await fetch(`${BASE}/api/sandbox`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({ task: '' }),
    });
    if (r.status !== 422) throw new Error(`Expected 422 got ${r.status}`);
  });

  // T4: valid sandbox run
  await run('POST /api/sandbox — valid task (vm1, auto model)', async () => {
    if (!TOKEN) { console.log('(skipped — no TEST_SUPABASE_TOKEN)'); return; }
    const r = await fetch(`${BASE}/api/sandbox`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({ task: 'forge evaluate-idea "hello API"', vmId: 'vm1' }),
    });
    const body = await r.json();
    if (!body.sessionId) throw new Error('No sessionId returned');
  });

  console.log('\nDone.');
})();
