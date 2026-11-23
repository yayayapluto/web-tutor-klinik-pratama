import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Divider } from "@astryxdesign/core/Divider";
import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/HStack";
import { ProgressBar } from "@astryxdesign/core/ProgressBar";
import { Text } from "@astryxdesign/core/Text";
import { Theme } from "@astryxdesign/core/theme";
import { VStack } from "@astryxdesign/core/VStack";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { JOURNEY } from "./data/journey.js";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Copy, Moon, Sun, X } from "./icons.jsx";
import { defaultThemeSlug, themes } from "./theme.js";

const KEY = "klinik-tutor-v1";

const THEME_META = {
  light: { label: "Tema: terang", icon: <Sun /> },
  dark: { label: "Tema: gelap", icon: <Moon /> },
};

const SCREEN_TITLES = {
  "01-reset-db": "Reset database",
  "02-struktur": "Struktur sebelas tabel",
  "03-verify": "Verifikasi 34 pemeriksaan",
  "04-view-trigger": "View dan trigger",
  "05-prosedur": "Prosedur kunjungan",
  "06-keamanan": "Hak akses pengguna",
  "07-indeks": "EXPLAIN sebelum dan sesudah",
  "08-uji": "Sepuluh skenario uji",
  "09-laporan": "Laporan dan PDF",
};

/* ---------- penyimpanan ---------- */

function readStore() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { done: {}, theme: "light" };
    const parsed = JSON.parse(raw);
    return {
      done: parsed?.done && typeof parsed.done === "object" ? parsed.done : {},
      theme: parsed?.theme === "dark" ? "dark" : "light",
    };
  } catch {
    return { done: {}, theme: "light" };
  }
}

function writeStore(value) {
  try {
    localStorage.setItem(KEY, JSON.stringify(value));
  } catch {
    /* mode memori bila localStorage ditolak */
  }
}

/* ---------- util data ---------- */

const screenNo = (id) => id.slice(0, 2).replace(/^0/, "");
const screenTitle = (id) => SCREEN_TITLES[id] ?? id;

function phasesOf(member) {
  return [JOURNEY.foundation, ...member.phases];
}

function allSteps(member) {
  return phasesOf(member).flatMap((phase) => phase.steps);
}

function findStep(member, id) {
  for (const phase of phasesOf(member)) {
    const step = phase.steps.find((item) => item.id === id);
    if (step) return { phase, step };
  }
  return null;
}

/* ---------- progress ring (native <progress>) ---------- */

function ProgressRing({ pct, label }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.style.setProperty("--ring-value", String(pct));
  }, [pct]);
  return (
    <div className="ring-wrap">
      <progress
        ref={ref}
        className="ring"
        value={pct}
        max={100}
        aria-label={label}
        aria-valuetext={`${pct} persen selesai`}
      />
      <span className="ring-text" aria-hidden="true">
        {pct}%
      </span>
    </div>
  );
}

/* ---------- kartu peserta ---------- */

function MemberCard({ member, progress, onPick }) {
  return (
    <button
      className="member-card"
      type="button"
      onClick={onPick}
      aria-label={`${member.code} ${member.role}, ${progress.done} dari ${progress.total} langkah selesai`}
    >
      <span className="member-inner">
        <span className="member-top">
          <span>
            <span className="member-code">{member.code}</span>
            <span className="member-role">{member.role}</span>
          </span>
          <ProgressRing pct={progress.pct} label={`Progres ${member.code}`} />
        </span>
        <Badge label={`Level ${member.level}`} variant="neutral" />
        <span className="member-meta">
          <span>
            Branch <code>{member.branch}</code>
          </span>
          <span>
            Langkah {progress.done}/{progress.total}
          </span>
          <span>Target {member.screens.length} layar</span>
        </span>
        <span className="member-foot">
          <span>{progress.done === progress.total && progress.total > 0 ? "Selesai" : "Buka journey"}</span>
          <span aria-hidden="true">
            <ArrowRight size={18} />
          </span>
        </span>
      </span>
    </button>
  );
}

/* ---------- thumbnail target ---------- */

function Thumbs({ ids, onOpen, compact = false }) {
  return (
    <div className={compact ? "thumbs compact" : "thumbs"}>
      {ids.map((id) => (
        <button
          key={id}
          className="thumb"
          type="button"
          onClick={() => onOpen(ids, ids.indexOf(id))}
          aria-label={`Buka target ${screenNo(id)}: ${screenTitle(id)}`}
        >
          <img src={`/assets/screens/${id}.svg`} alt="" loading="lazy" width="320" height="200" />
          <span>
            {screenNo(id)} · {screenTitle(id)}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ---------- panel timeline ---------- */

function TimelinePanel({ member, stepId, doneOf, unlockedIds, onSelect }) {
  const done = doneOf(member.code);
  return (
    <Card padding={2} elevation="low">
      {phasesOf(member).map((phase) => (
        <div className="phase" key={phase.id}>
          <div className="phase-head">
            <Text type="label">
              {phase.id} · {phase.title}
            </Text>
            {phase.tag ? <Badge label={phase.tag} variant="neutral" /> : null}
          </div>
          <ul className="step-list">
            {phase.steps.map((step) => {
              const isDone = done.has(step.id);
              const isLocked = !unlockedIds.has(step.id);
              return (
                <li key={step.id}>
                  <button
                    type="button"
                    className={`step-btn${isDone ? " is-done" : ""}${isLocked ? " is-locked" : ""}`}
                    aria-current={step.id === stepId ? "step" : undefined}
                    title={
                      isLocked
                        ? "Bisa dibaca. Selesaikan langkah sebelumnya untuk menandai selesai."
                        : undefined
                    }
                    onClick={() => onSelect(step.id)}
                  >
                    <span className="step-dot" aria-hidden="true">
                      {isDone ? <Check size={11} /> : null}
                    </span>
                    <span className="step-title">{step.title}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </Card>
  );
}

/* ---------- panel konteks ---------- */

function ContextPanel({ member, onShot }) {
  return (
    <Card padding={3} elevation="low">
      <VStack gap={2}>
        <VStack gap={0.5}>
          <Text type="body" weight="bold">
            {member.code} · {member.role}
          </Text>
          <Text type="supporting">Klinik Pratama, UAS Konsep Basis Data</Text>
          <code className="branch">{member.branch}</code>
        </VStack>
        <Divider />
        <VStack gap={1}>
          <Text type="label">Berkas milikmu</Text>
          <div className="chips">
            {member.filesOwned.map((file) => (
              <code key={file}>{file}</code>
            ))}
          </div>
        </VStack>
        <Divider />
        <VStack gap={1}>
          <Text type="label">Target akhir</Text>
          <div className="targets">
            <span>
              <Text type="supporting">Alat</Text>
              <strong>{member.drivers.join(", ")}</strong>
            </span>
            <span>
              <Text type="supporting">Cakupan</Text>
              <strong>{member.scenarios.join(", ")}</strong>
            </span>
            <span>
              <Text type="supporting">Layar</Text>
              <strong>{member.screens.length} target</strong>
            </span>
          </div>
        </VStack>
        <Divider />
        <VStack gap={1}>
          <Text type="label">Expected result</Text>
          <Thumbs ids={member.screens} onOpen={onShot} compact />
        </VStack>
        <Divider />
        <VStack gap={1}>
          <Text type="label">Larangan</Text>
          <ul className="dont-list">
            {member.larangan.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </VStack>
      </VStack>
    </Card>
  );
}

/* ---------- detail langkah ---------- */

function Detail({
  member,
  phase,
  step,
  isDone,
  copied,
  canToggle,
  canGoNext,
  position,
  onCopy,
  onToggle,
  onPrev,
  onNext,
  onShot,
}) {
  const docFile = step.doc ?? phase.doc ?? JOURNEY.foundation.doc;
  const docLink = step.href ?? phase.href ?? JOURNEY.foundation.href;

  return (
    <VStack gap={3}>
      <HStack gap={0.5} align="center" wrap="wrap">
        <Badge label={`${phase.id} · ${phase.title}`} variant="neutral" />
        {phase.tag ? <Badge label={phase.tag} variant="neutral" /> : null}
        <Badge label={member.code} variant="info" />
      </HStack>

      <Heading level={2}>{step.title}</Heading>

      {step.materi?.length ? (
        <section className="detail-section">
          <Text type="label">Materi kuliah</Text>
          <div className="chips">
            {step.materi.map((item) => (
              <Badge key={item} label={item} variant="neutral" />
            ))}
          </div>
        </section>
      ) : null}

      <section className="detail-section">
        <Text type="label">Baca dulu</Text>
        <div className="read-links">
          <a className="read-link" href={docLink} target="_blank" rel="noopener noreferrer">
            <code>{docFile}</code>
            <span aria-hidden="true">
              <ArrowUpRight />
            </span>
          </a>
        </div>
        <ul className="baca-list">
          {step.baca.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="detail-section">
        <Text type="label">Langkah kerja</Text>
        <ol className="work-list">
          {step.kerja.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      </section>

      {step.command ? (
        <section className="detail-section">
          <Text type="label">Perintah</Text>
          <HStack gap={1} align="center" justify="between">
            <Text type="supporting">{step.command.label}</Text>
            <Button
              label={copied ? "Tersalin" : "Salin"}
              variant="secondary"
              size="sm"
              icon={<Copy />}
              onClick={() => onCopy(step.command.code)}
            />
          </HStack>
          <pre className="code">
            <code>{step.command.code}</code>
          </pre>
        </section>
      ) : null}

      <section className="detail-section">
        <Text type="label">Expected result</Text>
        <Card variant="green" padding={3}>
          <pre className="expected">{step.expected.text}</pre>
        </Card>
      </section>

      {step.expected.screens?.length ? (
        <section className="detail-section">
          <Text type="label">Layar target</Text>
          <Thumbs ids={step.expected.screens} onOpen={onShot} />
        </section>
      ) : null}

      {step.bukti ? (
        <Card variant="yellow" padding={3}>
          <p className="bukti">
            <strong>Bukti selesai: </strong>
            {step.bukti}
          </p>
        </Card>
      ) : null}

      <div className="detail-actions">
        <HStack gap={1.5} align="center" wrap="wrap">
          <Button
            label={isDone ? "Batalkan centang" : "Tandai selesai"}
            icon={isDone ? undefined : <Check />}
            variant={isDone ? "secondary" : "primary"}
            isDisabled={!canToggle}
            tooltip={!canToggle ? "Selesaikan langkah sebelumnya dulu." : undefined}
            onClick={onToggle}
          />
          {isDone ? (
            <HStack gap={0.5} align="center">
              <Check size={14} />
              <Text type="supporting">Langkah ini selesai</Text>
            </HStack>
          ) : (
            <Text type="supporting">{canToggle ? "Belum selesai" : "Terkunci oleh langkah sebelumnya"}</Text>
          )}
        </HStack>
        <div className="detail-nav">
          <HStack gap={1} align="center" justify="between" wrap="wrap">
            <Button
              label="Langkah sebelumnya"
              icon={<ArrowLeft />}
              variant="ghost"
              size="sm"
              isDisabled={!onPrev}
              onClick={onPrev}
            />
            <Text type="supporting">
              Langkah {position.index} dari {position.total}
            </Text>
            <Button
              label={position.index === position.total ? "Langkah terakhir" : "Langkah berikutnya"}
              icon={<ArrowRight />}
              variant="secondary"
              size="sm"
              isDisabled={!canGoNext}
              tooltip={
                !canGoNext && position.index < position.total ? "Tandai langkah ini selesai dulu." : undefined
              }
              onClick={onNext}
            />
          </HStack>
        </div>
      </div>
    </VStack>
  );
}

/* ---------- dialog screenshot ---------- */

function ShotDialog({ shots, index, onClose, onStep }) {
  const ref = useRef(null);
  const id = shots?.[index];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (shots && !el.open) el.showModal();
    if (!shots && el.open) el.close();
  }, [shots]);

  return (
    <dialog ref={ref} className="dlg dlg-shot" onClose={onClose} aria-label="Layar target">
      {id ? (
        <div className="shot-wrap">
          <div className="shot-bar">
            <Heading level={2}>
              {screenNo(id)} · {screenTitle(id)}
            </Heading>
            <HStack gap={1} align="center">
              <Button
                label="Target sebelumnya"
                icon={<ArrowLeft />}
                variant="ghost"
                size="sm"
                isIconOnly
                tooltip="Target sebelumnya"
                onClick={() => onStep(-1)}
              />
              <Text type="supporting">
                {index + 1} / {shots.length}
              </Text>
              <Button
                label="Target berikutnya"
                icon={<ArrowRight />}
                variant="ghost"
                size="sm"
                isIconOnly
                tooltip="Target berikutnya"
                onClick={() => onStep(1)}
              />
              <Button
                label="Tutup"
                icon={<X />}
                variant="ghost"
                size="sm"
                isIconOnly
                tooltip="Tutup"
                onClick={onClose}
              />
            </HStack>
          </div>
          <img
            className="shot-img"
            src={`/assets/screens/${id}.svg`}
            alt={`Layar target ${screenNo(id)}: ${screenTitle(id)}`}
            width="960"
            height="600"
          />
          <p className="muted">
            Contoh keluaran yang harus kamu capai. Panah kiri/kanan untuk pindah, Esc untuk menutup.
          </p>
        </div>
      ) : null}
    </dialog>
  );
}

/* ---------- dialog reset ---------- */

function ResetDialog({ member, onCancel, onConfirm }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (member && !el.open) el.showModal();
    if (!member && el.open) el.close();
  }, [member]);

  return (
    <dialog ref={ref} className="dlg" onClose={onCancel} aria-label="Reset progres">
      {member ? (
        <div className="dlg-body">
          <Heading level={2}>Reset progres {member.code}?</Heading>
          <Text type="supporting">
            Semua centang langkah peserta ini dihapus dari browser. Berkas di repo tidak berubah.
          </Text>
          <HStack gap={1} justify="end">
            <Button label="Batal" variant="ghost" onClick={onCancel} />
            <Button label="Hapus centang" variant="primary" onClick={onConfirm} />
          </HStack>
        </div>
      ) : null}
    </dialog>
  );
}

/* ---------- app ---------- */

export default function App() {
  const [store, setStore] = useState(readStore);
  const [view, setView] = useState("picker");
  const [memberCode, setMemberCode] = useState(null);
  const [stepId, setStepId] = useState(null);
  const [resetAsk, setResetAsk] = useState(null);
  const [shot, setShot] = useState(null);
  const [copied, setCopied] = useState(false);
  const [drawer, setDrawer] = useState(null);
  const detailRef = useRef(null);
  const drawerRef = useRef(null);

  const member = useMemo(
    () => JOURNEY.members.find((item) => item.code === memberCode) ?? null,
    [memberCode],
  );

  const doneOf = useCallback(
    (code) => new Set(Array.isArray(store.done[code]) ? store.done[code] : []),
    [store],
  );

  const progressOf = useCallback(
    (target) => {
      const total = allSteps(target).length;
      const done = doneOf(target.code).size;
      return { total, done, pct: total ? Math.round((done / total) * 100) : 0 };
    },
    [doneOf],
  );

  const steps = useMemo(() => (member ? allSteps(member) : []), [member]);

  const unlockedIds = useMemo(() => {
    if (!member) return new Set();
    const done = doneOf(member.code);
    const ids = new Set();
    let open = true;
    for (const step of steps) {
      if (open) ids.add(step.id);
      if (!done.has(step.id)) open = false;
    }
    return ids;
  }, [doneOf, member, steps]);

  const save = useCallback((next) => {
    setStore(next);
    writeStore(next);
  }, []);

  const reducedMotion = useCallback(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  const transition = useCallback(
    (apply) => {
      if (typeof document.startViewTransition === "function" && !reducedMotion()) {
        document.startViewTransition(apply);
      } else {
        apply();
      }
    },
    [reducedMotion],
  );

  const goToPicker = useCallback(
    () =>
      transition(() => {
        setView("picker");
        setMemberCode(null);
        setDrawer(null);
        setShot(null);
      }),
    [transition],
  );

  const themeMeta = THEME_META[store.theme];
  const themeAction = store.theme === "light" ? "Ganti ke tema gelap" : "Ganti ke tema terang";

  const cycleTheme = useCallback(() => {
    const order = ["light", "dark"];
    const next = order[(order.indexOf(store.theme) + 1) % order.length];
    const apply = () => {
      flushSync(() => save({ ...store, theme: next }));
    };
    if (typeof document.startViewTransition === "function" && !reducedMotion())
      document.startViewTransition(apply);
    else apply();
  }, [save, store, reducedMotion]);

  const enter = useCallback(
    (target) =>
      transition(() => {
        setMemberCode(target.code);
        setView("journey");
        setStepId(null);
        setCopied(false);
        setDrawer(null);
      }),
    [transition],
  );

  const active = member && stepId ? findStep(member, stepId) : null;
  const activeIndex = active ? steps.findIndex((item) => item.id === active.step.id) : -1;
  const activeDone = active ? doneOf(member.code).has(active.step.id) : false;
  const prevStep = activeIndex > 0 ? steps[activeIndex - 1] : null;
  const nextStep = activeIndex >= 0 && activeIndex < steps.length - 1 ? steps[activeIndex + 1] : null;
  const canToggle = active ? activeDone || unlockedIds.has(active.step.id) : false;
  const canGoNext = Boolean(nextStep) && activeDone && unlockedIds.has(active.step.id);

  useEffect(() => {
    if (!stepId) return;
    detailRef.current?.scrollTo({ top: 0, behavior: reducedMotion() ? "auto" : "smooth" });
  }, [reducedMotion, stepId]);

  useEffect(() => {
    if (!member) return;
    if (!stepId || !findStep(member, stepId)) {
      const list = allSteps(member);
      const next = list.find((item) => !doneOf(member.code).has(item.id)) ?? list[0];
      setStepId(next.id);
    }
  }, [member, stepId, doneOf]);

  useEffect(() => {
    const el = drawerRef.current;
    if (!el) return;
    if (drawer && !el.open) el.showModal();
    if (!drawer && el.open) el.close();
  }, [drawer]);

  const closeDrawer = useCallback(() => {
    drawerRef.current?.close();
  }, []);

  const selectStep = useCallback((id) => {
    setStepId(id);
    setCopied(false);
    setDrawer(null);
  }, []);

  const toggle = useCallback(
    (id) => {
      if (!member) return;
      const set = doneOf(member.code);
      const index = steps.findIndex((item) => item.id === id);
      if (!set.has(id) && index > 0 && !steps.slice(0, index).every((item) => set.has(item.id))) return;
      if (set.has(id)) set.delete(id);
      else set.add(id);
      save({ ...store, done: { ...store.done, [member.code]: [...set] } });
      if (set.has(id) && index > -1 && index < steps.length - 1) setStepId(steps[index + 1].id);
    },
    [doneOf, member, save, steps, store],
  );

  const progress = member ? progressOf(member) : null;

  useEffect(() => {
    const onKey = (event) => {
      if (document.querySelector("dialog[open]")) return;
      const tag = (event.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      if (view === "journey") {
        if (event.key === "Escape") goToPicker();
        return;
      }
      const index = Number(event.key) - 1;
      if (Number.isInteger(index) && index >= 0 && index < JOURNEY.members.length) {
        enter(JOURNEY.members[index]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enter, goToPicker, view]);

  return (
    <Theme theme={themes[defaultThemeSlug]} mode={store.theme}>
      <div className="page">
        <header className="topbar">
          <div className="topbar-inner">
            <div className="brand">
              <span className="brand-mark" aria-hidden="true">
                KP
              </span>
              <VStack gap={0}>
                <Text type="body" weight="bold">
                  Klinik Pratama
                </Text>
                <Text type="supporting">Tutor SQL tim</Text>
              </VStack>
            </div>

            <div className="topbar-progress">
              {member && progress ? (
                <ProgressBar
                  label={`Progres ${member.code}`}
                  value={progress.done}
                  max={progress.total}
                  hasValueLabel
                  formatValueLabel={(value, max) => `${value}/${max} langkah`}
                />
              ) : null}
            </div>

            <div className="topbar-actions">
              {member ? (
                <HStack gap={0.5} align="center">
                  <Button label="Pilih peserta" variant="ghost" size="sm" onClick={goToPicker} />
                  <Button
                    label="Reset progres"
                    variant="ghost"
                    size="sm"
                    onClick={() => setResetAsk(member)}
                  />
                </HStack>
              ) : null}
              <Button
                className="topbar-theme"
                label={themeAction}
                tooltip={themeAction}
                icon={themeMeta.icon}
                variant="ghost"
                size="sm"
                isIconOnly
                onClick={cycleTheme}
              />
            </div>
          </div>
        </header>

        <main className="main">
          {view === "picker" || !member || !progress ? (
            <div className="picker">
              <VStack gap={4}>
                <div className="hero">
                  <VStack gap={1}>
                    <Text type="label">Panduan kerja tim · UAS Konsep Basis Data</Text>
                    <Heading level={1} type="display-1">
                      Pilih peserta, ikuti journey, cocokkan hasil SQL.
                    </Heading>
                    <p className="hero-sub">
                      Lima peserta, satu basis data klinik. Setiap kartu memuat langkah dari membaca panduan,
                      menulis modul SQL, menjalankan perintah, sampai expected result yang bisa ditunjukkan
                      saat demo.
                    </p>
                  </VStack>
                </div>

                <div className="overview">
                  <Card padding={3} elevation="low">
                    <VStack gap={1.5}>
                      <Heading level={2}>Alur fase proyek</Heading>
                      <p className="muted">
                        F0 fondasi dikerjakan semua peserta, lalu modul paralel per berkas, uji integrasi, dan
                        rilis laporan.
                      </p>
                      <div className="phase-strip">
                        {["F0 fondasi", "F1 skema", "F2 data", "F3 objek", "F4 uji", "F5 rilis"].map(
                          (label) => (
                            <span className="phase-chip" key={label}>
                              {label}
                            </span>
                          ),
                        )}
                      </div>
                    </VStack>
                  </Card>
                  <Card padding={3} elevation="low">
                    <VStack gap={1.5}>
                      <Heading level={2}>Progres peserta</Heading>
                      <p className="muted">
                        Angka diambil dari centang langkah yang tersimpan di browser ini.
                      </p>
                      <ul className="progress-list">
                        {JOURNEY.members.map((item) => {
                          const p = progressOf(item);
                          return (
                            <li key={item.code}>
                              <span className="progress-code">{item.code}</span>
                              <ProgressBar
                                label={`Progres ${item.code}`}
                                value={p.pct}
                                max={100}
                                isLabelHidden
                                hasValueLabel
                                formatValueLabel={(value) => `${value}%`}
                              />
                            </li>
                          );
                        })}
                      </ul>
                    </VStack>
                  </Card>
                </div>

                <div className="member-grid">
                  {JOURNEY.members.map((item) => (
                    <MemberCard
                      key={item.code}
                      member={item}
                      progress={progressOf(item)}
                      onPick={() => enter(item)}
                    />
                  ))}
                </div>
                <p className="muted">
                  Tip: tekan <kbd>1</kbd>–<kbd>5</kbd> untuk memilih peserta.
                </p>
              </VStack>
            </div>
          ) : (
            <div className="journey">
              <VStack gap={3}>
                <div className="journey-head">
                  <HStack gap={2} align="center" justify="between" wrap="wrap">
                    <HStack gap={2} align="center">
                      <Button
                        label="Pilih peserta"
                        icon={<ArrowLeft />}
                        variant="ghost"
                        onClick={goToPicker}
                      />
                      <VStack gap={0}>
                        <Heading level={1}>
                          {member.code} · {member.role}
                        </Heading>
                        <Text type="supporting">
                          {progress.done} dari {progress.total} langkah selesai
                        </Text>
                      </VStack>
                    </HStack>
                    <div className="journey-score">
                      <Text type="label">Progres journey</Text>
                      <span className="score-value">{progress.pct}%</span>
                      <ProgressBar
                        label="Progres journey peserta"
                        value={progress.pct}
                        max={100}
                        isLabelHidden
                      />
                    </div>
                  </HStack>
                  <div className="drawer-trigger">
                    <Button
                      label="Langkah"
                      variant="secondary"
                      size="sm"
                      onClick={() => setDrawer("steps")}
                    />
                    <Button label="Info" variant="secondary" size="sm" onClick={() => setDrawer("context")} />
                  </div>
                </div>

                <div className="journey-layout">
                  <div className="timeline">
                    <TimelinePanel
                      member={member}
                      stepId={stepId}
                      doneOf={doneOf}
                      unlockedIds={unlockedIds}
                      onSelect={selectStep}
                    />
                  </div>

                  <div className="detail" id="detail" ref={detailRef}>
                    <Card padding={3} elevation="low">
                      {active ? (
                        <Detail
                          member={member}
                          phase={active.phase}
                          step={active.step}
                          isDone={activeDone}
                          canToggle={canToggle}
                          canGoNext={canGoNext}
                          position={{ index: activeIndex + 1, total: steps.length }}
                          copied={copied}
                          onCopy={async (code) => {
                            try {
                              await navigator.clipboard.writeText(code);
                            } catch {
                              /* clipboard ditolak; tombol tetap memberi umpan balik */
                            }
                            setCopied(true);
                            setTimeout(() => setCopied(false), 1600);
                          }}
                          onToggle={() => toggle(active.step.id)}
                          onPrev={prevStep ? () => selectStep(prevStep.id) : undefined}
                          onNext={nextStep ? () => selectStep(nextStep.id) : undefined}
                          onShot={(ids, index) => setShot({ ids, index })}
                        />
                      ) : null}
                    </Card>
                  </div>

                  <div className="context">
                    <ContextPanel member={member} onShot={(ids, index) => setShot({ ids, index })} />
                  </div>
                </div>

                {drawer ? (
                  <dialog
                    ref={drawerRef}
                    className="drawer"
                    aria-label={drawer === "steps" ? "Daftar langkah" : "Konteks peserta"}
                    onClose={() => setDrawer(null)}
                    onClick={(event) => {
                      if (event.target === event.currentTarget) closeDrawer();
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Escape") closeDrawer();
                    }}
                  >
                    <div className="drawer-head">
                      <Text type="label">{drawer === "steps" ? "Daftar langkah" : "Konteks peserta"}</Text>
                      <Button
                        label="Tutup"
                        icon={<X />}
                        variant="ghost"
                        size="sm"
                        isIconOnly
                        onClick={closeDrawer}
                      />
                    </div>
                    <div className="drawer-body">
                      {drawer === "steps" ? (
                        <TimelinePanel
                          member={member}
                          stepId={stepId}
                          doneOf={doneOf}
                          unlockedIds={unlockedIds}
                          onSelect={selectStep}
                        />
                      ) : (
                        <ContextPanel member={member} onShot={(ids, index) => setShot({ ids, index })} />
                      )}
                    </div>
                  </dialog>
                ) : null}
              </VStack>
            </div>
          )}
        </main>

        <ResetDialog
          member={resetAsk}
          onCancel={() => setResetAsk(null)}
          onConfirm={() => {
            if (!resetAsk) return;
            save({ ...store, done: { ...store.done, [resetAsk.code]: [] } });
            setResetAsk(null);
          }}
        />
        <ShotDialog
          shots={shot?.ids}
          index={shot?.index ?? 0}
          onClose={() => setShot(null)}
          onStep={(delta) => {
            setShot((current) => {
              if (!current) return current;
              const next = (current.index + delta + current.ids.length) % current.ids.length;
              return { ...current, index: next };
            });
          }}
        />
      </div>
    </Theme>
  );
}
