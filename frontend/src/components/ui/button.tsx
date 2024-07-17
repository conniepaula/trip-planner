import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium hover:transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: " bg-primary text-primary-foreground hover:bg-primary-hover",
        neutral: "bg-muted text-zinc-200 hover:bg-muted-hover",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive-hover",
        outline:
          "border border-input bg-zinc-500 shadow-sm hover:bg-muted hover:text-muted-foreground",
        ghost: "hover:bg-zinc-600 hover:text-foreground",
      },
      size: {
        default: "px-5 py-2",
        full: "h-11 px-5 w-full",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export default function Button(props: ButtonProps) {
  const { className, variant, size, children, ...rest } = props;
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...rest}
    >
      {children}
    </button>
  );
}
