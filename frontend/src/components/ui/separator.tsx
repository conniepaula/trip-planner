import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

export const separatorVariants = cva("bg-zinc-800", {
  variants: {
    direction: {
      horizontal: "h-px",
      vertical: "w-px",
    },
  },
  defaultVariants: {
    direction: "horizontal",
  },
});

export interface SeparatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof separatorVariants> {
  asChild?: boolean;
}
export default function Separator(props: SeparatorProps) {
  const { direction, className, ...rest } = props;
  return (
    <div
      className={cn(separatorVariants({ direction, className }))}
      {...rest}
    />
  );
}
