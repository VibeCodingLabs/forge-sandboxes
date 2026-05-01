'use client'

import { useMutation } from '@tanstack/react-query'
import { firecrackerConfigSchema, type FirecrackerConfig } from '@/lib/firecracker-schema'

export function useFirecrackerDeploy() {
  const mutation = useMutation({
    mutationFn: async (config: Partial<FirecrackerConfig>) => {
      const validated = firecrackerConfigSchema.parse(config)
      const res = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validated)
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.details ?? 'Deploy failed')
      }
      return res.json()
    },
    onSuccess: (data) => {
      console.log('✅ Sandbox deployed:', data.vmId)
      alert(`✅ Sandbox deployed! VM ID: ${data.vmId}`)
    },
    onError: (error: Error) => {
      console.error('❌ Deploy failed:', error.message)
      alert(`❌ Deploy failed: ${error.message}`)
    }
  })

  return { deploy: mutation.mutate, isDeploying: mutation.isPending }
}
