#!/usr/bin/env bash
#
# Erzeugt die Linux-Screenshot-Baselines (…-chromium-linux.png) im selben
# Container-Image wie die GitHub-Actions-CI, damit die Bilder pixelgleich
# sind (kein Font-Drift zwischen macOS und Linux).
#
# Nur fuer die plattformgebundenen toMatchScreenshot-Tests noetig. Die
# darwin-Baselines (lokale Entwicklung) erzeugst du dagegen direkt mit:
#   cd frontend && pnpm test:browser:update
#
# Image-Tag und pnpm-Version MUESSEN zu .github/workflows/ci.yml passen,
# sonst entsteht eine Baseline, die im CI nicht matcht.
set -euo pipefail

PLAYWRIGHT_IMAGE="mcr.microsoft.com/playwright:v1.60.0-jammy"
PNPM_VERSION="11.5.3"

# Repo-Root = Verzeichnis dieses Scripts (unabhaengig vom Aufrufort).
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# -v /app/node_modules : anonymes Volume, schuetzt die lokalen
#   (darwin-)node_modules vor der Linux-Installation im Container.
# --store-dir /tmp/pnpm-store : verhindert ein .pnpm-store-Artefakt im Repo.
docker run --rm \
  -v "$ROOT/frontend":/app \
  -v /app/node_modules \
  -w /app \
  "$PLAYWRIGHT_IMAGE" \
  bash -c "corepack enable && corepack prepare pnpm@$PNPM_VERSION --activate && \
    pnpm install --frozen-lockfile --store-dir /tmp/pnpm-store && \
    HEADLESS=true pnpm exec vitest run --project browser -u"

echo
echo "✓ Linux-Baselines aktualisiert. Geaenderte Bilder pruefen und committen:"
echo "  git status frontend/src"
