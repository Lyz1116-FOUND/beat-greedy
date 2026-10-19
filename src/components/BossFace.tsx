import type { Boss } from "../game/types";

interface BossFaceProps {
  boss: Boss;
  className?: string;
  zoomed?: boolean;
  alt?: string;
}

export function BossFace({
  boss,
  className = "",
  zoomed = false,
  alt,
}: BossFaceProps) {
  if (boss.image) {
    return (
      <img
        src={boss.image}
        alt={alt ?? `${boss.name}的立绘`}
        className={`${className} object-cover ${
          zoomed ? "origin-[50%_14%] scale-[1.7] object-top" : "object-center"
        }`}
      />
    );
  }

  return (
    <div
      className={`${className} flex items-center justify-center bg-night`}
      style={{
        backgroundImage: `radial-gradient(circle at 50% 40%, ${boss.accent}40, transparent 65%)`,
      }}
    >
      <span className="text-5xl" aria-hidden="true">
        {boss.emoji}
      </span>
    </div>
  );
}
