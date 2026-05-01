import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const url = process.env.OPENAPI_SPEC_URL ??
      'https://raw.githubusercontent.com/firecracker-microvm/firecracker/main/src/api_server/swagger/firecracker.yaml'
    const res = await fetch(url, { next: { revalidate: 3600 } })
    const spec = await res.text()
    return new NextResponse(spec, { headers: { 'Content-Type': 'application/json' } })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch OpenAPI spec' }, { status: 500 })
  }
}
