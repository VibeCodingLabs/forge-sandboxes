import { z } from 'zod'

export const cpuConfigSchema = z.object({
  cpuid: z.record(z.string(), z.string()).optional(),
  msrs:  z.record(z.string(), z.string()).optional()
}).optional()

export const firecrackerConfigSchema = z.object({
  vcpu_count:          z.number().int().min(1).max(64),
  mem_size_mib:        z.number().int().min(128).max(1_048_576),
  cpu_template:        z.enum(['T2CL', 'T2A', 'C3', 'T2', 'T2S', 'T2A', 'custom']).optional(),
  cpu_config:          cpuConfigSchema,
  kernel_image_path:   z.string().optional(),
  rootfs_image_path:   z.string().optional(),
  enable_nested_virt:  z.boolean().default(false),
  track_dirty_pages:   z.boolean().default(true)
})

export type FirecrackerConfig = z.infer<typeof firecrackerConfigSchema>
