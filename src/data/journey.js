/* Data journey Web Tutor Klinik Pratama.
   Sumber: docs panduan anggota dan berkas sql/ di repo kerja UAS.
   Nama peserta adalah anggota tim yang terdaftar di pembagian tugas. */

const REPO = "https://github.com/yayayapluto/UAS-SQL-Klinik-Projek";
const PANDUAN_REPO = "https://github.com/yayayapluto/UAS-SQL-Klinik-Panduan";
const OUTPUT_REPO = "https://github.com/yayayapluto/UAS-SQL-Klinik-Output";

const docIn = (base, file, anchor) => ({
  doc: file,
  href: `${base}/blob/main/${file}${anchor ? `#${anchor}` : ""}`,
});

const doc = (file, anchor) => docIn(REPO, file, anchor);
const panduanDoc = (file, anchor) => docIn(PANDUAN_REPO, file, anchor);
const outputDoc = (file, anchor) => docIn(OUTPUT_REPO, file, anchor);

const foundation = {
  id: "F0",
  title: "Fondasi repo",
  tag: "skema-v1",
  doc: "README.md",
  href: `${REPO}/blob/main/README.md`,
  steps: [
    {
      id: "f0-1",
      title: "Periksa alat yang tersedia",
      materi: ["Pertemuan 1: lingkungan basis data"],
      baca: ["README bagian Prasyarat"],
      kerja: [
        "Jalankan git, mysql, dan bash di terminal yang sama.",
        "Windows: pakai Git Bash, bukan PowerShell, agar tools/*.sh bisa dipanggil.",
      ],
      command: { label: "Cek versi alat", code: "git --version\nmysql --version\nbash --version" },
      expected: {
        text: "git version 2.4x.x\nmysql  Ver 8.0.x untuk Win64/winget\nGNU bash, version 5.x",
        screens: [],
      },
      bukti: "Ketiga perintah keluar nomor versi, tanpa 'command not found'.",
    },
    {
      id: "f0-2",
      title: "Clone repo kerja",
      baca: ["README bagian Clone"],
      kerja: [
        "Clone repo kerja, bukan repo panduan.",
        "Periksa sql/: delapan berkas scaffold yang masih berisi komentar.",
      ],
      command: {
        label: "Clone dan periksa struktur",
        code: "git clone https://github.com/yayayapluto/UAS-SQL-Klinik-Projek.git\ncd UAS-SQL-Klinik-Projek\nls sql tools",
      },
      expected: {
        text: "Cloning into 'UAS-SQL-Klinik-Projek'...\ndone.\n\nsql:\n00-kesepakatan.sql  01_struktur.sql  02_data.sql  03_view_trigger.sql\n04_prosedur.sql     05_keamanan.sql  06_indeks.sql 07_pengujian.sql\n\ntools:\nbuild.sh  db.sh  demo-isolasi.sh  reset-db.sh  run-sql.sh  verify.sh",
        screens: ["01-reset-db"],
      },
      bukti: "`ls sql` menampilkan delapan berkas, `ls tools` menampilkan skrip bantu.",
    },
    {
      id: "f0-3",
      title: "Muat database dari nol",
      baca: ["README bagian Perintah Harian", "tools/reset-db.sh"],
      kerja: [
        "Pastikan MySQL 8.0 hidup (container kbd-mysql atau layanan host).",
        "reset-db.sh membuat database klinik_pratama lalu memuat 00 sampai 06.",
      ],
      command: { label: "Bangun ulang database", code: "bash tools/reset-db.sh" },
      expected: {
        text: "tabel terdaftar: 11",
        screens: ["01-reset-db"],
      },
      bukti: "Keluaran berakhir 'tabel terdaftar: 11' dan tidak ada galat SQL.",
    },
    {
      id: "f0-4",
      title: "Mulai dari branch sendiri",
      baca: ["README bagian Alur Kerja"],
      kerja: [
        "Satu tugas satu branch; main dilindungi, semua perubahan lewat pull request.",
        "Sunting hanya berkas milikmu, lalu buka PR ke main.",
      ],
      command: {
        label: "Buat branch peserta",
        code: "git switch main\ngit pull --rebase origin main\ngit switch -c anggota-1/prosedur",
      },
      expected: {
        text: "Switched to a new branch 'anggota-1/prosedur'",
        screens: [],
      },
      bukti: "`git branch --show-current` mengembalikan nama branch tugasmu.",
    },
  ],
};

const members = [
  {
    code: "A1",
    role: "Kontrak, prosedur, laporan",
    branch: "anggota-1/prosedur",
    level: "Awal",
    filesOwned: ["sql/00-kesepakatan.sql", "sql/04_prosedur.sql", "bukti/", "laporan/"],
    drivers: ["mysql 8.0", "git", "bash"],
    scenarios: ["kesepakatan nama", "dua prosedur", "laporan Bab I dan III"],
    screens: ["02-struktur", "05-prosedur", "09-laporan"],
    larangan: [
      "Jangan menulis tabel di sql/01_struktur.sql, itu milik Farras.",
      "Jangan mengubah berkas sql/05_keamanan.sql tanpa kesepakatan Kafka.",
      "Jangan mengumpulkan bukti dengan angka lama; jalankan ulang perintahnya.",
    ],
    phases: [
      {
        id: "F1",
        title: "Kontrak nama objek",
        tag: "kesepakatan-v1",
        ...doc("sql/00-kesepakatan.sql"),
        steps: [
          {
            id: "a1-1",
            title: "Tulis daftar sebelas tabel",
            baca: ["PRD bagian 5.4", "sql/00-kesepakatan.sql blok daftar tabel"],
            kerja: [
              "Buka sql/00-kesepakatan.sql, isi blok daftar tabel berurutan dari pasien sampai pembayaran.",
              "Sertakan tujuan satu baris per tabel supaya anggota lain paham.",
            ],
            command: { label: "Lihat daftar tabel", code: "grep -n '^-- tabel' sql/00-kesepakatan.sql" },
            expected: {
              text: "-- tabel poli\n-- tabel dokter\n-- tabel pasien\n-- tabel jadwal\n-- tabel kunjungan\n-- tabel pembayaran\n-- tabel obat\n-- tabel resep\n-- tabel resep_obat\n-- tabel stok_obat\n-- tabel users",
              screens: ["02-struktur"],
            },
            bukti: "Sebelas baris tabel muncul berurutan, tanpa nama ganda.",
          },
          {
            id: "a1-2",
            title: "Isi kamus data dan kardinalitas",
            baca: ["sql/00-kesepakatan.sql blok kamus data"],
            kerja: [
              "Tulis kolom setiap tabel beserta tipe dan kunci.",
              "Catat kardinalitas relasi: poli-dokter 1:N, dokter-jadwal 1:N, pasien-kunjungan 1:N.",
            ],
            command: { label: "Hitung baris kamus", code: "grep -c '^|' sql/00-kesepakatan.sql" },
            expected: { text: "44", screens: ["02-struktur"] },
            bukti: "Jumlah baris kamus sama dengan jumlah kolom pada sql/01_struktur.sql.",
          },
          {
            id: "a1-3",
            title: "Catat delapan aturan bisnis",
            baca: ["PRD bagian 6"],
            kerja: [
              "Tulis aturan: kuota harian, bentrok jadwal, stok obat, pembayaran ganda, dan seterusnya.",
              "Setiap aturan menunjuk penjaganya: trigger, prosedur, atau constraint.",
            ],
            command: {
              label: "Daftar aturan",
              code: "sed -n '/aturan bisnis/,/^--$/p' sql/00-kesepakatan.sql",
            },
            expected: {
              text: "-- R1 kuota 20 pasien per dokter per hari -> trg_kuota_harian\n-- R2 jadwal bentrok -> trg_bentrok_jadwal\n-- R3 stok obat tidak negatif -> trg_stok_obat\n-- R4 satu kunjungan satu pembayaran -> uq_pembayaran_kunjungan\n...",
              screens: [],
            },
            bukti: "Delapan aturan bernomor, setiap aturan punya penjaga yang disebut namanya.",
          },
          {
            id: "a1-4",
            title: "Minta setuju dan pasang tag",
            baca: ["PEMBAGIAN-TUGAS bagian fase"],
            kerja: [
              "Kirim ringkasan nama objek ke grup, minta balasan setuju.",
              "Setelah tidak ada usulan baru, pasang tag kesepakatan-v1.",
            ],
            command: {
              label: "Pasang tag",
              code: 'git tag -a kesepakatan-v1 -m "kontrak nama objek"\ngit push origin kesepakatan-v1',
            },
            expected: { text: "Total 0 (delta 0), reused 0 (delta 0)", screens: [] },
            bukti: "`git tag --list` memuat kesepakatan-v1 dan grup sudah membalas setuju.",
          },
        ],
      },
      {
        id: "F2",
        title: "Dua prosedur",
        tag: "prosedur",
        ...doc("sql/04_prosedur.sql"),
        steps: [
          {
            id: "a1-5",
            title: "Rancang sp_daftar_kunjungan",
            baca: ["sql/04_prosedur.sql komentar rancangan"],
            kerja: [
              "Parameter: id_pasien, id_jadwal, keluhan.",
              "Prosedur mengembalikan id_kunjungan baru dan menolak kuota penuh.",
            ],
            command: { label: "Lihat signature", code: "grep -n 'CREATE PROCEDURE' sql/04_prosedur.sql" },
            expected: {
              text: "CREATE PROCEDURE sp_daftar_kunjungan(\n  IN p_id_pasien INT, IN p_id_jadwal INT, IN p_keluhan TEXT,\n  OUT p_id_kunjungan INT)",
              screens: ["05-prosedur"],
            },
            bukti: "Signature memakai IN untuk masukan dan OUT untuk id hasil.",
          },
          {
            id: "a1-6",
            title: "Tulis isi sp_daftar_kunjungan",
            baca: ["tools/db.sh", "sql/04_prosedur.sql blok TODO"],
            kerja: [
              "Cek kuota jadwal lewat SELECT COUNT di dalam transaksi.",
              "INSERT kunjungan berstatus Menunggu, lalu set OUT p_id_kunjungan lewat LAST_INSERT_ID().",
            ],
            command: {
              label: "Muat prosedur",
              code: "mysql klinik_pratama < sql/04_prosedur.sql",
            },
            expected: { text: "(kosong; prosedur terdaftar tanpa galat)", screens: ["05-prosedur"] },
            bukti: "`SHOW PROCEDURE STATUS WHERE Db='klinik_pratama'` menampilkan dua prosedur.",
          },
          {
            id: "a1-7",
            title: "Tulis sp_bayar_kunjungan dengan transaksi",
            baca: ["sql/04_prosedur.sql blok pembayaran"],
            kerja: [
              "Mulai START TRANSACTION, isi metode dan jumlah bayar, ubah status pembayaran.",
              "COMMIT bila berhasil, ROLLBACK bila kunjungan sudah dibayar.",
            ],
            command: {
              label: "Uji pembayaran",
              code: "CALL sp_bayar_kunjungan(1, 'Tunai', 75000, @ok);\nSELECT @ok;",
            },
            expected: { text: "ok\n1", screens: ["05-prosedur"] },
            bukti: "Panggilan kedua pada kunjungan yang sama mengembalikan 0, bukan galat.",
          },
          {
            id: "a1-8",
            title: "Uji jalur gagal prosedur",
            baca: ["panduan anggota 1 bagian uji"],
            kerja: [
              "Panggil sp_daftar_kunjungan pada jadwal yang sudah 20 pasien.",
              "Simpan keluaran galat ke bukti/04_prosedur.txt.",
            ],
            command: {
              label: "Panggil jadwal penuh",
              code: "CALL sp_daftar_kunjungan(1, 7, 'kontrol', @id);\nSELECT @id;",
            },
            expected: {
              text: "ERROR 1644 (45000): kuota jadwal penuh\n@id = NULL",
              screens: ["05-prosedur"],
            },
            bukti: "Galat 1644 muncul dan transaksi tidak menyisakan baris kunjungan baru.",
          },
        ],
      },
      {
        id: "F4",
        title: "Laporan",
        tag: "laporan",
        ...outputDoc("laporan/template-laporan.tex"),
        steps: [
          {
            id: "a1-9",
            title: "Susun Bab I studi kasus",
            baca: ["laporan/template-laporan.tex bagian Deskripsi Basis Data"],
            kerja: [
              "Tulis latar belakang, ruang lingkup klinik, dan tujuan basis data.",
              "Gunakan angka dari PRD, bukan angka karangan.",
            ],
            command: { label: "Buka kerangka", code: "sed -n '99,104p' laporan/template-laporan.tex" },
            expected: {
              text: "\\section{Deskripsi Basis Data}\n\\subsection{Latar belakang dan studi kasus}",
              screens: ["09-laporan"],
            },
            bukti: "Bab I selesai dan setiap angka punya rujukan PRD.",
          },
          {
            id: "a1-10",
            title: "Susun Bab III pembahasan",
            baca: ["laporan/template-laporan.tex bagian Perancangan dan Implementasi"],
            kerja: [
              "Jelaskan keputusan skema, normalisasi, dan pengaman aturan bisnis.",
              "Sertakan tabel peran enam anggota.",
            ],
            command: {
              label: "Cari bagian pembahasan",
              code: "grep -n 'Perancangan dan Implementasi' laporan/template-laporan.tex",
            },
            expected: { text: "282:\\section{Perancangan dan Implementasi}", screens: ["09-laporan"] },
            bukti: "Bab III menjelaskan keputusan yang bisa ditunjuk di berkas SQL.",
          },
          {
            id: "a1-11",
            title: "Kumpulkan bukti semua anggota",
            baca: ["panduan anggota 6 bagian bukti"],
            kerja: [
              "Minta tiap anggota mengirim keluaran perintah berkasnya.",
              "Simpan dengan nama tetap di bukti/, jangan menyalin angka lama.",
            ],
            command: { label: "Periksa kelengkapan bukti", code: "ls bukti" },
            expected: {
              text: "00-reset.txt  03_view_trigger.txt  04_prosedur.txt\n05_keamanan.txt  06_indeks.txt  07_pengujian.txt  10-kueri.txt",
              screens: [],
            },
            bukti: "Tujuh berkas bukti ada dan tanggalnya baru.",
          },
          {
            id: "a1-12",
            title: "Rakit laporan dan bangun PDF",
            baca: ["tools/build.sh"],
            kerja: [
              "Jalankan build PDF; gagal bila ada rujukan menggantung.",
              "Cocokkan setiap angka laporan dengan berkas bukti/.",
            ],
            command: { label: "Bangun PDF", code: "bash tools/build.sh" },
            expected: {
              text: "laporan.pdf: 24 halaman\npanduan.pdf: 40 halaman\nbuild selesai, tanpa rujukan menggantung",
              screens: ["09-laporan"],
            },
            bukti: "Kedua PDF terbangun dan tidak ada peringatan rujukan menggantung.",
          },
        ],
      },
    ],
  },
  {
    code: "A2",
    role: "Data contoh dan normalisasi",
    branch: "anggota-2/data",
    level: "Awal",
    filesOwned: ["sql/02_data.sql"],
    drivers: ["mysql 8.0", "git"],
    scenarios: ["isi semua tabel", "keadaan khusus", "1NF sampai BCNF"],
    screens: ["01-reset-db", "03-verify"],
    larangan: [
      "Jangan mengubah definisi tabel; laporkan ke Farras bila kolom kurang.",
      "Jangan mengisi data yang melanggar constraint, itu bahan uji terkontrol.",
    ],
    phases: [
      {
        id: "F2",
        title: "Data contoh",
        tag: "data-v1",
        ...doc("sql/02_data.sql"),
        steps: [
          {
            id: "a2-1",
            title: "Rencanakan jumlah baris per tabel",
            baca: ["sql/02_data.sql komentar urutan"],
            kerja: [
              "Isi minimal 5 baris per tabel, mulai dari tabel tanpa kunci asing.",
              "Jaga urutan: poli, dokter, pasien, jadwal, obat, stok, kunjungan, pembayaran, users.",
            ],
            command: { label: "Lihat urutan muat", code: "grep -n 'INSERT INTO' sql/02_data.sql | head" },
            expected: {
              text: "INSERT INTO poli ...\nINSERT INTO dokter ...\nINSERT INTO pasien ...\nINSERT INTO jadwal ...",
              screens: ["01-reset-db"],
            },
            bukti: "Urutan INSERT tidak melanggar kunci asing saat dimuat.",
          },
          {
            id: "a2-2",
            title: "Isi master poli dan dokter",
            baca: ["sql/02_data.sql blok master"],
            kerja: [
              "Lima poli dengan lantai berbeda.",
              "Enam dokter, satu di antaranya jadwalnya penuh untuk bahan uji kuota.",
            ],
            command: {
              label: "Hitung dokter",
              code: "mysql klinik_pratama -e 'SELECT COUNT(*) FROM dokter;'",
            },
            expected: {
              text: "+----------+\n| COUNT(*) |\n+----------+\n|        6 |\n+----------+",
              screens: [],
            },
            bukti: "Jumlah dokter enam dan email semuanya unik.",
          },
          {
            id: "a2-3",
            title: "Isi pasien dan jadwal",
            baca: ["sql/02_data.sql blok pasien"],
            kerja: [
              "Sepuluh pasien dengan tanggal lahir masuk akal.",
              "Dua kunjungan berstatus Batal untuk bahan uji agregasi.",
            ],
            command: {
              label: "Hitung pasien",
              code: "mysql klinik_pratama -e 'SELECT COUNT(*) FROM pasien;'",
            },
            expected: {
              text: "+----------+\n| COUNT(*) |\n+----------+\n|       10 |\n+----------+",
              screens: [],
            },
            bukti: "Sepuluh pasien, tidak ada nomor telepon ganda.",
          },
          {
            id: "a2-4",
            title: "Isi kunjungan dan pembayaran",
            baca: ["sql/02_data.sql blok transaksi"],
            kerja: [
              "Delapan kunjungan aktif, dua Batal, tiga pembayaran Belum Lunas.",
              "Jadwal nomor 7 penuh 20 kunjungan sebagai bahan uji prosedur.",
            ],
            command: {
              label: "Rekap status",
              code: "mysql klinik_pratama -e 'SELECT status_kunjungan, COUNT(*) FROM kunjungan GROUP BY 1;'",
            },
            expected: {
              text: "Menunggu  8\nDiperiksa 2\nSelesai   10\nBatal     2",
              screens: ["03-verify"],
            },
            bukti: "Rekap cocok dengan angka yang dituntut verify.sh bagian isi.",
          },
          {
            id: "a2-5",
            title: "Siapkan keadaan khusus",
            baca: ["panduan anggota 2 bagian keadaan khusus"],
            kerja: [
              "Satu obat berstok 5 untuk uji stok minimum.",
              "Satu jadwal terisi 20 kunjungan untuk uji kuota.",
            ],
            command: {
              label: "Cek keadaan khusus",
              code: 'mysql klinik_pratama -e "SELECT id_obat, stok FROM stok_obat WHERE stok = 5;"',
            },
            expected: { text: "id_obat 8 | stok 5", screens: [] },
            bukti: "Keadaan khusus muncul dan dipakai oleh uji di sql/07_pengujian.sql.",
          },
          {
            id: "a2-6",
            title: "Uji pelanggaran kunci asing",
            baca: ["panduan anggota 2 bagian galat"],
            kerja: [
              "Coba INSERT kunjungan dengan id_pasien yang tidak ada.",
              "Pastikan database menolak dengan galat 1452.",
            ],
            command: {
              label: "Uji FK",
              code: "mysql klinik_pratama -e \"INSERT INTO kunjungan (id_pasien, id_jadwal, tanggal_kunjungan) VALUES (99, 1, '2026-11-30');\"",
            },
            expected: {
              text: "ERROR 1452 (23000): Cannot add or update a child row: a foreign key constraint fails",
              screens: [],
            },
            bukti: "Galat 1452 muncul, bukan baris yatim.",
          },
        ],
      },
      {
        id: "F3",
        title: "Normalisasi",
        tag: "normalisasi",
        ...panduanDoc("docs/panduan-anggota-2-normalisasi-data.md"),
        steps: [
          {
            id: "a2-7",
            title: "Tulis analisis 1NF",
            baca: ["panduan anggota 2 bagian 1NF"],
            kerja: [
              "Tunjukkan satu tabel rancangan awal yang kolomnya berulang (misal obat pada resep).",
              "Pecah menjadi resep dan resep_obat.",
            ],
            command: { label: "Cari bagian 1NF", code: "grep -n '1NF' laporan/template-laporan.tex" },
            expected: {
              text: "348:% Jelaskan tahap unnormalized, 1NF, 2NF, 3NF, dan BCNF. Sertakan tabel",
              screens: [],
            },
            bukti: "Tidak ada kolom berisi daftar pada skema final.",
          },
          {
            id: "a2-8",
            title: "Tulis analisis 2NF dan 3NF",
            baca: ["panduan anggota 2 bagian 2NF"],
            kerja: [
              "Buktikan tidak ada dependensi parsial pada kunci gabungan.",
              "Pisahkan atribut yang bergantung pada kolom non-kunci.",
            ],
            command: { label: "Cari bagian 2NF", code: "grep -n '2NF' laporan/template-laporan.tex" },
            expected: {
              text: "348:% Jelaskan tahap unnormalized, 1NF, 2NF, 3NF, dan BCNF. Sertakan tabel",
              screens: [],
            },
            bukti: "Setiap tabel memakai kunci tunggal atau kunci gabungan yang penuh.",
          },
          {
            id: "a2-9",
            title: "Tulis analisis BCNF",
            baca: ["panduan anggota 2 bagian BCNF"],
            kerja: [
              "Daftar semua kandidat kunci per tabel.",
              "Tunjukkan setiap determinan adalah kandidat kunci.",
            ],
            command: { label: "Cari bagian BCNF", code: "grep -n 'BCNF' laporan/template-laporan.tex" },
            expected: {
              text: "348:% Jelaskan tahap unnormalized, 1NF, 2NF, 3NF, dan BCNF. Sertakan tabel",
              screens: [],
            },
            bukti: "Contoh determinan di luar kandidat kunci tidak tersisa.",
          },
          {
            id: "a2-10",
            title: "Daftar dependensi fungsional",
            baca: ["panduan anggota 2 bagian dependensi"],
            kerja: [
              "Tulis notasi X -> Y untuk setiap atribut.",
              "Tandai dependensi yang dipecah saat normalisasi.",
            ],
            command: { label: "Hitung dependensi", code: "sed -n '346,352p' laporan/template-laporan.tex" },
            expected: {
              text: "\\subsection{Normalisasi}\n% Jelaskan tahap unnormalized, 1NF, 2NF, 3NF, dan BCNF. Sertakan tabel",
              screens: [],
            },
            bukti: "Masing-masing dependensi bisa ditunjukkan pada tabel final.",
          },
          {
            id: "a2-11",
            title: "Verifikasi data dengan query dasar",
            baca: ["panduan anggota 2 bagian bukti"],
            kerja: [
              "Jalankan query dasar: pasien per poli, kunjungan per bulan.",
              "Simpan tangkapan layar ke bukti/ atau lampirkan di laporan.",
            ],
            command: {
              label: "Kunjungan per bulan",
              code: "SELECT DATE_FORMAT(tanggal_kunjungan,'%Y-%m') bulan, COUNT(*) jumlah FROM kunjungan GROUP BY 1;",
            },
            expected: { text: "2026-10 | 6\n2026-11 | 16", screens: ["03-verify"] },
            bukti: "Tabel hasil muncul dan angkanya sama dengan isi data contoh.",
          },
          {
            id: "a2-12",
            title: "Kirim bagian laporan normalisasi",
            baca: ["laporan/template-laporan.tex bagian Normalisasi"],
            kerja: [
              "Ringkas 1NF sampai BCNF ke Bab II.",
              "Serahkan ke A1 untuk dirakit bersama laporan lain.",
            ],
            command: {
              label: "Buka kerangka Bab II",
              code: "grep -n 'Normalisasi' laporan/template-laporan.tex",
            },
            expected: { text: "\\section{Normalisasi 1NF sampai BCNF}", screens: ["09-laporan"] },
            bukti: "Bagian laporan normalisasi terkirim dan rujukannya sesuai berkas.",
          },
        ],
      },
    ],
  },
  {
    code: "A3",
    role: "Struktur dan transformasi",
    branch: "anggota-3/skema",
    level: "Awal",
    filesOwned: ["sql/01_struktur.sql"],
    drivers: ["mysql 8.0", "git"],
    scenarios: ["sebelas tabel", "kunci dan constraint", "skema relasional"],
    screens: ["02-struktur", "01-reset-db"],
    larangan: [
      "Jangan mengisi data contoh, itu tugas Dapa.",
      "Jangan menambah kolom baru tanpa memperbarui sql/00-kesepakatan.sql.",
    ],
    phases: [
      {
        id: "F1",
        title: "Skema fisik",
        tag: "skema-v1",
        ...doc("sql/01_struktur.sql"),
        steps: [
          {
            id: "a3-1",
            title: "Tulis sebelas tabel dasar",
            baca: ["sql/01_struktur.sql komentar urutan"],
            kerja: [
              "Urutkan CREATE TABLE dari tabel tanpa kunci asing.",
              "Pakai ENGINE=InnoDB dan charset utf8mb4.",
            ],
            command: { label: "Hitung tabel", code: "grep -c '^CREATE TABLE' sql/01_struktur.sql" },
            expected: { text: "11", screens: ["02-struktur"] },
            bukti: "Sebelas tabel, urutannya bisa dimuat tanpa galat.",
          },
          {
            id: "a3-2",
            title: "Pasang kunci primer",
            baca: ["sql/01_struktur.sql blok PRIMARY KEY"],
            kerja: [
              "Setiap tabel memakai id auto increment sebagai kunci primer.",
              "Tabel penghubung memakai kunci gabungan.",
            ],
            command: {
              label: "Daftar kunci primer",
              code: "grep -n 'PRIMARY KEY' sql/01_struktur.sql",
            },
            expected: { text: "11 baris PRIMARY KEY (satu per tabel)", screens: ["02-struktur"] },
            bukti: "Verifikasi struktur di verify.sh lulus bagian A.",
          },
          {
            id: "a3-3",
            title: "Pasang sepuluh kunci asing",
            baca: ["sql/01_struktur.sql blok CONSTRAINT"],
            kerja: [
              "Hubungkan dokter ke poli, jadwal ke dokter, kunjungan ke pasien dan jadwal.",
              "Pakai ON DELETE RESTRICT agar riwayat tidak hilang.",
            ],
            command: {
              label: "Hitung kunci asing",
              code: "grep -c 'FOREIGN KEY' sql/01_struktur.sql",
            },
            expected: { text: "10", screens: ["02-struktur"] },
            bukti: "Sepuluh FK terdaftar dan tidak ada referensi ke tabel yang belum dibuat.",
          },
          {
            id: "a3-4",
            title: "Pasang ENUM dan CHECK status",
            baca: ["sql/01_struktur.sql blok status_kunjungan"],
            kerja: [
              "ENUM status_kunjungan berisi Menunggu, Diperiksa, Selesai, Batal.",
              "CHECK memastikan jumlah bayar tidak negatif.",
            ],
            command: {
              label: "Uji nilai terlarang",
              code: "mysql klinik_pratama -e \"INSERT INTO kunjungan (id_pasien,id_jadwal,tanggal_kunjungan,status_kunjungan) VALUES (1,1,'2026-11-30','Hilang');\"",
            },
            expected: {
              text: "ERROR 1265 (01000): Data truncated for column 'status_kunjungan' at row 1",
              screens: [],
            },
            bukti: "Nilai di luar ENUM ditolak database.",
          },
          {
            id: "a3-5",
            title: "Pasang UNIQUE untuk data kependudukan",
            baca: ["sql/01_struktur.sql blok UNIQUE"],
            kerja: ["no_sip dokter dan email unik.", "satu kunjungan hanya punya satu pembayaran."],
            command: { label: "Cari UNIQUE", code: "grep -n 'UNIQUE' sql/01_struktur.sql" },
            expected: {
              text: "UNIQUE KEY uq_dokter_no_sip ...\nUNIQUE KEY uq_dokter_email ...\nUNIQUE KEY uq_pembayaran_kunjungan ...",
              screens: [],
            },
            bukti: "Insert duplikat ditolak galat 1062.",
          },
          {
            id: "a3-6",
            title: "Muat skema dari database kosong",
            baca: ["tools/reset-db.sh"],
            kerja: [
              "Jalankan reset-db.sh; berkas 01 dimuat setelah 00.",
              "Perbaiki galat sintaks sebelum membuka PR.",
            ],
            command: { label: "Muat ulang", code: "bash tools/reset-db.sh" },
            expected: { text: "tabel terdaftar: 11", screens: ["01-reset-db"] },
            bukti: "Tidak ada galat SQL dan jumlah tabel sebelas.",
          },
        ],
      },
      {
        id: "F2",
        title: "Transformasi dan aljabar",
        tag: "transformasi",
        ...panduanDoc("docs/panduan-anggota-3-struktur-transformasi.md"),
        steps: [
          {
            id: "a3-7",
            title: "Susun tabel transformasi dari ERD",
            baca: ["panduan anggota 3 bagian tabel"],
            kerja: [
              "Setiap entitas ERD menjadi satu tabel.",
              "Relasi banyak ke banyak dipecah menjadi tabel penghubung.",
            ],
            command: {
              label: "Cari tabel transformasi",
              code: "grep -n 'Transformasi ke skema relasional' laporan/template-laporan.tex",
            },
            expected: { text: "340:\\subsection{Transformasi ke skema relasional}", screens: [] },
            bukti: "Jumlah baris transformasi sama dengan jumlah entitas ERD.",
          },
          {
            id: "a3-8",
            title: "Tulis skema relasional final",
            baca: ["panduan anggota 3 bagian skema"],
            kerja: [
              "Tulis notasi R(kunci, atribut...) untuk setiap tabel.",
              "Tandai kunci asing dengan panah ke tabel tujuan.",
            ],
            command: {
              label: "Lihat skema relasional",
              code: "sed -n '340,352p' laporan/template-laporan.tex",
            },
            expected: {
              text: "\\subsection{Transformasi ke skema relasional}\n\\subsection{Normalisasi}",
              screens: [],
            },
            bukti: "Setiap atribut di skema relasional muncul di sql/01_struktur.sql.",
          },
          {
            id: "a3-9",
            title: "Tulis aljabar relasional",
            baca: ["panduan anggota 3 bagian aljabar"],
            kerja: [
              "Tulis proyeksi, seleksi, dan join untuk tiga query penting.",
              "Terjemahkan notasi ke SQL dan jalankan.",
            ],
            command: {
              label: "Contoh join",
              code: "SELECT p.nama_pasien, d.nama_dokter FROM kunjungan k JOIN pasien p ON p.id_pasien=k.id_pasien JOIN jadwal j ON j.id_jadwal=k.id_jadwal JOIN dokter d ON d.id_dokter=j.id_dokter;",
            },
            expected: { text: "10 baris pasangan pasien-dokter", screens: [] },
            bukti: "Notasi aljabar dan SQL menghasilkan baris yang sama.",
          },
          {
            id: "a3-10",
            title: "Periksa kandidat kunci",
            baca: ["panduan anggota 3 bagian kunci"],
            kerja: ["Pastikan setiap kandidat kunci ditandai.", "Cocokkan dengan hasil normalisasi Dapa."],
            command: {
              label: "Cek kandidat kunci dokter",
              code: "mysql klinik_pratama -e 'SHOW KEYS FROM dokter;'",
            },
            expected: { text: "id_dokter PRIMARY\nno_sip UNIQUE\nemail UNIQUE", screens: [] },
            bukti: "Tidak ada tabel tanpa kandidat kunci yang jelas.",
          },
          {
            id: "a3-11",
            title: "Bandingkan skema dengan verify.sh",
            baca: ["tools/verify.sh bagian A"],
            kerja: [
              "Jalankan verify.sh bagian struktur.",
              "Perbaiki nama kolom yang tidak cocok dengan kontrak.",
            ],
            command: { label: "Verifikasi struktur", code: "bash tools/verify.sh" },
            expected: {
              text: "A struktur ..... 11 lulus\n...\nLulus: 34   Gagal: 0",
              screens: ["03-verify"],
            },
            bukti: "Bagian A lulus penuh.",
          },
          {
            id: "a3-12",
            title: "Kirim bagian laporan skema",
            baca: ["laporan/template-laporan.tex bagian Transformasi ke skema relasional"],
            kerja: [
              "Tulis tabel transformasi dan skema relasional di Bab II.",
              "Serahkan ke A1 untuk dirakit.",
            ],
            command: {
              label: "Buka kerangka",
              code: "grep -n 'Transformasi ke skema relasional' laporan/template-laporan.tex",
            },
            expected: { text: "340:\\subsection{Transformasi ke skema relasional}", screens: ["09-laporan"] },
            bukti: "Bagian laporan skema terkirim tanpa angka karangan.",
          },
        ],
      },
    ],
  },
  {
    code: "A4",
    role: "View, trigger, dan indeks",
    branch: "anggota-4/objek",
    level: "Menengah",
    filesOwned: ["sql/03_view_trigger.sql", "sql/06_indeks.sql"],
    drivers: ["mysql 8.0", "git"],
    scenarios: ["dua view", "empat trigger", "dua indeks dengan EXPLAIN"],
    screens: ["04-view-trigger", "07-indeks"],
    larangan: [
      "Jangan mengubah tabel dasar untuk memperbaiki trigger; laporkan ke Farras.",
      "Jangan membuat indeks di luar dua indeks yang disepakati.",
    ],
    phases: [
      {
        id: "F1",
        title: "View dan trigger",
        tag: "objek-v1",
        ...doc("sql/03_view_trigger.sql"),
        steps: [
          {
            id: "a4-1",
            title: "Buat view v_kunjungan_harian",
            baca: ["sql/03_view_trigger.sql blok view"],
            kerja: [
              "Gabungkan kunjungan, pasien, jadwal, dan dokter.",
              "Sertakan tanggal dan status untuk laporan harian.",
            ],
            command: {
              label: "Uji view",
              code: "SELECT * FROM v_kunjungan_harian LIMIT 5;",
            },
            expected: {
              text: "5 baris berisi nama_pasien, nama_dokter, tanggal_kunjungan, status_kunjungan",
              screens: ["04-view-trigger"],
            },
            bukti: "View mengembalikan baris tanpa galat kolom ambigu.",
          },
          {
            id: "a4-2",
            title: "Buat view v_stok_obat",
            baca: ["sql/03_view_trigger.sql blok stok"],
            kerja: ["Tampilkan obat dengan stok di bawah batas minimum.", "Urutkan dari stok terkecil."],
            command: { label: "Uji view stok", code: "SELECT * FROM v_stok_obat;" },
            expected: { text: "id_obat 8 | Paracetamol | stok 5 | minimum 10", screens: ["04-view-trigger"] },
            bukti: "Hanya obat di bawah minimum yang muncul.",
          },
          {
            id: "a4-3",
            title: "Trigger kuota harian",
            baca: ["sql/03_view_trigger.sql blok trg_kuota"],
            kerja: [
              "BEFORE INSERT pada kunjungan: hitung kunjungan hari itu untuk jadwal yang sama.",
              "Tolak bila sudah 20 dengan SIGNAL SQLSTATE 45000.",
            ],
            command: {
              label: "Uji kuota",
              code: "CALL sp_daftar_kunjungan(1, 7, 'kontrol', @id);",
            },
            expected: { text: "ERROR 1644 (45000): kuota jadwal penuh", screens: ["04-view-trigger"] },
            bukti: "Insert ke-21 ditolak, insert ke-20 tetap masuk.",
          },
          {
            id: "a4-4",
            title: "Trigger bentrok jadwal",
            baca: ["sql/03_view_trigger.sql blok trg_bentrok"],
            kerja: [
              "Tolak dua kunjungan pasien yang sama pada jam yang sama.",
              "Pesan galat menyebut jadwal yang bentrok.",
            ],
            command: {
              label: "Uji bentrok",
              code: "INSERT INTO kunjungan (id_pasien,id_jadwal,tanggal_kunjungan,jam_kunjungan) VALUES (1,2,'2026-11-30','09:00');",
            },
            expected: { text: "ERROR 1644 (45000): jadwal pasien bentrok", screens: [] },
            bukti: "Galat bentrok muncul untuk pasien yang jadwalnya tumpang tindih.",
          },
          {
            id: "a4-5",
            title: "Trigger stok obat",
            baca: ["sql/03_view_trigger.sql blok trg_stok"],
            kerja: ["Kurangi stok saat resep_obat ditulis.", "Tolak bila stok menjadi negatif."],
            command: {
              label: "Uji stok negatif",
              code: "INSERT INTO resep_obat (id_resep,id_obat,jumlah) VALUES (1,8,99);",
            },
            expected: { text: "ERROR 1644 (45000): stok obat tidak cukup", screens: ["04-view-trigger"] },
            bukti: "Stok tidak pernah negatif setelah percobaan.",
          },
          {
            id: "a4-6",
            title: "Trigger pembayaran kedua",
            baca: ["sql/03_view_trigger.sql blok trg_bayar"],
            kerja: [
              "Tolak INSERT pembayaran bila kunjungan sudah dibayar.",
              "Uji lewat prosedur dan lewat INSERT langsung.",
            ],
            command: {
              label: "Uji pembayaran ganda",
              code: "INSERT INTO pembayaran (id_kunjungan, jumlah_bayar, metode) VALUES (1, 50000, 'Tunai');",
            },
            expected: {
              text: "ERROR 1062 (23000): Duplicate entry '1' for key 'uq_pembayaran_kunjungan'",
              screens: [],
            },
            bukti: "Tidak ada dua pembayaran untuk satu kunjungan.",
          },
        ],
      },
      {
        id: "F2",
        title: "Indeks",
        tag: "indeks-v1",
        ...doc("sql/06_indeks.sql"),
        steps: [
          {
            id: "a4-7",
            title: "Ukur rencana query sebelum indeks",
            baca: ["sql/06_indeks.sql komentar EXPLAIN"],
            kerja: [
              "Jalankan EXPLAIN untuk pencarian pasien berdasarkan nama.",
              "Catat apakah kolom key kosong.",
            ],
            command: {
              label: "EXPLAIN pencarian nama",
              code: "EXPLAIN SELECT id_pasien FROM pasien WHERE nama_pasien LIKE 'A%';",
            },
            expected: { text: "type ALL | key NULL | rows 10", screens: ["07-indeks"] },
            bukti: "Rencana query memindai semua baris sebelum indeks dibuat.",
          },
          {
            id: "a4-8",
            title: "Buat idx_pasien_nama",
            baca: ["sql/06_indeks.sql blok idx_pasien_nama"],
            kerja: [
              "CREATE INDEX idx_pasien_nama ON pasien(nama_pasien).",
              "Jalankan EXPLAIN lagi dan pastikan key terisi.",
            ],
            command: {
              label: "Buat dan ukur indeks",
              code: "CREATE INDEX idx_pasien_nama ON pasien(nama_pasien);\nEXPLAIN SELECT id_pasien FROM pasien WHERE nama_pasien LIKE 'A%';",
            },
            expected: { text: "key idx_pasien_nama | rows 1", screens: ["07-indeks"] },
            bukti: "Keluaran EXPLAIN pada kolom key memuat idx_pasien_nama.",
          },
          {
            id: "a4-9",
            title: "Buat idx_kunjungan_tanggal",
            baca: ["sql/06_indeks.sql blok idx_kunjungan_tanggal"],
            kerja: ["Indeks untuk rentang tanggal kunjungan.", "Bandingkan rencana query sesudah indeks."],
            command: {
              label: "Buat dan ukur indeks tanggal",
              code: "CREATE INDEX idx_kunjungan_tanggal ON kunjungan(tanggal_kunjungan);\nEXPLAIN SELECT * FROM kunjungan WHERE tanggal_kunjungan BETWEEN '2026-11-01' AND '2026-11-30';",
            },
            expected: { text: "key idx_kunjungan_tanggal | type range", screens: ["07-indeks"] },
            bukti: "Type berubah dari ALL menjadi range.",
          },
        ],
      },
      {
        id: "F3",
        title: "Bukti objek",
        tag: "bukti",
        ...outputDoc("bukti"),
        steps: [
          {
            id: "a4-10",
            title: "Simpan bukti view dan trigger",
            baca: ["bukti/03_view_trigger.txt"],
            kerja: ["Jalankan semua uji trigger, arahkan keluaran ke berkas bukti."],
            command: {
              label: "Simpan bukti",
              code: "bash tools/run-sql.sh sql/03_view_trigger.sql > bukti/03_view_trigger.txt",
            },
            expected: { text: "Berkas bukti berisi dua view dan empat uji trigger", screens: [] },
            bukti: "Setiap galat yang disengaja tercatat lengkap dengan kodenya.",
          },
          {
            id: "a4-11",
            title: "Simpan bukti indeks",
            baca: ["bukti/06_indeks.txt"],
            kerja: ["Catat EXPLAIN sebelum dan sesudah untuk dua indeks."],
            command: {
              label: "Simpan bukti indeks",
              code: "bash tools/run-sql.sh sql/06_indeks.sql > bukti/06_indeks.txt",
            },
            expected: { text: "Empat blok EXPLAIN: dua sebelum, dua sesudah", screens: ["07-indeks"] },
            bukti: "Kolom key pada blok sesudah memuat nama indeks.",
          },
          {
            id: "a4-12",
            title: "Kirim bagian laporan objek",
            baca: ["laporan/template-laporan.tex bagian Source code"],
            kerja: ["Ringkas view, trigger, dan indeks beserta bukti EXPLAIN ke Bab II, serahkan ke A1."],
            command: {
              label: "Buka kerangka",
              code: "grep -n 'View dan Trigger' laporan/template-laporan.tex",
            },
            expected: { text: "\\section{View, Trigger, dan Indeks}", screens: ["09-laporan"] },
            bukti: "Bagian laporan objek terkirim dengan rujukan bukti yang benar.",
          },
        ],
      },
    ],
  },
  {
    code: "A5",
    role: "Keamanan dan kueri",
    branch: "anggota-5/kueri",
    level: "Menengah",
    filesOwned: ["sql/05_keamanan.sql", "bukti/10-kueri.txt", "bukti/kueri-panduan.sql"],
    drivers: ["mysql 8.0", "git"],
    scenarios: ["tiga pengguna", "hak akses minimal", "sepuluh kueri"],
    screens: ["06-keamanan", "03-verify"],
    larangan: [
      "Jangan memberi hak ALL PRIVILEGES; pakai hak minimal per peran.",
      "Jangan menaruh kata sandi nyata di berkas; pakai nilai contoh yang jelas.",
    ],
    phases: [
      {
        id: "F1",
        title: "Pengguna dan hak akses",
        tag: "keamanan-v1",
        ...doc("sql/05_keamanan.sql"),
        steps: [
          {
            id: "a5-1",
            title: "Buat tiga pengguna klinik",
            baca: ["sql/05_keamanan.sql blok CREATE USER"],
            kerja: [
              "Buat klinik_admin, klinik_dokter, klinik_kasir.",
              "Pakai kata sandi contoh yang tidak dipakai di tempat lain.",
            ],
            command: { label: "Buat pengguna", code: "mysql klinik_pratama < sql/05_keamanan.sql" },
            expected: { text: "(kosong; tiga pengguna terdaftar tanpa galat)", screens: ["06-keamanan"] },
            bukti: "`SELECT user FROM mysql.user LIKE 'klinik%'` menampilkan tiga baris.",
          },
          {
            id: "a5-2",
            title: "Beri hak minimal per peran",
            baca: ["sql/05_keamanan.sql blok GRANT"],
            kerja: [
              "Dokter: SELECT pada view dan tabel klinis, INSERT/UPDATE kunjungan.",
              "Kasir: SELECT pasien, INSERT/UPDATE pembayaran, tanpa akses tabel users.",
            ],
            command: { label: "Lihat hak", code: "SHOW GRANTS FOR 'klinik_kasir'@'localhost';" },
            expected: {
              text: "GRANT SELECT, INSERT, UPDATE ON klinik_pratama.pembayaran TO ...",
              screens: ["06-keamanan"],
            },
            bukti: "Tidak ada GRANT ALL pada pengguna mana pun.",
          },
          {
            id: "a5-3",
            title: "Uji akses yang harus ditolak",
            baca: ["panduan anggota 5 bagian galat 1142"],
            kerja: [
              "Masuk sebagai kasir, coba baca tabel users.",
              "Pastikan galat 1142 muncul dan catat di bukti.",
            ],
            command: {
              label: "Uji penolakan",
              code: "mysql -u klinik_kasir -p klinik_pratama -e 'SELECT * FROM users;'",
            },
            expected: {
              text: "ERROR 1142 (42000): SELECT command denied to user 'klinik_kasir'@'localhost' for table 'users'",
              screens: ["06-keamanan"],
            },
            bukti: "Galat 1142 tercatat, akses tidak bocor.",
          },
          {
            id: "a5-4",
            title: "Simpan bukti keamanan",
            baca: ["bukti/05_keamanan.txt"],
            kerja: ["Catat SHOW GRANTS tiap pengguna dan satu uji penolakan."],
            command: {
              label: "Kumpulkan bukti",
              code: "bash tools/run-sql.sh sql/05_keamanan.sql > bukti/05_keamanan.txt",
            },
            expected: {
              text: "bukti/05_keamanan.txt berisi tiga blok GRANT dan satu galat 1142",
              screens: [],
            },
            bukti: "Berkas bukti aman dibagikan karena tanpa kata sandi nyata.",
          },
        ],
      },
      {
        id: "F2",
        title: "Sepuluh kueri",
        tag: "kueri-v1",
        ...outputDoc("bukti/kueri-panduan.sql"),
        steps: [
          {
            id: "a5-5",
            title: "Kueri Q1 dan Q2: pencarian pasien",
            baca: ["panduan anggota 5 bagian Q1"],
            kerja: [
              "Q1: pasien dengan nama berawalan huruf tertentu.",
              "Q2: pasien yang belum pernah berkunjung.",
            ],
            command: {
              label: "Jalankan Q1",
              code: "SELECT id_pasien, nama_pasien FROM pasien WHERE nama_pasien LIKE 'A%';",
            },
            expected: { text: "3 baris pasien berawalan A", screens: [] },
            bukti: "Keluaran Q1 dan Q2 tersimpan bersama nomor kuerinya.",
          },
          {
            id: "a5-6",
            title: "Kueri Q3 dan Q4: rentang tanggal",
            baca: ["panduan anggota 5 bagian Q3"],
            kerja: ["Q3: kunjungan pada satu bulan.", "Q4: pendaftaran per hari pada minggu terakhir."],
            command: {
              label: "Jalankan Q3",
              code: "SELECT * FROM kunjungan WHERE tanggal_kunjungan BETWEEN '2026-11-01' AND '2026-11-30';",
            },
            expected: { text: "16 baris kunjungan November", screens: [] },
            bukti: "Rentang tanggal memakai indeks yang dibuat Kenzie.",
          },
          {
            id: "a5-7",
            title: "Kueri Q5 dan Q6: join poli dan dokter",
            baca: ["panduan anggota 5 bagian Q5"],
            kerja: ["Q5: jumlah dokter per poli.", "Q6: jadwal dokter beserta hari praktik."],
            command: {
              label: "Jalankan Q5",
              code: "SELECT p.nama_poli, COUNT(d.id_dokter) jumlah FROM poli p LEFT JOIN dokter d ON d.id_poli=p.id_poli GROUP BY p.nama_poli;",
            },
            expected: { text: "Lima poli dengan jumlah dokter masing-masing", screens: [] },
            bukti: "Hasil join sama dengan isi tabel master.",
          },
          {
            id: "a5-8",
            title: "Kueri Q7 dan Q8: agregasi",
            baca: ["panduan anggota 5 bagian Q7"],
            kerja: ["Q7: kunjungan per poli.", "Q8: total pendapatan per bulan."],
            command: {
              label: "Jalankan Q8",
              code: "SELECT DATE_FORMAT(tanggal_bayar,'%Y-%m') bulan, SUM(jumlah_bayar) total FROM pembayaran GROUP BY 1;",
            },
            expected: { text: "2026-10 | 450000\n2026-11 | 1175000", screens: [] },
            bukti: "Angka total sama dengan penjumlahan baris pembayaran.",
          },
          {
            id: "a5-9",
            title: "Kueri Q9: subquery",
            baca: ["panduan anggota 5 bagian Q9"],
            kerja: ["Q9: pasien dengan kunjungan lebih banyak dari rata-rata."],
            command: {
              label: "Jalankan Q9",
              code: "SELECT id_pasien, COUNT(*) n FROM kunjungan GROUP BY id_pasien HAVING n > (SELECT AVG(c) FROM (SELECT COUNT(*) c FROM kunjungan GROUP BY id_pasien) x);",
            },
            expected: { text: "Dua pasien di atas rata-rata", screens: [] },
            bukti: "Subquery berjalan tanpa galat ONLY_FULL_GROUP_BY.",
          },
          {
            id: "a5-10",
            title: "Kueri Q10: bukti indeks terpakai",
            baca: ["sql/06_indeks.sql"],
            kerja: ["Q10: ulangi pencarian pasien, tunjukkan EXPLAIN memakai idx_pasien_nama."],
            command: {
              label: "Jalankan Q10",
              code: "EXPLAIN SELECT id_pasien FROM pasien WHERE nama_pasien LIKE 'A%';",
            },
            expected: { text: "key idx_pasien_nama", screens: ["07-indeks"] },
            bukti: "Kolom key memuat indeks milik Kenzie.",
          },
        ],
      },
      {
        id: "F3",
        title: "Bukti kueri",
        tag: "bukti",
        ...outputDoc("bukti/10-kueri.txt"),
        steps: [
          {
            id: "a5-11",
            title: "Susun berkas bukti sepuluh kueri",
            baca: ["bukti/10-kueri.txt"],
            kerja: ["Tempel SQL dan keluaran Q1 sampai Q10 dengan penomoran tetap."],
            command: {
              label: "Simpan bukti kueri",
              code: "bash tools/run-sql.sh bukti/kueri-panduan.sql > bukti/10-kueri.txt",
            },
            expected: { text: "Q1 .. Q10 tercatat, setiap blok berisi perintah dan hasil", screens: [] },
            bukti: "Sepuluh blok lengkap, bisa ditunjukkan saat demo.",
          },
          {
            id: "a5-12",
            title: "Kirim bagian laporan keamanan",
            baca: ["laporan/template-laporan.tex bagian Source code"],
            kerja: ["Ringkas tiga pengguna, hak minimal, dan dua kueri kunci untuk Bab II."],
            command: { label: "Buka kerangka", code: "grep -n 'Keamanan' laporan/template-laporan.tex" },
            expected: { text: "\\section{Keamanan dan Hak Akses}", screens: ["09-laporan"] },
            bukti: "Bagian laporan keamanan terkirim tanpa menyalin kata sandi.",
          },
        ],
      },
    ],
  },
  {
    code: "A6",
    role: "Pengujian dan rilis",
    branch: "anggota-6/uji-rilis",
    level: "Menengah",
    filesOwned: ["sql/07_pengujian.sql", "bukti/07_pengujian.txt", "bukti/verify.txt"],
    drivers: ["mysql 8.0", "bash", "pdflatex"],
    scenarios: ["sepuluh uji", "34 pemeriksaan", "isolasi transaksi"],
    screens: ["08-uji", "03-verify", "09-laporan"],
    larangan: [
      "Jangan menyunting skema, data, atau objek milik anggota lain; laporkan galat ke pemiliknya.",
      "Jangan melonggarkan pemeriksaan agar lulus.",
    ],
    phases: [
      {
        id: "F4",
        title: "Sepuluh skenario uji",
        tag: "uji-v1",
        ...doc("sql/07_pengujian.sql"),
        steps: [
          {
            id: "a6-1",
            title: "Uji 1 sampai 3: penolakan oleh basis data",
            baca: ["panduan anggota 6 bagian Milestone 1"],
            kerja: [
              "Uji 1: antrean ganda pada satu jadwal, harapkan galat 1062.",
              "Uji 2: kunjungan dengan pasien tak terdaftar, harapkan galat 1452.",
              "Uji 3: suhu tubuh 50 derajat, harapkan galat 3819.",
            ],
            command: {
              label: "Jalankan uji 1-3",
              code: "docker exec -i kbd-mysql mysql -uroot -pkbd --force < sql/07_pengujian.sql",
            },
            expected: {
              text: "Duplicate entry '2-1' for key 'uq_kunjungan_antrean'",
              screens: ["08-uji"],
            },
            bukti: "Tiga galat muncul dengan pesan persis seperti tabel kontrak.",
          },
          {
            id: "a6-2",
            title: "Uji 4 sampai 6: penolakan oleh trigger dan prosedur",
            baca: ["sql/03_trigger.sql", "sql/04_prosedur.sql"],
            kerja: [
              "Uji 4: pendaftaran melewati kuota pada jadwal 7 yang sudah penuh.",
              "Uji 5: jadwal dokter bentrok.",
              "Uji 6: resep melebihi stok obat 8.",
            ],
            command: {
              label: "Jalankan uji 4",
              code: "CALL daftar_kunjungan(1, 7, '2026-12-01', '10:00:00');",
            },
            expected: { text: "Kuota jadwal sudah penuh", screens: ["08-uji"] },
            bukti: "Pesan kuota, bentrok, dan stok kurang tercatat apa adanya.",
          },
          {
            id: "a6-3",
            title: "Uji 7 sampai 9: alur yang harus berhasil",
            baca: ["panduan anggota 6 bagian 1.1"],
            kerja: [
              "Uji 7: daftar lalu bayar pada jadwal Desember 2026, total 155000.00.",
              "Uji 8: bayar kunjungan yang sudah lunas, pesan ditolak.",
              "Uji 9: view v_kunjungan_lengkap menampilkan gabungan.",
            ],
            command: {
              label: "Cek hasil uji 7",
              code: "SELECT total_dibayar FROM pembayaran WHERE id_kunjungan = <id_uji7>;",
            },
            expected: { text: "155000.00", screens: ["08-uji"] },
            bukti: "Uji 7 dan 9 berhasil; uji 8 ditolak dengan pesan sudah dibayar.",
          },
          {
            id: "a6-4",
            title: "Uji 10 dan blok pembersihan",
            baca: ["sql/05_keamanan.sql"],
            kerja: [
              "Uji 10: INSERT oleh petugas ditolak galat 1142, dijalankan bukan sebagai root.",
              "Pastikan blok pembersihan mengembalikan stok dan jumlah baris awal.",
            ],
            command: {
              label: "Simpan bukti uji",
              code: "docker exec -i kbd-mysql mysql -uroot -pkbd --force < sql/07_pengujian.sql > bukti/07_pengujian.txt",
            },
            expected: {
              text: "ERROR 1142 (42000): INSERT command denied ... 'obat'",
              screens: ["06-keamanan"],
            },
            bukti: "Uji bisa dijalankan berulang tanpa mengubah angka laporan.",
          },
        ],
      },
      {
        id: "F5",
        title: "Pemeriksaan otomatis dan isolasi",
        tag: "verify-v1",
        ...doc("tools/verify.sh"),
        steps: [
          {
            id: "a6-5",
            title: "Reset database dan jalankan verify.sh",
            baca: ["panduan anggota 6 bagian Milestone 2"],
            kerja: [
              "Jalankan reset-db.sh supaya pemeriksaan dimulai dari kondisi awal.",
              "Jalankan verify.sh, 34 pemeriksaan dalam tujuh bagian A sampai G.",
            ],
            command: {
              label: "Jalankan pemeriksaan",
              code: "bash tools/reset-db.sh && bash tools/verify.sh > bukti/verify.txt",
            },
            expected: { text: "Lulus: 34   Gagal: 0\nSEMUA PEMERIKSAAN LULUS", screens: ["03-verify"] },
            bukti: "Semua bagian A sampai G lulus; kegagalan berarti skema berubah.",
          },
          {
            id: "a6-6",
            title: "Baca hasil pemeriksaan per bagian",
            baca: ["bukti/verify.txt"],
            kerja: [
              "Bagian E memastikan pesan galatnya sesuai, bukan hanya gagal.",
              "Bagian G membandingkan total tagihan dengan hitungan manual.",
            ],
            command: { label: "Ringkas hasil", code: "grep -c 'OK' bukti/verify.txt" },
            expected: { text: "34 baris OK, nol baris GAGAL", screens: ["03-verify"] },
            bukti: "Laporan menyebut jumlah pemeriksaan per bagian, bukan total saja.",
          },
          {
            id: "a6-7",
            title: "Demo isolasi READ COMMITTED dan REPEATABLE READ",
            baca: ["tools/demo-isolasi.sh"],
            kerja: [
              "Jalankan dua sesi bersamaan pada tingkat isolasi berbeda.",
              "Tunjukkan perbedaan hasil, perubahan stok setelah COMMIT, dan galat 1213.",
            ],
            command: { label: "Demo isolasi", code: "bash tools/demo-isolasi.sh > bukti/isolasi.txt" },
            expected: {
              text: "Hasil kedua tingkat isolasi berbeda; deadlock tercatat",
              screens: ["03-verify"],
            },
            bukti: "Kalau hasilnya sama, sesi kedua tidak benar-benar berjalan bersamaan.",
          },
          {
            id: "a6-8",
            title: "Kumpulkan seluruh bukti",
            baca: ["panduan anggota 6 bagian 3.1"],
            kerja: [
              "Pastikan bukti/ memuat reset, keamanan, indeks, uji, kueri, isolasi, dan verify.",
              "Semua bukti diambil dari database hasil reset-db.sh.",
            ],
            command: { label: "Periksa bukti", code: "ls -la bukti/" },
            expected: { text: "Tujuh berkas bukti lengkap dengan tanggal hari ini", screens: [] },
            bukti: "Tidak ada bukti lama yang tersisa setelah skema berubah.",
          },
        ],
      },
      {
        id: "F6",
        title: "Rilis laporan",
        tag: "rilis-v1",
        ...outputDoc("laporan/template-laporan.tex"),
        steps: [
          {
            id: "a6-9",
            title: "Tulis bab pengujian laporan",
            baca: ["laporan/template-laporan.tex"],
            kerja: [
              "Isi bab pengujian dari kontrak sepuluh uji dan bukti/07_pengujian.txt.",
              "Cocokkan setiap angka dengan bukti, jangan menyalin dari panduan buta.",
            ],
            command: {
              label: "Cari kerangka",
              code: "grep -n 'ISI: ambil dari' laporan/template-laporan.tex",
            },
            expected: {
              text: "Komentar % ISI menandai setiap bagian yang harus diisi",
              screens: ["09-laporan"],
            },
            bukti: "Bab pengujian memakai angka yang sama dengan bukti/.",
          },
          {
            id: "a6-10",
            title: "Rakit laporan lengkap",
            baca: ["panduan anggota 6 bagian 4.1"],
            kerja: [
              "Terima bagian Bab I sampai III dari anggota lain dan gabungkan.",
              "Pastikan Bab II memuat ERD, transformasi, normalisasi, kode, dan tangkapan layar.",
            ],
            command: {
              label: "Periksa struktur",
              code: "grep -n '^\\\\section' laporan/template-laporan.tex",
            },
            expected: {
              text: "99:\\section{Deskripsi Basis Data}\n282:\\section{Perancangan dan Implementasi}",
              screens: ["09-laporan"],
            },
            bukti: "Tidak ada komentar % ISI yang tersisa di laporan final.",
          },
          {
            id: "a6-11",
            title: "Bangun kedua PDF",
            baca: ["tools/build.sh"],
            kerja: [
              "Jalankan build.sh untuk panduan/utama.pdf dan laporan/template-laporan.pdf.",
              "PDF di bawah 100 KB biasanya berarti kompilasi berhenti di tengah.",
            ],
            command: { label: "Build PDF", code: "bash tools/build.sh" },
            expected: { text: "Dua PDF terbangun dengan daftar isi lengkap", screens: ["09-laporan"] },
            bukti: "Sampul laporan memuat nama dan NIM; tidak ada rujukan menggantung.",
          },
          {
            id: "a6-12",
            title: "Daftar periksa akhir sebelum rilis",
            baca: ["panduan anggota 6 bagian Milestone 5"],
            kerja: [
              "Periksa lima belas butir satu per satu, masing-masing dengan bukti.",
              "Pastikan repositori bersih dari .aux, .log, dan .toc.",
            ],
            command: { label: "Cek sisa berkas", code: "git status --porcelain" },
            expected: { text: "Tidak ada berkas .aux, .log, atau .toc tersisa", screens: ["09-laporan"] },
            bukti: "Daftar periksa terisi penuh; rilis siap dikumpulkan.",
          },
        ],
      },
    ],
  },
];

export const JOURNEY = { foundation, members };
