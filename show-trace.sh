#!/usr/bin/env bash
#
# Listet die Playwright-Traces der Browser-Tests (neueste zuerst) auf und
# öffnet den ausgewählten im Trace Viewer (pnpm dlx playwright show-trace).
#
# Traces entstehen nur mit trace: "on" in vite.config.ts (lokal sonst
# "off"); sie landen in __traces__ neben der jeweiligen Testdatei.
set -euo pipefail

# Ins frontend-Verzeichnis wechseln (scripts/ liegt darin), egal von wo
# das Script aufgerufen wird.
cd "$(dirname "$0")/frontend"

# mtime portabel: stat -f (macOS/BSD) mit Fallback stat -c (GNU/Linux).
mtime_epoch() { stat -f '%m' "$1" 2>/dev/null || stat -c '%Y' "$1"; }
mtime_human() {
  stat -f '%Sm' -t '%Y-%m-%d %H:%M' "$1" 2>/dev/null \
    || stat -c '%Y' "$1" | xargs -I{} date -d @{} '+%Y-%m-%d %H:%M'
}

# Trace-Zips einsammeln, neueste zuerst (nach mtime sortiert).
traces=()
while IFS= read -r f; do
  [ -n "$f" ] && traces+=("$f")
done < <(
  find src -type f -name '*.trace.zip' 2>/dev/null | while IFS= read -r f; do
    printf '%s\t%s\n' "$(mtime_epoch "$f")" "$f"
  done | sort -rn | cut -f2-
)

if [ "${#traces[@]}" -eq 0 ]; then
  echo 'Kein Trace gefunden.'
  echo 'Erst trace: "on" in vite.config.ts setzen, einen Browser-Test laufen'
  echo 'lassen, dann erneut: pnpm test:trace'
  exit 1
fi

echo 'Verfügbare Traces (neueste zuerst):'
echo
i=1
for f in "${traces[@]}"; do
  printf '  %2d)  %s  %s\n' "$i" "$(mtime_human "$f")" "$f"
  i=$((i + 1))
done
echo

read -rp "Welchen Trace öffnen? [1] " choice || true
choice="${choice:-1}"

if ! [[ "$choice" =~ ^[0-9]+$ ]] \
  || [ "$choice" -lt 1 ] \
  || [ "$choice" -gt "${#traces[@]}" ]; then
  echo "Ungültige Auswahl: $choice" >&2
  exit 1
fi

selected="${traces[$((choice - 1))]}"
echo "Öffne: $selected"
exec pnpm dlx playwright show-trace "$selected"
