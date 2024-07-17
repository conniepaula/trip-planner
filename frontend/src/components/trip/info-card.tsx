import { cn } from "@/lib/utils";
import NextLink, { LinkProps } from "next/link";
import { ComponentProps } from "react";

export default function InfoCard(props: ComponentProps<"div">) {
  const { children } = props;
  return (
    <div className="flex items-center justify-between gap-4">{children}</div>
  );
}

const ContentContainer = (props: ComponentProps<"div">) => {
  const { children, className, ...rest } = props;
  return (
    <div className={cn("flex-1 space-y-1.5", className)} {...rest}>
      {children}
    </div>
  );
};

const Title = (props: ComponentProps<"span">) => {
  const { children, className, ...rest } = props;
  return <span className={cn("block font-medium", className)}>{children}</span>;
};

const Link = (props: LinkProps) => {
  const { href, ...rest } = props;
  return (
    <NextLink
      href={href}
      className="block truncate text-xs text-zinc-400 hover:text-zinc-200"
      {...rest}
    >
      {`${href}`}
    </NextLink>
  );
};

const Description = (props: ComponentProps<"span">) => {
  const { children, className, ...rest } = props;
  return (
    <span
      className={cn("block truncate text-sm text-zinc-400", className)}
      {...rest}
    >
      {children}
    </span>
  );
};

const IconContainer = (props: ComponentProps<"div">) => {
  const { children, ...rest } = props;
  return <div {...rest}>{children}</div>;
};

InfoCard.ContentContainer = ContentContainer;
InfoCard.Title = Title;
InfoCard.Link = Link;
InfoCard.Description = Description;
InfoCard.IconContainer = IconContainer;
