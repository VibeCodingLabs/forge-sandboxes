'use client'

import { motion } from 'framer-motion'
import { PRESETS } from '@/lib/presets'
import type { PresetId } from '@/lib/presets'
import { BookMarked } from 'lucide-react'

export default function Presets() {
  const loadPreset = (id: PresetId) => {
    const p = PRESETS[id]
    console.log('Load preset:', p)
    // Dispatch to shared form store if needed
  }

  return (
    <div className="card-glass p-5 sticky top-6">
      <h2 className="font-semibold text-neon-cyan mb-4 flex items-center gap-2">
        <BookMarked className="w-4 h-4" /> Presets
      </h2>
      <div className="space-y-2">
        {(Object.keys(PRESETS) as PresetId[]).map((id, i) => {
          const p = PRESETS[id]
          return (
            <motion.button
              key={id}
              onClick={() => loadPreset(id)}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ x: 4 }}
              className="w-full text-left p-3 rounded-lg border border-gray-700 hover:border-neon-cyan/50 hover:bg-neon-cyan/5 transition-all group"
            >
              <div className="font-mono text-sm text-white group-hover:text-neon-cyan transition-colors">{id}</div>
              <div className="text-xs text-gray-500 mt-0.5">{p.vcpu_count}vCPU · {p.mem_size_mib}MiB · {p.cpu_template}</div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
