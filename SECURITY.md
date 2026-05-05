# Security Audit Checklist — forge-sandboxes

## Firecracker / VM Layer

| Check | Control | Status |
|-------|---------|--------|
| Kernel isolation | Fresh kernel per VM, no shared host kernel | ✅ |
| Unprivileged containers | `privileged: false`, only NET_ADMIN + SYS_PTRACE caps | ✅ |
| Network egress | iptables FORWARD DROP; only 80/443 allowed out | ✅ |
| Resource limits | 1 vCPU, 512MB RAM per VM via cgroup v2 | ✅ |
| Ephemeral VMs | Auto-shutdown post-task, no persistent rootfs state | ✅ |
| No SSH on VMs | cloud-init does not enable sshd | ✅ |
| Secrets isolation | API keys on host only; VM receives no credentials | ✅ |

## Application / API Layer (OWASP Top 10 + LLM Top 10)

| Check | Control | Status |
|-------|---------|--------|
| LLM01 Prompt injection | All task input validated via Zod; no raw user strings in system prompts | ✅ |
| LLM06 Sensitive data | No PII logged; audit_log stores metadata only | ✅ |
| A01 Broken access control | Supabase RLS on all tables; middleware JWT gate | ✅ |
| A02 Cryptographic failures | HTTPS enforced via Vercel; no secrets in repo | ✅ |
| A03 Injection | Parameterized Supabase queries; no raw SQL | ✅ |
| A05 Security misconfiguration | Security headers in vercel.json; no default creds | ✅ |
| A07 Auth failures | Supabase session management; middleware refresh | ✅ |
| A09 Logging / monitoring | audit_log table; Vercel observability | ✅ |

## Supply Chain

| Check | Control |
|-------|---------|
| Pinned base images | Alpine 3.19, Node 20 (LTS) |
| Minimal packages | Only required APK/npm packages installed |
| No hardcoded secrets | `.env.example` template; `.gitignore` enforces exclusion |

## Compliance Scope
- **NIST CSF 2.0**: Identify → Protect → Detect controls implemented
- **OWASP LLM Top 10 (2025)**: LLM01, LLM02, LLM06 mitigated at I/O boundaries
- **CWE-20**: Input validation via Zod on all API routes
- **SOC 2 Type II prep**: audit_log, RLS, HTTPS, key rotation via Vercel env vars
