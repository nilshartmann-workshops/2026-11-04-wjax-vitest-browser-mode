#!/usr/bin/env bash
set -euo pipefail

# Stoppt und entfernt die Sandbox-Container (egress-proxy, ggf. docker-proxy)
# sowie die Netze. Named Volumes (claude-config, maven-repo, Node-Cache)
# bleiben standardmäßig erhalten. Die projekteigenen Zusatz-Dienste
# (compose-extra.yaml: Backend/DB) laufen standardmäßig weiter — mit --extra
# werden sie ebenfalls gestoppt.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MANAGED_DIR="$SCRIPT_DIR/.claude-sandbox"
CONFIG="$MANAGED_DIR/sandbox.config"
BASE_COMPOSE="$MANAGED_DIR/compose-sandbox.yaml"
TC_COMPOSE="$MANAGED_DIR/compose-testcontainers.yaml"
EXTRA_COMPOSE="$MANAGED_DIR/compose-extra.yaml"

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  echo "Verwendung: $0 [--volumes] [--extra] [weitere docker-compose-down-argumente...]" >&2
  echo "  --volumes löscht auch claude-config (Login), maven-repo sowie alle" >&2
  echo "  node_modules-Volumes des Projekts (NODE_MODULES_VOLUME). Der Node-Cache" >&2
  echo "  wird nur im Modus SHARED_NODE_CACHE=0 (pro Projekt) entfernt; der" >&2
  echo "  geteilte Cache bleibt erhalten (andere Projekte nutzen ihn)." >&2
  echo "  --extra   stoppt zusätzlich die projekteigenen Zusatz-Dienste aus" >&2
  echo "            compose-extra.yaml (Backend/DB), die sonst weiterlaufen. Mit" >&2
  echo "            --volumes zusammen werden auch deren Volumes (DB!) gelöscht." >&2
  echo "  (Bei --volumes wird bestätigt.)" >&2
  exit 0
fi

if [[ ! -f "$CONFIG" ]]; then
  echo "Fehler: $CONFIG fehlt." >&2
  exit 1
fi
# shellcheck disable=SC1090
source "$CONFIG"

# Eigene Flags abräumen (Reihenfolge-tolerant); der Rest geht an `down` durch.
REMOVE_VOLUMES=false
STOP_EXTRA=false
while [[ $# -gt 0 ]]; do
  case "${1:-}" in
    --volumes|-v) REMOVE_VOLUMES=true; shift ;;
    --extra)      STOP_EXTRA=true; shift ;;
    *) break ;;
  esac
done

DOWN_ARGS=()
if [[ "$REMOVE_VOLUMES" == true ]]; then
  echo "" >&2
  echo "  ⚠️  --volumes: claude-config (Login), maven-repo und alle node_modules-" >&2
  echo "      Volumes des Projekts werden gelöscht. Node-Cache nur bei" >&2
  echo "      SHARED_NODE_CACHE=0 (geteilter Cache bleibt erhalten)." >&2
  [[ "$STOP_EXTRA" == true ]] && \
    echo "      Außerdem --extra: auch die Volumes der Zusatz-Dienste (z.B. DB)!" >&2
  read -r -p "  Fortfahren? [j/N] " CONFIRM >&2 </dev/tty
  echo "" >&2
  if [[ "$CONFIRM" != [jJ] ]]; then
    echo "  Abgebrochen." >&2
    exit 1
  fi
  DOWN_ARGS+=(--volumes)
fi

COMPOSE_ARGS=(-f "$BASE_COMPOSE")
if [[ "${WITH_TESTCONTAINERS:-0}" == "1" ]]; then
  COMPOSE_ARGS+=(-f "$TC_COMPOSE")
fi
# --extra: Zusatz-Dienste (compose-extra.yaml) mit runterfahren. Ohne diese
# Datei in der -f-Kette kennt `down` die Backend-/DB-Container nicht und lässt
# sie (und damit das internal-net) stehen.
if [[ "$STOP_EXTRA" == true ]]; then
  if [[ -f "$EXTRA_COMPOSE" ]]; then
    COMPOSE_ARGS+=(-f "$EXTRA_COMPOSE")
  else
    echo "  --extra: keine compose-extra.yaml gefunden — übersprungen." >&2
  fi
fi

export COMPOSE_PROJECT_NAME="${PROJECT_NAME}-sandbox"
# Platzhalter, damit Compose die Datei ohne Warnung parst.
export SANDBOX_MOUNT_ROOT="${SANDBOX_MOUNT_ROOT:-$SCRIPT_DIR}"
export SANDBOX_WORKDIR="${SANDBOX_WORKDIR:-$SCRIPT_DIR}"

docker compose "${COMPOSE_ARGS[@]}" down "${DOWN_ARGS[@]+"${DOWN_ARGS[@]}"}" "$@"

# Die node_modules-Volumes (NODE_MODULES_VOLUME) sind pro WORKDIR benannt und
# nicht Teil der compose-Sicht hier — `down --volumes` erwischt sie nicht. Bei
# --volumes deshalb gezielt nachräumen (alle Worktree-Varianten des Projekts).
if [[ "$REMOVE_VOLUMES" == true ]]; then
  nm_vols="$(docker volume ls -q --filter "name=${PROJECT_NAME}-node-modules-" || true)"
  if [[ -n "$nm_vols" ]]; then
    echo "  node_modules-Volumes entfernen:" >&2
    printf '    %s\n' $nm_vols >&2
    # shellcheck disable=SC2086
    docker volume rm $nm_vols >/dev/null || true
  fi

  # Node-Cache liegt ebenfalls außerhalb der compose-Sicht (per -v gemountet) und
  # ist projektübergreifend geteilt — er bleibt bei --volumes immer stehen, damit
  # andere Projekte ihn weiter nutzen. Nur der isolierte pro-Projekt-Cache
  # (NODE_CACHE_PATH leer + SHARED_NODE_CACHE=0) wird mit entfernt.
  if [[ -n "${NODE_CACHE_PATH:-}" ]]; then
    echo "  Hinweis: geteilter Node-Cache (Host-Bind) bleibt erhalten: $NODE_CACHE_PATH" >&2
    echo "           Manuell löschen: rm -rf \"$NODE_CACHE_PATH\"" >&2
  elif [[ "${SHARED_NODE_CACHE:-1}" != "0" ]]; then
    echo "  Hinweis: geteilter Node-Cache (claude-sandbox-node-cache) bleibt erhalten." >&2
    echo "           Manuell löschen: docker volume rm claude-sandbox-node-cache" >&2
  else
    docker volume rm "${PROJECT_NAME}-sandbox-node-cache" >/dev/null 2>&1 \
      && echo "  Node-Cache entfernt: ${PROJECT_NAME}-sandbox-node-cache" >&2 || true
  fi
fi
