import * as React from "react";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={twMerge(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        // Variants
        variant === "default" && "border-transparent bg-primary text-primary-foreground shadow",
        variant === "secondary" && "border-transparent bg-secondary text-secondary-foreground",
        variant === "destructive" && "border-transparent bg-destructive/10 text-destructive border border-destructive/20",
        variant === "outline" && "text-foreground border-border",
        variant === "success" && "border-transparent bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
        variant === "warning" && "border-transparent bg-amber-500/10 text-amber-500 border border-amber-500/20",
        variant === "info" && "border-transparent bg-blue-500/10 text-blue-500 border border-blue-500/20",
        className
      )}
      {...props}
    />
  );
}

export { Badge };
