import type { FirecrackerConfig } from './firecracker-schema'

export const PRESETS = {
  'python-agent': {
    vcpu_count: 2,
    mem_size_mib: 512,
    cpu_template: 'T2CL',
    kernel_image_path: '/kernels/python3.12.elf',
    rootfs_image_path: '/rootfs/ubuntu-python.squashfs',
    track_dirty_pages: true,
    enable_nested_virt: false
  },
  'node-runtime': {
    vcpu_count: 4,
    mem_size_mib: 1024,
    cpu_template: 'T2CL',
    kernel_image_path: '/kernels/linux-5.15.elf',
    rootfs_image_path: '/rootfs/node20-alpine.squashfs',
    track_dirty_pages: true,
    enable_nested_virt: false
  },
  'secure-agent': {
    vcpu_count: 1,
    mem_size_mib: 256,
    cpu_template: 'custom' as const,
    cpu_config: {
      cpuid: {
        '0x1/0x0/eax': '0b00000000000000000000000000000000',
        '0x7/0x0/ebx': '0bxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx0'
      }
    },
    kernel_image_path: '/kernels/hardened.elf',
    rootfs_image_path: '/rootfs/alpine-minimal.squashfs',
    track_dirty_pages: false,
    enable_nested_virt: false
  }
} satisfies Record<string, Partial<FirecrackerConfig>>

export type PresetId = keyof typeof PRESETS
