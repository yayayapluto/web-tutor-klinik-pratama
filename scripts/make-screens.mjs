/* Membuat contoh layar target (SVG) untuk tutor.
   Jalankan sekali: node scripts/make-screens.mjs
   Hasil: public/assets/screens/<id>.svg */

import { mkdirSync, writeFileSync } from "node:fs";

const W = 960;
const H = 600;

const c = {
  bg: "#0f172a",
  bar: "#1e293b",
  fg: "#e2e8f0",
  dim: "#94a3b8",
  green: "#4ade80",
  red: "#f87171",
  yellow: "#fbbf24",
  cyan: "#67e8f9",
};

const SCREENS = {
  "01-reset-db": {
    title: "reset-db.sh",
    lines: [
      ["$ bash tools/reset-db.sh", "dim"],
      ["Dropping database klinik_pratama ... ok", "dim"],
      ["CREATE DATABASE klinik_pratama ... ok", ""],
      ["sql/00-kesepakatan.sql ... ok", "green"],
      ["sql/01-schema.sql ... ok", "green"],
      ["sql/02-data.sql ... ok", "green"],
      ["sql/03-view-trigger.sql ... ok", "green"],
      ["sql/04-prosedur.sql ... ok", "green"],
      ["sql/05-keamanan.sql ... ok", "green"],
      ["sql/06-indeks.sql ... ok", "green"],
      ["", ""],
      ["Tabel terdaftar: 11/11", "yellow"],
      ["Waktu: 2.14 detik", "dim"],
    ],
  },
  "02-struktur": {
    title: "SHOW TABLES",
    lines: [
      ["mysql> SHOW TABLES;", "cyan"],
      ["+----------------------+", ""],
      ["| Tables_in_klinik     |", ""],
      ["+----------------------+", ""],
      ["| dokter               |", "green"],
      ["| jadwal               |", "green"],
      ["| jenis_pembayaran     |", "green"],
      ["| kunjungan            |", "green"],
      ["| obat                 |", "green"],
      ["| pasien               |", "green"],
      ["| pembayaran           |", "green"],
      ["| poli                 |", "green"],
      ["+----------------------+", ""],
      ["11 rows in set (0.00 sec)", "yellow"],
    ],
  },
  "03-verify": {
    title: "verify.sh",
    lines: [
      ["$ bash tools/verify.sh", "dim"],
      ["[ 1] tabel 11              ok", "green"],
      ["[ 2] primary key 11        ok", "green"],
      ["[ 3] foreign key 10        ok", "green"],
      ["...", "dim"],
      ["[17] view 3                ok", "green"],
      ["[18] trigger 5             ok", "green"],
      ["[19] pseudo-rekursif 8     ok", "green"],
      ["...", "dim"],
      ["[30] katalog kueri 10      ok", "green"],
      ["[34] backup.sql            ok", "green"],
      ["", ""],
      ["LULUS: 34 pemeriksaan", "yellow"],
    ],
  },
  "04-view-trigger": {
    title: "view + trigger",
    lines: [
      ["mysql> SELECT * FROM v_kunjungan_harian LIMIT 3;", "cyan"],
      ["+------------+-------+------------+-------------+", ""],
      ["| tanggal    | poli  | dokter     | total       |", ""],
      ["+------------+-------+------------+-------------+", ""],
      ["| 2026-11-02 | Umum  | dr. Andini | 4           |", "green"],
      ["| 2026-11-03 | Gigi  | dr. Bagas  | 3           |", "green"],
      ["+------------+-------+------------+-------------+", ""],
      ["", ""],
      ["mysql> INSERT ... jadwal penuh;", "cyan"],
      ["ERROR 1644 (45000): Jadwal dokter sudah penuh", "red"],
    ],
  },
  "05-prosedur": {
    title: "CALL prosedur",
    lines: [
      ["mysql> SET @no_kunjungan = 0;", "cyan"],
      ["mysql> CALL sp_daftar_kunjungan(1, 2, 3, @no_kunjungan);", "cyan"],
      ["Query OK, 0 rows affected (0.01 sec)", "green"],
      ["", ""],
      ["mysql> SELECT @no_kunjungan;", "cyan"],
      ["+----------------+", ""],
      ["| @no_kunjungan  |", ""],
      ["+----------------+", ""],
      ["|             42 |", "yellow"],
      ["+----------------+", ""],
      ["", ""],
      ["mysql> CALL sp_bayar_kunjungan(42, 2);", "cyan"],
      ["Query OK, 1 row affected (0.00 sec)", "green"],
    ],
  },
  "06-keamanan": {
    title: "SHOW GRANTS",
    lines: [
      ["mysql> SHOW GRANTS FOR 'kasir_klinik'@'localhost';", "cyan"],
      ["+------------------------------------------------------+", ""],
      ["| GRANT SELECT, INSERT ON klinik_pratama.pasien TO ...  |", "green"],
      ["| GRANT SELECT, INSERT ON klinik_pratama.kunjungan ...  |", "green"],
      ["| GRANT SELECT, INSERT ON klinik_pratama.pembayaran ... |", "green"],
      ["+------------------------------------------------------+", ""],
      ["", ""],
      ["mysql> DELETE FROM pasien WHERE id = 1;", "cyan"],
      ["ERROR 1142 (42000): DELETE command denied to user", "red"],
    ],
  },
  "07-indeks": {
    title: "EXPLAIN",
    lines: [
      ["-- sebelum indeks", "dim"],
      ["mysql> EXPLAIN SELECT * FROM pasien WHERE nama LIKE 'A%';", "cyan"],
      ["type: ALL   rows: 4120   key: NULL", "red"],
      ["", ""],
      ["-- sesudah indeks", "dim"],
      ["mysql> EXPLAIN SELECT * FROM pasien WHERE nama LIKE 'A%';", "cyan"],
      ["type: range rows: 87     key: idx_pasien_nama", "green"],
      ["", ""],
      ["Extra: Using index condition", "yellow"],
      ["", ""],
      ["mysql> SHOW INDEX FROM kunjungan;", "cyan"],
      ["idx_kunjungan_tanggal  tanggal", "green"],
    ],
  },
  "08-uji": {
    title: "sepuluh skenario",
    lines: [
      ["Panduan kueri, 10 skenario", "yellow"],
      ["1  daftar pasien baru bulan ini        ok", "green"],
      ["2  kunjungan per poli                 ok", "green"],
      ["3  kunjungan tanggal tertentu         ok", "green"],
      ["4  pasien tanpa kunjungan ulang       ok", "green"],
      ["5  obat stok di bawah lima            ok", "green"],
      ["6  pendapatan per jenis pembayaran    ok", "green"],
      ["7  dokter paling sibuk                ok", "green"],
      ["8  jadwal besok                       ok", "green"],
      ["9  pembayaran belum lunas             ok", "green"],
      ["10 pasien dengan kunjungan terbanyak  ok", "green"],
    ],
  },
  "09-laporan": {
    title: "laporan.pdf",
    lines: [
      ["laporan/UAS-Klinik-Pratama.pdf", "yellow"],
      ["", ""],
      ["Bab I   Studi kasus dan ruang lingkup", "green"],
      ["Bab II  Perancangan basis data", "green"],
      ["Bab III Implementasi (DDL, DML, objek)", "green"],
      ["Bab IV  Pengujian 34 pemeriksaan", "green"],
      ["Bab V   Kesimpulan dan saran", "green"],
      ["", ""],
      ["Lampiran A  bukti/ (9 berkas)", "dim"],
      ["Lampiran B  kueri-panduan.sql (10)", "dim"],
      ["", ""],
      ["Halaman: 42   Status: siap kumpul", "yellow"],
    ],
  },
};

const esc = (s) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");

mkdirSync("public/assets/screens", { recursive: true });

for (const [id, screen] of Object.entries(SCREENS)) {
  const rows = screen.lines
    .map(([text, tone], index) => {
      const y = 116 + index * 32;
      const fill = c[tone] || c.fg;
      return `  <text x="44" y="${y}" fill="${fill}" font-family="ui-monospace, 'Cascadia Mono', Consolas, monospace" font-size="18">${esc(text)}</text>`;
    })
    .join("\n");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Contoh layar: ${esc(screen.title)}">
  <rect width="${W}" height="${H}" rx="14" fill="${c.bg}"/>
  <rect width="${W}" height="56" rx="14" fill="${c.bar}"/>
  <rect y="42" width="${W}" height="14" fill="${c.bar}"/>
  <circle cx="30" cy="28" r="7" fill="#f87171"/>
  <circle cx="56" cy="28" r="7" fill="#fbbf24"/>
  <circle cx="82" cy="28" r="7" fill="#4ade80"/>
  <text x="116" y="34" fill="${c.dim}" font-family="ui-monospace, Consolas, monospace" font-size="16">${esc(screen.title)}</text>
${rows}
</svg>
`;

  writeFileSync(`public/assets/screens/${id}.svg`, svg);
  console.log("wrote", id);
}
