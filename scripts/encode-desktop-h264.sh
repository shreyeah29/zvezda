#!/bin/zsh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)/public/assets/videos/products"

encode_one() {
  local src="$1"
  local rel="${src#"$ROOT"/}"
  local dest="$ROOT/desktop/$rel"
  mkdir -p "$(dirname "$dest")"
  if [[ -f "$dest" ]]; then
    local dest_size
    dest_size=$(stat -f%z "$dest" 2>/dev/null || stat -c%s "$dest")
    if (( dest_size > 2000000 )); then
      echo "skip $rel ($(numfmt --to=iec "$dest_size" 2>/dev/null || echo "$dest_size"))"
      return
    fi
  fi
  echo "encode $rel"
  ffmpeg -y -hide_banner -loglevel error -i "$src" \
    -an -c:v libx264 -pix_fmt yuv420p -profile:v high -level 4.2 \
    -preset fast -crf 18 -movflags +faststart \
    "$dest"
  ls -lh "$dest" | awk '{print "  ->", $5, $9}'
}

# Hero first, then remaining product masters.
priority=(
  "$ROOT/set-12/RedDressSolo.mp4"
  "$ROOT/set-15/PinkSolo1.mp4"
  "$ROOT/set-8/White&Black1.mp4"
)

for src in "${priority[@]}"; do
  encode_one "$src"
done

for src in "$ROOT"/set-*/*.mp4; do
  encode_one "$src"
done
