import Link from "next/link";

type BrandMarkProps = {
  href?: string;
  compact?: boolean;
};

export function BrandMark({ href = "/", compact = false }: BrandMarkProps) {
  return (
    <Link href={href} className="brand" aria-label="GridPost AI home">
      <span className="brand-mark" aria-hidden="true">
        <span>G</span>
      </span>
      {!compact && (
        <span>
          GridPost AI
          <span className="brand-subtitle">by GridSpell Studio</span>
        </span>
      )}
    </Link>
  );
}
