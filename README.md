# forge-sandboxes

> Provider-agnostic Forge Framework AI agents running inside Firecracker microVMs — isolated, fast, production-secure.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FVibeCodingLabs%2Fforge-sandboxes)

## What This Is

Forge Sandboxes combines three layers:

| Layer | Technology | Purpose |
|-------|------------|--------|
| **Isolation** | Firecracker microVMs | Fresh kernel per agent run, ~130ms boot |
| **Orchestration** | Forge Framework (your `forge-core`) | Phase gates, L1-L7 verification |
| **Auth + DB** | Supabase | JWT auth, RLS-protected session logs |
| **Deployment** | Vercel (Next.js App Router) | Edge-compatible, zero-config deploy |
| **LLM Routing** | Portkey | Provider-agnostic: Claude, GPT-4o, Gemini, Groq, etc. |

## Quick Start

```bash
git clone https://github.com/VibeCodingLabs/forge-sandboxes
cd forge-sandboxes
cp .env.example .env.local  # fill in Supabase + Portkey keys
npm install
npm run dev
```

## Docker Compose (Firecracker stack)

```bash
# Build VM images (Alpine rootfs + Forge CLI pre-installed)
make build

# Spin up 3 Firecracker VMs + web app
docker compose up -d

# Run tests
make test
```

## /sandbox Slash Command

```bash
# POST /api/sandbox (requires Supabase JWT)
curl -X POST https://your-app.vercel.app/api/sandbox \\
  -H "Authorization: Bearer <supabase-jwt>" \\
  -H "Content-Type: application/json" \\
  -d '{ "task": "forge init hello-api", "vmId": "vm1", "model": "auto" }'

# Response
# { "sessionId": "uuid", "ok": true, "duration": 1420, "output": "..." }
```

## Architecture

```
Client
  │
  └── POST /api/sandbox (Next.js, Vercel)
        │ Supabase JWT auth check
        │ Zod input validation (LLM01 mitigation)
        │ Create sandbox_session record (RLS)
        │
        └── forge-host:8090/sandbox
              │ Forge phase gate check
              │ Spawn Firecracker microVM
              │   └─ Alpine rootfs + Node.js + Forge CLI
              │   └─ cloud-init auto-installs dependencies
              │   └─ fc-bridge network (HTTP only egress)
              │ Agent task → /sandbox command
              │ forge-core verify --phase VERIFY
              └── VM shutdown + audit log
```

## VM Pool

| VM | IP | CPU | RAM | Port |
|----|----|-----|-----|------|
| vm1 | 172.16.0.10 | 1 vCPU | 512 MB | 8001 |
| vm2 | 172.16.0.11 | 1 vCPU | 512 MB | 8002 |
| vm3 | 172.16.0.12 | 1 vCPU | 512 MB | 8003 |

## Example Tasks

```bash
# hello API
forge-sandbox run examples/hello-api.yaml

# Code review agent
forge-sandbox run examples/code-review-agent.yaml

# Data pipeline
forge-sandbox run examples/data-pipeline.yaml
```

## Deploy to Vercel

```bash
npm i -g vercel
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add PORTKEY_API_KEY
vercel env add FIRECRACKER_HOST   # your Firecracker host public URL
vercel --prod
```

## Supabase Setup

```bash
npx supabase db push
# Applies supabase/migrations/0001_forge_sandboxes.sql
# Creates: sandbox_sessions, audit_log + RLS policies
```

## Security

See [SECURITY.md](./SECURITY.md) for the full audit checklist (OWASP Top 10, LLM Top 10, NIST CSF 2.0, SOC 2 prep).

## License

MIT — VibeCodingLabs
