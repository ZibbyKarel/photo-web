import { cn } from "@/lib/cn";

type SectionProps = React.ComponentProps<"section"> & {
  /** Vertical rhythm. */
  spacing?: "default" | "compact" | "large";
};

const spacings = {
  compact: "py-14 md:py-20",
  default: "py-20 md:py-28",
  large: "py-28 md:py-40",
} as const;

export function Section({ spacing = "default", className, ...props }: SectionProps) {
  return <section className={cn(spacings[spacing], className)} {...props} />;
}
