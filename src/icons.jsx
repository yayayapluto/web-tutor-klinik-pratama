/* Ikon garis tipis untuk kontrol tutor. Dipakai hanya sebagai penanda
   arah atau status, bukan dekorasi. */

const base = {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

export function ArrowLeft({ size = 16 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

export function ArrowRight({ size = 16 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function ArrowUpRight({ size = 14 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M7 17 17 7" />
      <path d="M9 7h8v8" />
    </svg>
  );
}

export function Check({ size = 14 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="m4 12 5 5 11-11" />
    </svg>
  );
}

export function Sun({ size = 16 }) {
  return (
    <svg {...base} width={size} height={size}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function Moon({ size = 16 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
    </svg>
  );
}

export function X({ size = 16 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function Copy({ size = 14 }) {
  return (
    <svg {...base} width={size} height={size}>
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h9" />
    </svg>
  );
}
