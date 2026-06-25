#!/usr/bin/env bash
set -euo pipefail

# Startet Claude Code (--dangerously-skip-permissions) in der Sandbox.
# Konfiguration: .claude-sandbox/sandbox.config (von install.sh erzeugt).

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MANAGED_DIR="$SCRIPT_DIR/.claude-sandbox"
CONFIG="$MANAGED_DIR/sandbox.config"
BASE_COMPOSE="$MANAGED_DIR/compose-sandbox.yaml"
TC_COMPOSE="$MANAGED_DIR/compose-testcontainers.yaml"
EXTRA_COMPOSE="$MANAGED_DIR/compose-extra.yaml"

if [[ ! -f "$CONFIG" ]]; then
  echo "Fehler: $CONFIG fehlt. Erst install.sh ausführen:" >&2
  echo "  ~/develop/claude-sandbox/install.sh" >&2
  exit 1
fi
# shellcheck disable=SC1090
source "$CONFIG"

MAIN_REPO="$(git -C "$SCRIPT_DIR" rev-parse --show-toplevel)"

usage() {
  cat >&2 <<EOF
Verwendung: $0 [--worktree <branch>] [--skip-danger-warning] [claude-argumente...]

  --worktree <branch>     Nur bei WORKTREE_LAYOUT=path-identity: in einem
                          Worktree unter $(basename "$MAIN_REPO")-worktrees/<branch>
                          starten statt im Hauptrepo.
  --skip-danger-warning   Warnung anzeigen, aber nicht bestätigen lassen.

  Beispiele:
    $0 --model claude-sonnet-4-6 --effort medium
    $0 --worktree spike-foo
EOF
}

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  usage
  exit 0
fi

# Mount-Root / Arbeitsverzeichnis nach Layout bestimmen.
case "${WORKTREE_LAYOUT:-simple}" in
  path-identity)
    MOUNT_ROOT="$(dirname "$MAIN_REPO")"
    WORKTREE_PARENT="$MOUNT_ROOT/$(basename "$MAIN_REPO")-worktrees"
    ;;
  *)
    MOUNT_ROOT="$MAIN_REPO"
    WORKTREE_PARENT=""
    ;;
esac
WORKDIR="$MAIN_REPO"
SKIP_WARNING=false

# Eigene Flags vor den claude-Argumenten abräumen (Reihenfolge-tolerant).
while [[ $# -gt 0 ]]; do
  case "${1:-}" in
    --worktree)
      [[ -n "$WORKTREE_PARENT" ]] || { echo "  --worktree braucht WORKTREE_LAYOUT=path-identity in sandbox.config." >&2; exit 1; }
      [[ -n "${2:-}" ]] || { echo "  --worktree braucht einen Branch-Namen." >&2; exit 1; }
      WORKDIR="$WORKTREE_PARENT/$2"
      shift 2
      ;;
    --skip-danger-warning)
      SKIP_WARNING=true
      shift
      ;;
    *)
      break
      ;;
  esac
done

if [[ ! -d "$WORKDIR" ]]; then
  echo "  Arbeitsverzeichnis existiert nicht: $WORKDIR" >&2
  [[ -n "$WORKTREE_PARENT" ]] && { echo "  Verfügbare Worktrees:" >&2; git -C "$SCRIPT_DIR" worktree list | sed 's/^/    /' >&2; }
  exit 1
fi

# Egress-Allowlist-Extras aus EXTRA_ALLOWLIST generieren (vom egress-proxy
# per include eingebunden). Immer schreiben, ggf. leer.
EXTRA_FILE="$MANAGED_DIR/squid-extra.conf"
{
  echo "# Generiert von run-claude-session.sh aus EXTRA_ALLOWLIST (sandbox.config)."
  for d in ${EXTRA_ALLOWLIST:-}; do
    echo "acl allowed_domains dstdomain $d"
  done
} > "$EXTRA_FILE"

# Temporäre Ad-hoc-Allowlist (sandbox-allow --temp): nur anlegen, falls fehlend
# — NIE überschreiben. Sonst verlöre ein Start die von einer noch laufenden
# Schwester-Session gesetzten temp-Domains (geteilter Egress-Proxy).
TEMP_FILE="$MANAGED_DIR/squid-temp.conf"
[[ -f "$TEMP_FILE" ]] || printf '# Temporäre Ad-hoc-Domains (sandbox-allow --temp). Aufräumen: sandbox-allow --temp-clear.\n' > "$TEMP_FILE"

# Compose-Datei-Kette zusammenbauen.
COMPOSE_ARGS=(-f "$BASE_COMPOSE")
if [[ "${WITH_TESTCONTAINERS:-0}" == "1" ]]; then
  COMPOSE_ARGS+=(-f "$TC_COMPOSE")
fi
# Zusätzliche `docker compose run`-Flags (Volumes/Env), dynamisch aufgebaut.
RUN_ARGS=()
NM_SUMMARY=()

# node_modules-Volume-Overlay: native Binaries (esbuild, swc, …) passend zur
# Linux-Plattform, ohne die Host-node_modules anzufassen. Statt eines statischen
# Overlays für genau ein node_modules am Repo-Root bekommt jedes Projekt-
# verzeichnis mit eigener package.json sein eigenes named Volume an der Stelle
# seines node_modules (so funktionieren auch Unterprojekte wie prototyp/ oder
# backend/+frontend/). Die Verzeichnisliste:
#   - NODE_MODULES_DIRS aus sandbox.config (Leerzeichen-getrennt, relativ zum
#     Repo-Root, '.' = Root) — falls gesetzt, oder
#   - sonst beim Start automatisch ermittelt: jede package.json bis zwei
#     Unterebenen tief (Root, Sub, Sub-Sub), node_modules/.git ausgenommen.
if [[ "${NODE_MODULES_VOLUME:-0}" == "1" ]]; then
  if [[ -n "${NODE_MODULES_DIRS:-}" ]]; then
    NM_DIRS="$NODE_MODULES_DIRS"
  else
    NM_DIRS="$(
      find "$WORKDIR" -maxdepth 3 \( -name node_modules -o -name .git \) -prune -o \
           -type f -name package.json -print 2>/dev/null \
      | while IFS= read -r pj; do
          d="$(dirname "$pj")"; rel="${d#"$WORKDIR"}"; rel="${rel#/}"
          printf '%s\n' "${rel:-.}"
        done | sort -u | paste -sd' ' -
    )"
  fi

  for rel in $NM_DIRS; do
    if [[ "$rel" == "." ]]; then target="$WORKDIR/node_modules"; else target="$WORKDIR/$rel/node_modules"; fi
    # Volume-Name: Prefix wie gehabt (stop-claude-session.sh räumt darüber auf),
    # Hash über den konkreten Zielpfad → je WORKDIR+Verzeichnis eigenes Volume.
    vol="${PROJECT_NAME}-node-modules-$(printf '%s' "$target" | shasum | cut -c1-12)"
    RUN_ARGS+=(-v "${vol}:${target}")
    NM_SUMMARY+=("${rel}  ->  ${target}")
  done

  # node-modules-init.sh (installiert vor Claude) und die aufgelöste Liste in
  # den Container reichen. `docker compose run` gibt nur explizit übergebene Env
  # weiter, daher per -e (nicht export).
  RUN_ARGS+=(-v "$MANAGED_DIR/node-modules-init.sh:/usr/local/bin/node-modules-init.sh:ro")
  RUN_ARGS+=(-e "SANDBOX_NM_DIRS=${NM_DIRS}")
fi

# Host-Maven-Repository read-only als file://-Remote bereitstellen: beschleunigt
# den ersten Build (kein Re-Download bereits vorhandener Artefakte), ohne dem
# Container Schreibzugriff auf das Host-Repo zu geben. Aktiviert das Profil
# `host-cache` in maven-settings.xml über die Env-Var SANDBOX_HOST_M2.
HOST_M2_ACTIVE=""
if [[ -n "${HOST_MAVEN_REPO:-}" ]]; then
  if [[ -d "$HOST_MAVEN_REPO" ]]; then
    RUN_ARGS+=(-v "${HOST_MAVEN_REPO}:/host-m2-repo:ro" -e "SANDBOX_HOST_M2=1")
    HOST_M2_ACTIVE="$HOST_MAVEN_REPO"
  else
    echo "  [sandbox] ⚠️  HOST_MAVEN_REPO=$HOST_MAVEN_REPO existiert nicht — übersprungen." >&2
  fi
fi

# Node-Cache (/root/.cache: npm-Cache + pnpm-Store). Drei Stufen:
#   1. NODE_CACHE_PATH gesetzt (Default) → Host-Bind auf diesen Pfad, projekt-
#      übergreifend geteilt und auf dem Host sichtbar/monitorbar (du -sh …).
#   2. leer + SHARED_NODE_CACHE=1 → ein global geteiltes Docker-Volume (in der VM).
#   3. leer + SHARED_NODE_CACHE=0 → Docker-Volume pro Projekt (max. Isolation).
# Der pnpm-Store liegt so projektübergreifend nur einmal vor (Plattenplatz); der
# Inhalt ist content-addressed + integrity-geprüft. Per -v statt in compose,
# damit `stop --volumes` eines Projekts den geteilten Cache nicht mitlöscht.
if [[ -n "${NODE_CACHE_PATH:-}" ]]; then
  mkdir -p "$NODE_CACHE_PATH"   # als Host-User anlegen (nicht root-owned vom Bind)
  RUN_ARGS+=(-v "${NODE_CACHE_PATH}:/root/.cache")
  NODE_CACHE_DESC="Host-Bind $NODE_CACHE_PATH (geteilt)"
elif [[ "${SHARED_NODE_CACHE:-1}" != "0" ]]; then
  RUN_ARGS+=(-v "claude-sandbox-node-cache:/root/.cache")
  NODE_CACHE_DESC="Volume claude-sandbox-node-cache (geteilt)"
else
  RUN_ARGS+=(-v "${PROJECT_NAME}-sandbox-node-cache:/root/.cache")
  NODE_CACHE_DESC="Volume ${PROJECT_NAME}-sandbox-node-cache (pro Projekt)"
fi

# Projekteigene Zusatz-Dienste (z.B. Test-Backend + DB): rein dateibasiert,
# kein Schalter in sandbox.config. Liegt projektlokal, vom Sync ausgenommen.
EXTRA_SERVICES=0
if [[ -f "$EXTRA_COMPOSE" ]]; then
  COMPOSE_ARGS+=(-f "$EXTRA_COMPOSE")
  EXTRA_SERVICES=1
fi

echo "" >&2
echo "  ‼️  ‼️  ‼️  ACHTUNG  ‼️  ‼️  ‼️" >&2
echo "" >&2
echo "  ☣️  Claude Code startet MIT --dangerously-skip-permissions" >&2
echo "  ⚠️  Kein Permission-Check — Claude darf ohne Rückfrage Dateien" >&2
echo "      lesen, schreiben und Befehle ausführen." >&2
echo "" >&2
echo "  Sicherheits-Boundary: Docker-Container-Isolation." >&2
echo "  Mount:        $MOUNT_ROOT" >&2
echo "  Arbeitsverz.: $WORKDIR" >&2
echo "  Testcontainers: ${WITH_TESTCONTAINERS:-0} (Docker-Socket nur bei 1 exponiert)." >&2
echo "  Zusatz-Dienste: $EXTRA_SERVICES (compose-extra.yaml; am internal-net, kein Egress)." >&2
echo "  Netzwerk-Egress: über Egress-Proxy auf Allowlist gefiltert." >&2
if [[ "${NODE_MODULES_VOLUME:-0}" == "1" ]]; then
  if [[ ${#NM_SUMMARY[@]} -gt 0 ]]; then
    echo "  node_modules-Volumes (Verzeichnis  ->  Pfad im Container):" >&2
    printf '    %s\n' "${NM_SUMMARY[@]}" >&2
  else
    echo "  node_modules-Volumes: keine package.json gefunden (Root + 2 Ebenen tief)." >&2
  fi
  echo "  Node-Cache: $NODE_CACHE_DESC." >&2
fi
[[ -n "$HOST_M2_ACTIVE" ]] && echo "  Host-Maven-Repo (ro): $HOST_M2_ACTIVE  ->  /host-m2-repo" >&2
echo "" >&2

if [[ "$SKIP_WARNING" == false ]]; then
  read -r -p "  Fortfahren? [j/N] " CONFIRM >&2 </dev/tty
  echo "" >&2
  if [[ "$CONFIRM" != [jJ] ]]; then
    echo "  Abgebrochen." >&2
    exit 1
  fi
fi

# Host-Node-Version live erfassen (für den Drift-Check im Container-Entrypoint).
# Best effort: ohne node auf dem Host bleibt die Var leer und der Check entfällt.
HOST_NODE_VERSION="$(node -v 2>/dev/null | sed -E 's/^v//' || true)"

export COMPOSE_PROJECT_NAME="${PROJECT_NAME}-sandbox"
export WITH_JAVA JAVA_VERSION WITH_NODE NODE_VERSION CLAUDE_CODE_VERSION LOCALE TZ
export HOST_NODE_VERSION
export SANDBOX_MOUNT_ROOT="$MOUNT_ROOT"
export SANDBOX_WORKDIR="$WORKDIR"

# Default-Kommando explizit setzen (entspricht `command:` der jeweiligen
# Compose-Datei). `docker compose run SERVICE CMD…` hängt ein übergebenes CMD
# NICHT an `command:` an, sondern ersetzt es komplett — gäbe man nur "$@"
# weiter, fiele `claude --dangerously-skip-permissions` (bzw. node-modules-
# init.sh) weg und der Entrypoint bekäme die Claude-Argumente als Kommando.
# node-modules-init.sh reicht "$@" selbst an claude weiter.
if [[ "${NODE_MODULES_VOLUME:-0}" == "1" ]]; then
  RUN_CMD=(bash /usr/local/bin/node-modules-init.sh)
else
  RUN_CMD=(claude --dangerously-skip-permissions)
fi

exec docker compose "${COMPOSE_ARGS[@]}" run --rm \
  "${RUN_ARGS[@]+"${RUN_ARGS[@]}"}" claude "${RUN_CMD[@]}" "$@"
