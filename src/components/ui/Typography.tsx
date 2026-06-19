import { cn } from "@/lib/cn";

/* Eyebrow — small uppercase label above headings */
type EyebrowProps = React.ComponentProps<"p">;

export function Eyebrow({ className, ...props }: EyebrowProps) {
  return (
    <p
      className={cn("text-accent text-sm font-medium tracking-[0.2em] uppercase", className)}
      {...props}
    />
  );
}

/* Heading — serif display headings */
type HeadingLevel = "h1" | "h2" | "h3" | "h4";

type HeadingProps = React.ComponentProps<"h2"> & {
  as?: HeadingLevel;
  size?: keyof typeof headingSizes;
};

const headingSizes = {
  display: "text-display",
  xl: "text-4xl md:text-5xl",
  lg: "text-3xl md:text-4xl",
  md: "text-2xl md:text-3xl",
  sm: "text-xl md:text-2xl",
} as const;

export function Heading({ as = "h2", size = "lg", className, ...props }: HeadingProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        "font-serif font-semibold tracking-tight text-balance",
        headingSizes[size],
        className,
      )}
      {...props}
    />
  );
}

/* Text — body copy */
type TextProps = React.ComponentProps<"p"> & {
  size?: keyof typeof textSizes;
  tone?: "default" | "muted";
};

const textSizes = {
  lg: "text-lg md:text-xl",
  md: "text-base md:text-lg",
  sm: "text-sm",
} as const;

export function Text({ size = "md", tone = "default", className, ...props }: TextProps) {
  return (
    <p
      className={cn(
        "leading-relaxed text-pretty",
        textSizes[size],
        tone === "muted" && "text-muted",
        className,
      )}
      {...props}
    />
  );
}
