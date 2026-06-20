import { cn } from "@/lib/cn";

type PlaceholderProps = {
  /** CSS aspect-ratio value, e.g. "3/4", "4/5", "16/9", "1/1" */
  aspect?: string;
  label?: string;
  className?: string;
};

/**
 * Tonal placeholder block standing in for future photographs.
 * Uses an inline style for aspect-ratio, since dynamic Tailwind classes aren't reliable.
 */
export function Placeholder({ aspect = "3/4", label, className }: PlaceholderProps) {
  return (
    <div
      className={cn(
        "from-surface to-surface-raised relative w-full overflow-hidden bg-gradient-to-br",
        className,
      )}
      style={{ aspectRatio: aspect }}
      aria-hidden="true"
    >
      {label && (
        <span className="text-faint absolute inset-0 flex items-center justify-center text-xs tracking-widest uppercase">
          {label}
        </span>
      )}
    </div>
  );
}
