#!/usr/bin/env bash
set -euo pipefail

DEPLOY_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_FILE="$DEPLOY_DIR/deploy.log"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

log "=== Deploy started ==="

cd "$DEPLOY_DIR"

log "Pulling latest code..."
git pull origin master

log "Installing dependencies..."
npm install

log "Building app..."
npm run build

log "Restarting PM2..."
pm2 restart cluedo --update-env

log "=== Deploy complete ==="
