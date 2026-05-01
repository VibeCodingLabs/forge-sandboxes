'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { Copy, Download, ChevronDown, ChevronUp, CheckCheck } from 'lucide-react'

export default function JsonPreview({ config }: { config: Record<string, unknown> }) {
  const [collapsed, setCollapsed] = useState(false)
  const [copied, setCopied] = useState(false)

  const json = JSON.stringify(config, null, 2)

  const copy = async () => {
    await navigator.clipboard.writeText(json)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const download = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([json], { type: 'application/json' }))
    a.download = 'firecracker-config.json'
    a.click()
  }

  return (
    <div className="card-glass overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
        <span className="text-sm font-semibold text-neon-green">JSON Preview</span>
        <div className="flex items-center gap-1">
          <button onClick={copy} className="p-1.5 rounded hover:bg-white/10 transition-colors" title="Copy">
            {copied ? <CheckCheck className="w-4 h-4 text-neon-green" /> : <Copy className="w-4 h-4 text-gray-400" />}
          </button>
          <button onClick={download} className="p-1.5 rounded hover:bg-white/10 transition-colors" title="Download">
            <Download className="w-4 h-4 text-gray-400" />
          </button>
          <button onClick={() => setCollapsed(c => !c)} className="p-1.5 rounded hover:bg-white/10 transition-colors">
            {collapsed ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
          </button>
        </div>
      </div>
      <AnimateHeight isVisible={!collapsed}>
        <pre className="p-5 text-xs font-mono text-gray-300 overflow-auto max-h-72 bg-black/30">{json}</pre>
      </AnimateHeight>
    </div>
  )
}

function AnimateHeight({ isVisible, children }: { isVisible: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      animate={{ height: isVisible ? 'auto' : 0, opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      style={{ overflow: 'hidden' }}
    >
      {children}
    </motion.div>
  )
}
