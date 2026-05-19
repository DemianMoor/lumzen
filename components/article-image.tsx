/**
 * MANDATORY wrapper for article hero images.
 *
 * Why mandatory: ensures consistent alt-text fallback, aspect ratio, and
 * caption rendering across the public site and admin previews.
 *
 * If a hero image is missing, renders a gradient placeholder using the
 * pillar accent rather than a broken <img>.
 */
export function ArticleImage({
  src,
  alt,
  credit,
  accent = "#c4a35a",
  className = "",
}: {
  src: string | null | undefined;
  alt: string | null | undefined;
  credit?: string | null;
  accent?: string;
  className?: string;
}) {
  const wrapperClass = `relative aspect-[16/9] w-full overflow-hidden rounded-2xl border ${className}`.trim();

  if (!src) {
    return (
      <div
        className={wrapperClass}
        style={{
          background: `linear-gradient(135deg, ${accent}33 0%, ${accent}11 100%)`,
          borderColor: `${accent}33`,
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[32px] leading-none" style={{ color: accent }}>
            ✦
          </span>
        </div>
      </div>
    );
  }

  return (
    <figure
      className={wrapperClass}
      style={{ borderColor: `${accent}33` }}
    >
      <img
        src={src}
        alt={alt || ""}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {credit && (
        <figcaption className="absolute bottom-0 right-0 bg-[rgba(6,6,15,0.7)] px-2 py-1 text-[10px] font-mono text-[#8f8daa]">
          {credit}
        </figcaption>
      )}
    </figure>
  );
}
