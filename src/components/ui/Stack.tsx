import { cn } from "@/lib/cn";

type StackProps = React.ComponentProps<"div"> & {
  gap?: keyof typeof gaps;
  align?: "start" | "center" | "end";
};

const gaps = {
  xs: "gap-2",
  sm: "gap-3",
  md: "gap-5",
  lg: "gap-8",
  xl: "gap-12",
} as const;

const aligns = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
} as const;

/** Vertical flex column with a consistent gap scale. */
export function Stack({ gap = "md", align = "start", className, ...props }: StackProps) {
  return <div className={cn("flex flex-col", gaps[gap], aligns[align], className)} {...props} />;
}
