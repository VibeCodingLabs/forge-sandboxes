import { NextRequest, NextResponse } from 'next/server'
import { firecrackerConfigSchema } from '@/lib/firecracker-schema'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = firecrackerConfigSchema.parse(body)

    const host = process.env.FIRECRACKER_HOST ?? 'http://localhost:8080'
    const response = await fetch(`${host}/machine-config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(validated),
      signal: AbortSignal.timeout(10_000)
    })

    if (!response.ok) {
      const errText = await response.text()
      return NextResponse.json(
        { error: 'Orchestrator error', details: errText },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json({ success: true, vmId: result.vm_id ?? 'unknown', data: result }, { status: 201 })
  } catch (error: any) {
    const isZod = error?.name === 'ZodError'
    return NextResponse.json(
      { error: isZod ? 'Validation failed' : 'Deploy failed', details: error?.issues ?? error?.message },
      { status: isZod ? 422 : 500 }
    )
  }
}
