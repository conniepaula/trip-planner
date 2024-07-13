import { cn } from "@/lib/utils";
import React, { ComponentProps, ComponentType, forwardRef } from "react";

interface TripInputProps extends ComponentProps<"input"> {
  icon?: ComponentType<{ className?: string }>;
  containerClassName?: string;
}

const TripInput = forwardRef<HTMLInputElement, TripInputProps>((props, ref) => {
  const { icon: Icon, containerClassName, className, ...rest } = props;
  return (
    <div className={cn("flex items-center gap-2", containerClassName)}>
      {Icon && <Icon className="size-5 text-zinc-400" />}
      <input
        ref={ref}
        className={cn(
          "bg-transparent text-lg placeholder-zinc-400 outline-none",
          className,
        )}
        {...rest}
      />
    </div>
  );
});

TripInput.displayName = "Input";

export default TripInput;
