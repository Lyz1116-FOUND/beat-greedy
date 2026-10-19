interface SoundToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label={enabled ? "关闭声音" : "打开声音"}
      title={enabled ? "关掉声音" : "打开声音"}
      className="flex items-center gap-1.5 rounded-full border border-ink/25 bg-cream/70 px-2.5 py-1.5 text-[11px] text-ink-soft transition-colors hover:border-ink/50 hover:bg-cream"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
        aria-hidden="true"
      >
        <path d="M4 9v6h4l5 4V5L8 9H4Z" />
        {enabled ? (
          <>
            <path d="M16 9.2a4 4 0 0 1 0 5.6" />
            <path d="M18.5 6.7a7.5 7.5 0 0 1 0 10.6" />
          </>
        ) : (
          <path d="M17 9.5l5 5M22 9.5l-5 5" />
        )}
      </svg>
      <span className="hidden sm:inline">{enabled ? "有声" : "静音"}</span>
    </button>
  );
}
