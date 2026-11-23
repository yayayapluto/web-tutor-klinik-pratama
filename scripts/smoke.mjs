/* Smoke test produksi: bangun bila perlu, jalankan preview, periksa
   halaman dan aset layar. Jalankan: bun scripts/smoke.mjs [--dist]
   --dist melewati build dan memakai dist/ yang sudah ada. */

import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const skipBuild = process.argv.includes("--dist");
const PORT = 5186;

async function run(cmd, args) {
  const child = spawn(cmd, args, { stdio: "inherit", shell: process.platform === "win32" });
  const code = await new Promise((resolve) => child.on("exit", resolve));
  if (code !== 0) {
    console.error(`${cmd} ${args.join(" ")} gagal (exit ${code})`);
    process.exit(code ?? 1);
  }
}

if (!skipBuild) await run("bunx", ["vite", "build"]);

const viteBin = fileURLToPath(new URL("../node_modules/vite/bin/vite.js", import.meta.url));

const server = spawn(
  process.execPath,
  [viteBin, "preview", "--host", "127.0.0.1", "--port", String(PORT), "--strictPort"],
  {
    stdio: "ignore",
  },
);

function stopServer() {
  if (process.platform === "win32")
    spawnSync("taskkill", ["/PID", String(server.pid), "/T", "/F"], { stdio: "ignore" });
  else server.kill("SIGTERM");
}

const base = `http://127.0.0.1:${PORT}`;

async function waitReady() {
  for (let i = 0; i < 50; i += 1) {
    try {
      const res = await fetch(base);
      if (res.ok) return;
    } catch {
      /* server belum siap */
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  throw new Error("preview tidak siap dalam 10 detik");
}

const fail = (message) => {
  console.error(`SMOKE GAGAL: ${message}`);
  stopServer();
  process.exit(1);
};

try {
  await waitReady();

  const page = await fetch(base);
  const html = await page.text();
  if (!page.ok) fail(`halaman utama ${page.status}`);
  if (!html.includes("Tutor Klinik Pratama")) fail("judul halaman tidak ada di HTML");

  const script = html.match(/src="(\/assets\/index-[^"]+\.js)"/);
  if (!script) fail("bundel JS tidak tertaut di HTML");

  const bundle = await fetch(base + script[1]);
  if (!bundle.ok) fail(`bundel JS ${bundle.status}`);

  const svg = await fetch(`${base}/assets/screens/01-reset-db.svg`);
  if (!svg.ok) fail(`aset layar 01 ${svg.status}`);

  console.log("SMOKE LULUS: halaman, bundel, dan aset layar tersaji.");
  process.exit(0);
} catch (error) {
  fail(error instanceof Error ? error.message : String(error));
} finally {
  stopServer();
}
