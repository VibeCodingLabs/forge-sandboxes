'use client'

import { motion } from 'framer-motion'
import ConfigForm from '@/components/ConfigForm'
import Presets from '@/components/Presets'
import { Cpu, Server, Zap } from 'lucide-react'

const stats = [
  { icon: Zap, label: '125ms Boot', desc: 'Per microVM' },
  { icon: Cpu, label: '150 VMs/s', desc: 'Throughput' },
  { icon: Server, label: '<5 MiB', desc: 'VM overhead' }
]

export default function Home() {
  return (
    <main className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-neon-cyan via-white to-neon-purple bg-clip-text text-transparent glow">
          Forge Sandboxes
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Visual GUI for Firecracker microVM agent sandboxes.
          Configure, preview, and deploy in seconds.
        </p>
        <div className="flex justify-center gap-8 mt-8">
          {stats.map(({ icon: Icon, label, desc }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="card-glass px-6 py-4 text-center"
            >
              <Icon className="w-5 h-5 text-neon-cyan mx-auto mb-1" />
              <div className="font-bold text-neon-cyan">{label}</div>
              <div className="text-xs text-gray-400">{desc}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <ConfigForm />
        </div>
        <div>
          <Presets />
        </div>
      </div>
    </main>
  )
}
