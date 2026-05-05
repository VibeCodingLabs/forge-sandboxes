#!/bin/sh
set -e

# Custom fc-bridge for all 3 VMs
ip link add name fc-bridge type bridge 2>/dev/null || true
ip addr add 172.16.0.1/24 dev fc-bridge 2>/dev/null || true
ip link set fc-bridge up

# Isolate VM network: allow only HTTP/HTTPS egress, deny everything else
iptables -F FORWARD 2>/dev/null || true
iptables -P FORWARD DROP
iptables -A FORWARD -i fc-bridge -p tcp --dport 80  -j ACCEPT
iptables -A FORWARD -i fc-bridge -p tcp --dport 443 -j ACCEPT
iptables -A FORWARD -i fc-bridge -m state --state ESTABLISHED,RELATED -j ACCEPT

echo 'Network isolation configured'
