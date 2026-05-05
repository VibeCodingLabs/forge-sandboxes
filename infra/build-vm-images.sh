#!/bin/bash
# Build Firecracker kernel + 3x Alpine rootfs images
set -euo pipefail

OUT=./vm-images
mkdir -p "$OUT"

echo '[1/4] Downloading Firecracker kernel...'
curl -fsSL \
  'https://s3.amazonaws.com/spec.ccfc.min/img/hello/kernel/hello-vmlinux.bin' \
  -o "$OUT/vmlinux.bin" || echo 'Kernel download failed — use cached copy'

for VM in vm1 vm2 vm3; do
  echo "[2/4] Building rootfs for $VM..."
  docker build \
    --build-arg VM_ID="$VM" \
    -f infra/Dockerfile.vm-builder \
    -t "forge-vm-$VM:latest" . \
    --quiet

  # Extract rootfs from container filesystem
  CID=$(docker create "forge-vm-$VM:latest")
  docker export "$CID" | gzip > "$OUT/rootfs-$VM.tar.gz"
  docker rm "$CID"
  echo "  → $OUT/rootfs-$VM.tar.gz built"
done

echo '[4/4] Done. VM images ready in ./vm-images/'
ls -lh "$OUT"
