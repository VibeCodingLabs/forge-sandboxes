'use client'

import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { HardDrive, Upload, CheckCircle2, AlertCircle } from 'lucide-react'
import { useState } from 'react'

interface Props {
  onKernel: (path: string) => void
  onRootfs: (path: string) => void
}

interface FileState { name: string; size: number; type: 'kernel' | 'rootfs' }

export default function DragDropKernel({ onKernel, onRootfs }: Props) {
  const [files, setFiles] = useState<FileState[]>([])
  const [errors, setErrors] = useState<string[]>([])

  const onDrop = (accepted: File[]) => {
    setErrors([])
    const newFiles: FileState[] = []
    accepted.forEach(f => {
      if (f.name.endsWith('.elf') || f.name.toLowerCase().includes('kernel')) {
        newFiles.push({ name: f.name, size: f.size, type: 'kernel' })
        onKernel(`/kernels/${f.name}`)
      } else if (f.name.includes('squashfs') || f.name.includes('rootfs') || f.name.endsWith('.img')) {
        newFiles.push({ name: f.name, size: f.size, type: 'rootfs' })
        onRootfs(`/rootfs/${f.name}`)
      } else {
        setErrors(prev => [...prev, `Unsupported: ${f.name} (need .elf or .squashfs)`])
      }
    })
    setFiles(prev => [...prev, ...newFiles])
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/x-executable': ['.elf'], 'application/octet-stream': ['.squashfs', '.img'] },
    maxFiles: 2
  })

  const formatSize = (bytes: number) => bytes > 1e6 ? `${(bytes/1e6).toFixed(1)} MB` : `${(bytes/1e3).toFixed(0)} KB`

  return (
    <div className="card-glass p-6 space-y-4">
      <h2 className="font-semibold text-neon-cyan flex items-center gap-2">
        <HardDrive className="w-4 h-4" /> Kernel & Rootfs
      </h2>
      <motion.div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-200 ${
          isDragActive ? 'border-neon-cyan bg-neon-cyan/5 scale-[1.01]' : 'border-gray-700 hover:border-gray-500'
        }`}
        whileHover={{ scale: 1.01 }}
      >
        <input {...getInputProps()} />
        <Upload className={`w-10 h-10 mx-auto mb-3 ${isDragActive ? 'text-neon-cyan animate-bounce' : 'text-gray-500'}`} />
        <p className="text-sm text-gray-300">
          {isDragActive ? 'Drop it!' : 'Drag kernel (.elf) and rootfs (.squashfs) here'}
        </p>
        <p className="text-xs text-gray-600 mt-1">or click to browse</p>
      </motion.div>
      <AnimatePresence>
        {files.map((f, i) => (
          <motion.div
            key={f.name}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`flex items-center gap-3 p-3 rounded-lg border ${
              f.type === 'kernel' ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-purple-500/10 border-purple-500/30'
            }`}
          >
            <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${f.type === 'kernel' ? 'text-neon-cyan' : 'text-neon-purple'}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-mono truncate">{f.name}</p>
              <p className="text-xs text-gray-500">{f.type} · {formatSize(f.size)}</p>
            </div>
          </motion.div>
        ))}
        {errors.map(e => (
          <motion.div key={e} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-red-400 text-sm p-2">
            <AlertCircle className="w-4 h-4" /> {e}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
