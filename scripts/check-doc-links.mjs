// Verifies every doc href in JOURNEY resolves on GitHub (HTTP 200).
// Run: bun scripts/check-doc-links.mjs
import { JOURNEY } from "../src/data/journey.js";

const hrefs = new Map();
const walk = (node, where) => {
  if (!node || typeof node !== "object") return;
  if (typeof node.href === "string") hrefs.set(node.href, `${where} ${node.doc}`);
  for (const [key, value] of Object.entries(node)) {
    if (key === "href") continue;
    if (Array.isArray(value)) {
      for (const child of value) walk(child, where);
    } else walk(value, where);
  }
};

for (const [id, member] of Object.entries(JOURNEY.members ?? {})) walk(member, id);
walk(JOURNEY.foundation, "foundation");

let failed = 0;
for (const [href, where] of hrefs) {
  const res = await fetch(href, { method: "HEAD", redirect: "follow" });
  const ok = res.status === 200;
  if (!ok) failed += 1;
  console.log(`${ok ? "OK  " : "FAIL"} ${res.status} ${where} -> ${href}`);
}
console.log(`\n${hrefs.size} tautan, ${failed} gagal`);
process.exit(failed ? 1 : 0);
