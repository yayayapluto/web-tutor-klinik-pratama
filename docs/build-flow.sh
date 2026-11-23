#!/usr/bin/env bash
# Kompilasi diagram alur lalu jadikan SVG mandiri (latar putih, warna literal).
set -euo pipefail
cd "$(dirname "$0")/.."

node "$HOME/.omp/tools/pele/render.mjs" docs/klinik-flow.mmd -o docs/klinik-flow.svg

node - <<'NODE'
const fs = require("node:fs");
const file = "docs/klinik-flow.svg";
let svg = fs.readFileSync(file, "utf8");
const open = svg.indexOf(">", svg.indexOf("<svg")) + 1;
svg = `${svg.slice(0, open)}\n<rect width="100%" height="100%" fill="#ffffff"/>${svg.slice(open)}`;
svg = svg
  .replaceAll("var(--_fg)", "#1f1f1f")
  .replaceAll("var(--_bg)", "#ffffff")
  .replaceAll("var(--_l)", "#475569")
  .replaceAll("var(--_b)", "#94a3b8")
  .replaceAll("var(--_s)", "#f1f5f9")
  .replaceAll("var(--_a)", "#e2e8f0")
  .replaceAll("var(--_m)", "#475569")
  .replaceAll("var(--_r)", "#cbd5e1")
  .replaceAll("var(--_c)", "#475569");
fs.writeFileSync(file, svg);
NODE

echo "docs/klinik-flow.svg siap"
