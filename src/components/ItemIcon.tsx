import type { ReactNode } from "react";
import type { ItemIconKey } from "../game/types";

const ICONS: Record<ItemIconKey, ReactNode> = {
  "spicy-strip": (
    <g transform="rotate(-6 32 34)">
      <path
        d="M16 19h32v28a5 5 0 0 1-5 5H21a5 5 0 0 1-5-5V19Z"
        fill="var(--color-cream)"
      />
      <path d="M16 19l4-5 4 5 4-5 4 5 4-5 4 5 4-5 4 5" />
      <path d="M23 30c3 2 5-2 8 0s5-2 8 0" opacity=".55" />
      <path d="M23 37c3 2 5-2 8 0s5-2 8 0" opacity=".55" />
      <path
        d="M35 46c2-6 7-6 8-11"
        stroke="var(--color-vermilion)"
        strokeWidth="3.2"
      />
      <path
        d="M43 35c2-1 4 1 4 3"
        stroke="var(--color-vermilion)"
        strokeWidth="3.2"
      />
    </g>
  ),
  "ice-pop": (
    <g>
      <path d="M32 42v13" />
      <rect
        x="22"
        y="9"
        width="20"
        height="34"
        rx="8"
        fill="var(--color-cream)"
      />
      <path
        d="M22 17a8 8 0 0 1 8-8h4a8 8 0 0 1 8 8v8H22Z"
        fill="var(--color-mustard)"
        fillOpacity=".5"
        stroke="none"
      />
      <path d="M22 25h20" />
      <path d="M26 15h3" opacity=".55" />
      <path d="M25 33h5" opacity=".35" />
    </g>
  ),
  soda: (
    <g>
      <path
        d="M27 8h10v5l3 4v31a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6V17l3-4V8Z"
        fill="var(--color-cream)"
      />
      <path
        d="M24 27h16v21a5 5 0 0 1-5 5h-6a5 5 0 0 1-5-5V27Z"
        fill="var(--color-vermilion)"
        fillOpacity=".16"
        stroke="none"
      />
      <path d="M27 13h10M22 27h20" />
      <path d="M26 34c3 2 5-2 8 0s4-1 5 0" opacity=".6" />
      <circle cx="37" cy="21" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="32" cy="18" r="1" fill="currentColor" stroke="none" />
    </g>
  ),
  noodle: (
    <g transform="rotate(-4 32 32)">
      <rect
        x="15"
        y="16"
        width="34"
        height="34"
        rx="4"
        fill="var(--color-cream)"
      />
      <path d="M15 24h34" opacity=".55" />
      <path d="M21 32c4-3 5 3 9 0s5 3 9 0s4-2 5 0" />
      <path d="M21 39c4-3 5 3 9 0s5 3 9 0s4-2 5 0" />
      <circle
        cx="40"
        cy="44"
        r="2.5"
        fill="var(--color-vermilion)"
        stroke="none"
      />
      <path d="M23 20h10" opacity=".35" />
    </g>
  ),
  egg: (
    <g>
      <ellipse cx="32" cy="35" rx="15" ry="18" fill="var(--color-cream)" />
      <path d="M19 30l5 2 4-5 4 5 4-5 4 5 5-2" />
      <path d="M24 20c3-5 9-8 14-6" opacity=".35" />
      <path d="M25 41c2 4 4 6 7 7" opacity=".3" />
      <circle
        cx="32"
        cy="35"
        r="13"
        fill="var(--color-mustard)"
        fillOpacity=".14"
        stroke="none"
      />
    </g>
  ),
  sausage: (
    <g transform="rotate(22 32 32)">
      <path d="M32 4v56" />
      <rect
        x="24"
        y="11"
        width="16"
        height="37"
        rx="8"
        fill="var(--color-mustard)"
        fillOpacity=".45"
      />
      <path d="M24 21l-4-2M40 21l4-2M24 30l-4-2M40 30l4-2M25 39l-3-2" opacity=".55" />
      <path d="M29 17c1 2 5 2 6 0" opacity=".45" />
    </g>
  ),
  candy: (
    <g>
      <rect
        x="24"
        y="23"
        width="16"
        height="18"
        rx="7"
        fill="var(--color-cream)"
      />
      <path d="M24 27l-10-6v22l10-6M40 27l10-6v22l-10-6" fill="var(--color-cream)" />
      <path d="M28 30c2 2 6 2 8 0" opacity=".55" />
      <path
        d="M29 23v18"
        stroke="var(--color-mustard)"
        strokeWidth="3"
        opacity=".55"
      />
      <path d="M16 22l4 3M48 22l-4 3" opacity=".4" />
    </g>
  ),
  coin: (
    <g>
      <circle
        cx="32"
        cy="32"
        r="17"
        fill="var(--color-mustard)"
        fillOpacity=".3"
      />
      <circle cx="32" cy="32" r="17" />
      <circle cx="32" cy="32" r="12.5" strokeDasharray="2 4" opacity=".55" />
      <path d="M27 24l5 7 5-7M32 31v10M28 34h8M28 38h8" />
    </g>
  ),
  tanghulu: (
    <g>
      <path d="M32 25v33" />
      <circle cx="32" cy="15" r="7" fill="var(--color-vermilion)" fillOpacity=".22" />
      <circle cx="32" cy="31" r="7" fill="var(--color-vermilion)" fillOpacity=".22" />
      <circle cx="32" cy="47" r="7" fill="var(--color-vermilion)" fillOpacity=".22" />
      <path d="M29 13a3 3 0 0 1 2-2M29 29a3 3 0 0 1 2-2M29 45a3 3 0 0 1 2-2" opacity=".5" />
    </g>
  ),
  "sweet-potato": (
    <g>
      <path
        d="M17 41c-5-9 5-20 16-21 10-1 18 6 16 14-2 8-11 11-18 12-6 1-10 0-14-5Z"
        fill="var(--color-vermilion)"
        fillOpacity=".16"
      />
      <path d="M26 25c3 4 2 9 5 13" opacity=".4" />
      <path d="M43 14c2-2 1-5 0-6M49 18c2-1 2-4 1-5" opacity=".55" />
      <circle cx="38" cy="39" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="30" cy="42" r="1" fill="currentColor" stroke="none" />
    </g>
  ),
  watermelon: (
    <g>
      <path
        d="M10 38c0-12 10-22 22-22s22 10 22 22H10Z"
        fill="var(--color-jade)"
        fillOpacity=".18"
      />
      <path d="M10 38c0-12 10-22 22-22s22 10 22 22" />
      <path d="M16 38c0-9 7-16 16-16s16 7 16 16" opacity=".45" />
      <ellipse cx="26" cy="29" rx="1.2" ry="2" fill="currentColor" stroke="none" />
      <ellipse cx="36" cy="31" rx="1.2" ry="2" fill="currentColor" stroke="none" />
      <ellipse cx="31" cy="36" rx="1.2" ry="2" fill="currentColor" stroke="none" />
    </g>
  ),
  handheld: (
    <g>
      <rect
        x="17"
        y="9"
        width="30"
        height="46"
        rx="7"
        fill="var(--color-cream)"
      />
      <rect
        x="22"
        y="15"
        width="20"
        height="18"
        rx="3"
        fill="var(--color-jade)"
        fillOpacity=".2"
      />
      <path d="M27 24h10M27 28h7" opacity=".55" />
      <path d="M24 39h8M28 35v8" />
      <circle cx="40" cy="38" r="2.2" fill="var(--color-vermilion)" stroke="none" />
      <circle cx="44" cy="42" r="2.2" fill="var(--color-mustard)" stroke="none" />
      <path d="M26 49h12" opacity=".3" />
    </g>
  ),
  walkman: (
    <g>
      <path d="M20 21v-5a12 12 0 0 1 24 0v5" />
      <circle cx="20" cy="21" r="3" fill="var(--color-cream)" />
      <circle cx="44" cy="21" r="3" fill="var(--color-cream)" />
      <rect
        x="14"
        y="21"
        width="36"
        height="30"
        rx="6"
        fill="var(--color-cream)"
      />
      <rect
        x="20"
        y="27"
        width="24"
        height="17"
        rx="3"
        fill="var(--color-jade)"
        fillOpacity=".14"
      />
      <circle cx="26" cy="35" r="4" />
      <circle cx="38" cy="35" r="4" />
      <path d="M30 35l7-4v8Z" fill="currentColor" stroke="none" opacity=".65" />
      <path d="M24 49h16" opacity=".35" />
    </g>
  ),
  mug: (
    <g>
      <path
        d="M18 17h26v27a7 7 0 0 1-7 7H25a7 7 0 0 1-7-7V17Z"
        fill="var(--color-cream)"
      />
      <path d="M44 24h3a6 6 0 0 1 0 12h-3" />
      <path d="M18 25h26" opacity=".45" />
      <path
        d="M31 30l1.6 3.2 3.5.4-2.6 2.4.8 3.5-3.3-1.9-3.3 1.9.8-3.5-2.6-2.4 3.5-.4Z"
        fill="var(--color-vermilion)"
        stroke="none"
        opacity=".8"
      />
    </g>
  ),
  "tin-frog": (
    <g>
      <ellipse
        cx="32"
        cy="37"
        rx="17"
        ry="12"
        fill="var(--color-jade)"
        fillOpacity=".18"
      />
      <circle cx="24" cy="23" r="6" fill="var(--color-cream)" />
      <circle cx="40" cy="23" r="6" fill="var(--color-cream)" />
      <circle cx="24" cy="23" r="2" fill="currentColor" stroke="none" />
      <circle cx="40" cy="23" r="2" fill="currentColor" stroke="none" />
      <path d="M25 42c4 3 10 3 14 0" opacity=".55" />
      <path d="M23 47l-5 7M41 47l5 7M27 49l-2 7M37 49l2 7" />
      <circle cx="32" cy="14" r="3" />
      <path d="M32 17v5" opacity=".5" />
    </g>
  ),
  marbles: (
    <g>
      <circle
        cx="27"
        cy="28"
        r="14"
        fill="var(--color-mustard)"
        fillOpacity=".22"
      />
      <circle
        cx="43"
        cy="40"
        r="9"
        fill="var(--color-vermilion)"
        fillOpacity=".16"
      />
      <circle
        cx="18"
        cy="47"
        r="5"
        fill="var(--color-jade)"
        fillOpacity=".22"
      />
      <path d="M21 23a7 7 0 0 1 6-5M39 37a4 4 0 0 1 4-3" opacity=".5" />
    </g>
  ),
  comic: (
    <g>
      <rect
        x="16"
        y="12"
        width="32"
        height="40"
        rx="3"
        fill="var(--color-cream)"
      />
      <path d="M23 12v40" opacity=".45" />
      <path d="M29 22h13M29 29h13M29 36h9" opacity=".55" />
      <path d="M29 44l3-5 3 5" />
      <circle
        cx="43"
        cy="45"
        r="3"
        fill="var(--color-vermilion)"
        stroke="none"
        opacity=".75"
      />
    </g>
  ),
  thermos: (
    <g>
      <rect
        x="23"
        y="20"
        width="18"
        height="34"
        rx="6"
        fill="var(--color-cream)"
      />
      <rect
        x="26"
        y="10"
        width="12"
        height="10"
        rx="3"
        fill="var(--color-vermilion)"
        fillOpacity=".28"
      />
      <path d="M23 20h18M23 32h18" opacity=".4" />
      <path d="M41 27h3a5 5 0 0 1 0 10h-3" />
      <path d="M28 39h8" opacity=".3" />
    </g>
  ),
  stool: (
    <g>
      <rect
        x="12"
        y="22"
        width="40"
        height="8"
        rx="4"
        fill="var(--color-mustard)"
        fillOpacity=".38"
      />
      <path d="M18 30l-3 23M46 30l3 23M22 37h20M19 48h26" />
    </g>
  ),
  fan: (
    <g>
      <path
        d="M32 40L12 22c4-9 34-9 40 0L32 40Z"
        fill="var(--color-mustard)"
        fillOpacity=".24"
      />
      <path d="M32 40L12 22M32 40L24 13M32 40l8-27M32 40l20-18" opacity=".7" />
      <path d="M32 40v13M28 53c2 3 6 3 8 0" />
      <path d="M17 27c7-4 23-6 31-3" opacity=".35" />
    </g>
  ),
  watch: (
    <g>
      <path d="M25 20v-9h14v9M25 44v9h14v-9" />
      <rect
        x="20"
        y="20"
        width="24"
        height="24"
        rx="5"
        fill="var(--color-cream)"
      />
      <circle cx="32" cy="32" r="8" opacity=".35" />
      <path d="M32 26v7l5 3" />
      <path d="M48 30h3" opacity=".6" />
    </g>
  ),
  radio: (
    <g>
      <rect
        x="10"
        y="23"
        width="44"
        height="28"
        rx="4"
        fill="var(--color-cream)"
      />
      <circle cx="23" cy="37" r="7" opacity=".5" />
      <circle cx="23" cy="37" r="2" fill="currentColor" stroke="none" />
      <path d="M34 30h12M34 36h12M34 42h8" opacity=".55" />
      <path d="M36 23l12-12" />
      <circle
        cx="48"
        cy="45"
        r="2"
        fill="var(--color-vermilion)"
        stroke="none"
      />
    </g>
  ),
  gum: (
    <g>
      <circle cx="45" cy="19" r="7" />
      <circle cx="50" cy="30" r="4" />
      <rect
        x="20"
        y="25"
        width="22"
        height="21"
        rx="6"
        fill="var(--color-cream)"
        transform="rotate(-4 31 35)"
      />
      <path d="M20 31l-8-4v17l8-4M42 31l8-4v17l-8-4" />
      <path d="M27 34c2 2 5 2 7 0" opacity=".5" />
    </g>
  ),
  matches: (
    <g>
      <rect
        x="15"
        y="30"
        width="34"
        height="20"
        rx="2"
        fill="var(--color-cream)"
      />
      <path d="M15 37h34" opacity=".4" />
      <path d="M22 44h10" opacity=".35" />
      <path d="M24 30V15M32 30V11M40 30V17" />
      <circle cx="24" cy="14" r="2.6" fill="var(--color-vermilion)" stroke="none" />
      <circle cx="32" cy="10" r="2.6" fill="var(--color-vermilion)" stroke="none" />
      <circle cx="40" cy="16" r="2.6" fill="var(--color-vermilion)" stroke="none" />
      <path d="M45 41h8" opacity=".5" />
    </g>
  ),
};

export function ItemIcon({
  icon,
  className = "",
}: {
  icon: ItemIconKey;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={className}
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[icon]}
    </svg>
  );
}
