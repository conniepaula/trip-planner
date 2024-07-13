import { cn } from "@/lib/utils";
import React, { ComponentProps, ComponentType, forwardRef } from "react";

interface InputProps extends ComponentProps<"input"> {
  icon?: ComponentType<{ className?: string }>;
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { icon: Icon, className, ...rest } = props;
  return (
    <div className="flex h-14 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4">
      {Icon && <Icon className="size-5 text-zinc-400" />}
      <input
        ref={ref}
        className={cn(
          "flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none",
          className,
        )}
        {...rest}
      />
    </div>
  );
});

Input.displayName = "Input";

export default Input;
