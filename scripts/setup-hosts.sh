#!/bin/bash

# Add nanle.local and nanle.local.api to /etc/hosts if not present
HOSTS_LINE="127.0.0.1 nanle.local nanle.local.api"

if grep -q "nanle.local" /etc/hosts && grep -q "nanle.local.api" /etc/hosts; then
  echo "[setup-hosts] nanle.local and nanle.local.api already present in /etc/hosts."
else
  echo "[setup-hosts] Adding nanle.local and nanle.local.api to /etc/hosts (requires sudo)..."
  echo "$HOSTS_LINE" | sudo tee -a /etc/hosts > /dev/null
  echo "[setup-hosts] Added: $HOSTS_LINE"
fi 