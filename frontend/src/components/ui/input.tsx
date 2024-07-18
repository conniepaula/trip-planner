import { cn } from "@/lib/utils";
import React, { ComponentProps, ComponentType, forwardRef } from "react";

interface InputProps extends ComponentProps<"input"> {
  icon?: ComponentType<{ className?: string }>;
  id: string;
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { icon: Icon, className, id, label, error, ...rest } = props;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="ml-1 text-left font-medium">
        {label}
      </label>
      <div className="flex h-14 items-center gap-2 rounded-lg border border-muted bg-background px-4">
        {Icon && <Icon className="size-5 text-zinc-400" />}
        <input
          ref={ref}
          id={id}
          className={cn(
            "flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none",
            className,
          )}
          {...rest}
        />
      </div>
      {error && <span className="ml-1 text-left text-red-500">{error}</span>}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
