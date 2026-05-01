/**
 * Firecracker Proxy — Node.js mock/bridge
 * Replace exec calls with real firectl/firecracker-go-sdk in production
 */
const express = require('express')
const app = express()
app.use(express.json())

const vms = new Map()

app.get('/health', (_, res) => res.json({ status: 'ok' }))

app.put('/machine-config', (req, res) => {
  const config = req.body
  const vmId = `sandbox-${Date.now()}`
  vms.set(vmId, { config, status: 'running', created: new Date().toISOString() })
  console.log(`[Proxy] Deployed VM: ${vmId}`, config)
  // In production: spawn firectl or call Firecracker Unix socket
  res.json({ vm_id: vmId, status: 'running', config })
})

app.get('/vms', (_, res) => {
  res.json(Object.fromEntries(vms))
})

app.delete('/vms/:id', (req, res) => {
  vms.delete(req.params.id)
  res.json({ deleted: req.params.id })
})

app.get('/openapi.json', (_, res) => {
  res.json({
    openapi: '3.1.0',
    info: { title: 'Firecracker Proxy', version: '1.0.0' },
    paths: {
      '/machine-config': { put: { summary: 'Deploy microVM', requestBody: { required: true } } }
    }
  })
})

app.listen(8080, () => console.log('🔥 Firecracker Proxy on :8080'))
