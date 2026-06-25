#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FRONTEND="$SCRIPT_DIR/frontend"
BACKEND="$SCRIPT_DIR/backend"

echo "==> node_modules bereinigen"
[ -d "$FRONTEND/node_modules" ] && rm -rf "$FRONTEND/node_modules" && echo "  frontend/node_modules gelöscht"
[ -d "$BACKEND/node_modules"  ] && rm -rf "$BACKEND/node_modules"  && echo "  backend/node_modules gelöscht"

echo "==> pnpm install"
(cd "$BACKEND"  && pnpm install)
(cd "$FRONTEND" && pnpm install)

echo "==> pnpm build (frontend)"
(cd "$FRONTEND" && pnpm build)

echo "==> Build-Verzeichnis bereinigen"
[ -d "$FRONTEND/dist" ] && rm -rf "$FRONTEND/dist" && echo "  frontend/dist gelöscht"

echo "==> Fertig"
