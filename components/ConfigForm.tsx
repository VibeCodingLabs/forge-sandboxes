'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { firecrackerConfigSchema, type FirecrackerConfig } from '@/lib/firecracker-schema'
import { useFirecrackerDeploy } from '@/hooks/use-firecracker'
import DragDropKernel from './DragDropKernel'
import JsonPreview from './JsonPreview'
import { Cpu, MemoryStick, Layers, Rocket } from 'lucide-react'

type FormData = FirecrackerConfig

const TEMPLATES = [
  { value: 'T2CL', label: 'T2CL — Intel Cascade Lake' },
  { value: 'T2A',  label: 'T2A  — AMD Milan' },
  { value: 'C3',   label: 'C3   — Intel Skylake (legacy)' },
  { value: 'custom', label: 'Custom — CPUID bitmap' }
]

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

export default function ConfigForm() {
  const [kernelPath, setKernelPath] = useState('')
  const [rootfsPath, setRootfsPath] = useState('')

  const form = useForm<FormData>({
    resolver: zodResolver(firecrackerConfigSchema),
    defaultValues: { vcpu_count: 4, mem_size_mib: 1024, cpu_template: 'T2CL', track_dirty_pages: true }
  })

  const vcpu = form.watch('vcpu_count')
  const mem = form.watch('mem_size_mib')
  const template = form.watch('cpu_template')
  const { deploy, isDeploying } = useFirecrackerDeploy()

  const onSubmit = (data: FormData) => {
    deploy({ ...data, kernel_image_path: kernelPath, rootfs_image_path: rootfsPath })
  }

  const config = { ...form.getValues(), kernel_image_path: kernelPath, rootfs_image_path: rootfsPath }

  return (
    <motion.form onSubmit={form.handleSubmit(onSubmit)} variants={container} initial="hidden" animate="show" className="space-y-5">

      {/* CPU + Memory */}
      <motion.div variants={item} className="card-glass p-6">
        <h2 className="font-semibold text-neon-cyan mb-5 flex items-center gap-2">
          <Cpu className="w-4 h-4" /> Compute
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">vCPUs</span>
              <span className="font-mono text-neon-cyan font-bold">{vcpu}</span>
            </div>
            <input
              type="range" min={1} max={64} step={1}
              value={vcpu}
              onChange={e => form.setValue('vcpu_count', +e.target.value)}
              className="w-full h-2 rounded-full appearance-none bg-gray-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neon-cyan cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>1</span><span>64</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Memory</span>
              <span className="font-mono text-neon-purple font-bold">{mem >= 1024 ? `${mem/1024}GiB` : `${mem}MiB`}</span>
            </div>
            <input
              type="range" min={128} max={65536} step={128}
              value={mem}
              onChange={e => form.setValue('mem_size_mib', +e.target.value)}
              className="w-full h-2 rounded-full appearance-none bg-gray-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neon-purple cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-600">
              <span>128MiB</span><span>64GiB</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* CPU Template */}
      <motion.div variants={item} className="card-glass p-6">
        <h2 className="font-semibold text-neon-cyan mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4" /> CPU Template
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {TEMPLATES.map(t => (
            <button
              key={t.value}
              type="button"
              onClick={() => form.setValue('cpu_template', t.value as any)}
              className={`p-3 rounded-lg border text-xs font-mono transition-all ${
                template === t.value
                  ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan'
                  : 'border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              {t.value}
              <div className="text-gray-500 font-sans normal-case mt-0.5 text-[10px] leading-tight">{t.label.split('—')[1]?.trim()}</div>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Drag Drop */}
      <motion.div variants={item}>
        <DragDropKernel onKernel={setKernelPath} onRootfs={setRootfsPath} />
      </motion.div>

      {/* JSON Preview */}
      <motion.div variants={item}>
        <JsonPreview config={config} />
      </motion.div>

      {/* Deploy */}
      <motion.button
        variants={item}
        type="submit"
        disabled={isDeploying}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-neon-cyan to-neon-purple hover:from-neon-purple hover:to-neon-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Rocket className="w-5 h-5" />
        {isDeploying ? 'Deploying...' : 'Deploy Sandbox'}
      </motion.button>
    </motion.form>
  )
}
