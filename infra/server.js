// Forge Sandbox REST API — runs on firecracker-host container
'use strict';
const http = require('http');
const { execSync, spawn } = require('child_process');

const VMS = {
  vm1: { ip: '172.16.0.10', port: 8001, status: 'idle' },
  vm2: { ip: '172.16.0.11', port: 8002, status: 'idle' },
  vm3: { ip: '172.16.0.12', port: 8003, status: 'idle' },
};

const router = {
  'GET /health': () => ({ ok: true, vms: VMS }),
  'GET /vms': () => ({ vms: VMS }),
};

const server = http.createServer(async (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  // POST /sandbox — core slash-command endpoint
  if (req.method === 'POST' && req.url === '/sandbox') {
    let body = '';
    req.on('data', d => (body += d));
    req.on('end', async () => {
      try {
        const { task, vmId = 'vm1', model = 'auto' } = JSON.parse(body);
        const vm = VMS[vmId];
        if (!vm) return res.end(JSON.stringify({ error: `Unknown VM: ${vmId}` }));

        vm.status = 'busy';
        const start = Date.now();

        // Execute task inside VM via exec (replace with firecrackerode in Node layer)
        const result = execSync(
          `echo '${task.replace(/'/g, "'\\''")}' | forge-core /sandbox --model ${model} 2>&1`,
          { timeout: 30_000, cwd: '/workspace' }
        ).toString();

        vm.status = 'idle';
        res.end(JSON.stringify({
          ok: true,
          vmId,
          model,
          duration: Date.now() - start,
          output: result,
        }));
      } catch (e) {
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    });
    return;
  }

  const handler = router[`${req.method} ${req.url}`];
  if (handler) return res.end(JSON.stringify(handler()));

  res.statusCode = 404;
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(8090, () => console.log('Forge sandbox API on :8090'));
