import { cn } from "@/lib/cn";

type ContainerProps = React.ComponentProps<"div"> & {
  /** Narrower max width for text-heavy sections. */
  width?: "default" | "narrow" | "wide";
};

const widths = {
  narrow: "max-w-3xl",
  default: "max-w-[1280px]",
  wide: "max-w-[1600px]",
} as const;

export function Container({ width = "default", className, ...props }: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full px-6 md:px-10", widths[width], className)} {...props} />
  );
}
