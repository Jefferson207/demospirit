import Image from "next/image";

export function BrandLogo({ compact = false, inverse = false }: { compact?: boolean; inverse?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Image
        src="/logo-spirit-qosqo.png"
        alt="Spirit Qosqo Travel"
        width={compact ? 58 : 86}
        height={compact ? 58 : 86}
        priority
        className="object-contain"
      />
      {!compact && (
        <div className="leading-none">
          <p className={inverse ? "font-display text-xl font-bold tracking-wide text-white" : "font-display text-xl font-bold tracking-wide text-obsidian"}>
            Spirit Qosqo
          </p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.28em] text-emerald">Travel</p>
        </div>
      )}
    </div>
  );
}
