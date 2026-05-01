# 🔥 Forge Sandboxes

> Visual GUI for configuring and deploying [Firecracker microVMs](https://firecracker-microvm.github.io/) as agent sandboxes — no JSON wrangling required.

[![Next.js](https://img.shields.io/badge/next.js-16-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/tailwindcss-3.4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/framer--motion-11-ff0055?logo=framer&logoColor=white)](https://www.framer.com/motion)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)

---

## What Is This?

Firecracker microVMs provide hardware-level isolation for AI agent sandboxes — but configuring them requires raw JSON API calls, bitmap masking, and kernel path management. **Forge Sandboxes** is a visual GUI that generates all that config for you.

### The Problem

```bash
# Without Forge Sandboxes — raw curl nightmare
curl --unix-socket /tmp/firecracker.socket \
  -X PUT http://localhost/machine-config \
  -d '{"vcpu_count":4,"mem_size_mib":1024,"cpu_template":"T2CL"}'
```

### The Solution

Drag sliders. Pick a preset. Click **Deploy**. ✅

---

## Features

- 🎚️ **Visual sliders** for vCPU count (1–64) and memory (128 MiB–64 GiB)
- 📦 **CPU template picker** — T2CL, T2A, C3, or custom CPUID bitmaps
- 🗂️ **Drag-drop** kernel (`.elf`) and rootfs (`.squashfs`) upload
- 🤖 **Agent presets** — Python 3.12, Node 20, Secure (hardened)
- 👁️ **Live JSON preview** with copy/export
- 🚀 **One-click deploy** via OpenAPI proxy to your Firecracker orchestrator
- 🌑 **Cyberpunk neon UI** with Framer Motion animations

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│              Next.js 16 App Router               │
│  ┌──────────────┐  ┌────────────────────────┐   │
│  │  ConfigForm  │  │  DragDropKernel/Rootfs  │   │
│  │  (Sliders)   │  │  (react-dropzone)       │   │
│  └──────┬───────┘  └──────────┬─────────────┘   │
│         │   Zod Validation    │                  │
│         └─────────┬───────────┘                  │
│               JsonPreview                        │
│                   │                              │
│          /api/deploy (Next.js Route)             │
└─────────────────────────┬───────────────────────┘
                          │ HTTP
              ┌───────────▼───────────┐
              │  Firecracker Proxy    │
              │  (Node/Python)        │
              └───────────┬───────────┘
                          │ Unix Socket
              ┌───────────▼───────────┐
              │  Firecracker VMM      │
              │  (KVM microVMs)       │
              └───────────────────────┘
```

---

## Quick Start

### Prerequisites

- Node.js 20+
- npm 10+
- Docker (optional, for full stack)

### Development

```bash
# Clone
git clone https://github.com/VibeCodingLabs/forge-sandboxes.git
cd forge-sandboxes

# Install
npm install

# Configure
cp .env.example .env.local

# Run
npm run dev
# Open http://localhost:3000
```

### Docker (Full Stack)

```bash
docker-compose up -d
# GUI: http://localhost:3000
# Proxy: http://localhost:8080
```

---

## Project Structure

```
forge-sandboxes/
├── app/                         # Next.js 16 App Router
│   ├── api/
│   │   ├── deploy/route.ts      # Firecracker proxy endpoint
│   │   └── openapi/route.ts     # OpenAPI spec loader
│   ├── layout.tsx               # Root layout + providers
│   └── page.tsx                 # Dashboard
├── components/
│   ├── ui/                      # shadcn/ui primitives
│   ├── ConfigForm.tsx           # Main config sliders/dropdowns
│   ├── DragDropKernel.tsx       # Kernel/rootfs upload
│   ├── JsonPreview.tsx          # Live JSON view + export
│   └── Presets.tsx              # Agent preset selector
├── hooks/
│   └── use-firecracker.ts       # React Query deploy hook
├── lib/
│   ├── firecracker-schema.ts    # Zod schemas (mirrors FC API)
│   ├── presets.ts               # Preset definitions
│   └── utils.ts                 # cn() + helpers
├── proxy/
│   └── server.js                # Node proxy to Firecracker
├── .github/workflows/
│   └── ci.yml                   # CI/CD pipeline
├── docker-compose.yml
├── Dockerfile
└── tailwind.config.ts
```

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `FIRECRACKER_HOST` | `http://localhost:8080` | Firecracker proxy URL |
| `NEXT_PUBLIC_FIRECRACKER_HOST` | `http://localhost:8080` | Client-side proxy URL |
| `OPENAPI_SPEC_URL` | `/api/openapi` | OpenAPI spec endpoint |

---

## Agent Presets

| Preset | vCPUs | Memory | Template | Use Case |
|--------|-------|--------|----------|----------|
| `python-agent` | 2 | 512 MiB | T2CL | Python 3.12 AI agents |
| `node-runtime` | 4 | 1024 MiB | T2CL | Node.js 20 code exec |
| `secure-agent` | 1 | 256 MiB | Custom | Hardened, minimal attack surface |

---

## CPU Templates

| Template | CPU Target | Notes |
|----------|-----------|-------|
| `T2CL` | Intel Cascade Lake | Recommended for x86_64 |
| `T2A` | AMD Milan | Recommended for AMD |
| `C3` | Intel Skylake | Legacy |
| `custom` | Any | Full CPUID bitmap control |

---

## Contributing

1. Fork → `git checkout -b feat/my-feature`
2. Commit → `git commit -m 'feat: ...'`
3. Push → `git push origin feat/my-feature`
4. Open Pull Request

---

## License

MIT — see [LICENSE](./LICENSE)

---

> Built by [VibeCodingLabs](https://github.com/VibeCodingLabs) · Phantom Digital LLC
