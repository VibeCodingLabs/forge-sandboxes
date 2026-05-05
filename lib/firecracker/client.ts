/**
 * Forge Sandboxes — firecrackerode-style VM client
 * Controls Firecracker VMs via the forge-host REST API.
 * Uses Portkey for provider-agnostic LLM routing.
 */
import { z } from 'zod';

const FC_HOST = process.env.FIRECRACKER_HOST ?? 'http://localhost:8090';

export const SandboxRequestSchema = z.object({
  task:  z.string().min(1).max(4000),
  vmId:  z.enum(['vm1', 'vm2', 'vm3']).default('vm1'),
  model: z.string().default('auto'),
});

export type SandboxRequest = z.infer<typeof SandboxRequestSchema>;

export interface SandboxResult {
  ok:       boolean;
  vmId:     string;
  model:    string;
  duration: number;
  output:   string;
  error?:   string;
}

export interface VMStatus {
  vm1: { ip: string; port: number; status: string };
  vm2: { ip: string; port: number; status: string };
  vm3: { ip: string; port: number; status: string };
}

/** POST /sandbox — executes a Forge agent task inside a microVM */
export async function runInSandbox(req: SandboxRequest): Promise<SandboxResult> {
  const parsed = SandboxRequestSchema.parse(req);

  const res = await fetch(`${FC_HOST}/sandbox`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(parsed),
    signal:  AbortSignal.timeout(35_000),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Sandbox host error ${res.status}: ${text}`);
  }

  return res.json() as Promise<SandboxResult>;
}

/** GET /health — returns VM pool status */
export async function getVMStatus(): Promise<{ ok: boolean; vms: VMStatus }> {
  const res = await fetch(`${FC_HOST}/health`, { signal: AbortSignal.timeout(5_000) });
  return res.json();
}

/** GET /vms — list all VMs */
export async function listVMs(): Promise<{ vms: VMStatus }> {
  const res = await fetch(`${FC_HOST}/vms`, { signal: AbortSignal.timeout(5_000) });
  return res.json();
}
