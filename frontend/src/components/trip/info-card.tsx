import Link from "next/link";
import { ReactNode } from "react";

interface InfoCardBaseProps {
  title: string;
  icon?: ReactNode;
}

interface InfoCardWithDescription extends InfoCardBaseProps {
  description: string;
  href?: never;
}

interface InfoCardWithHref extends InfoCardBaseProps {
  href: string;
  description?: never;
}

type InfoCardProps = InfoCardWithDescription | InfoCardWithHref;

export default function InfoCard(props: InfoCardProps) {
  const { title, description, href, icon } = props;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 space-y-1.5">
        <span className="block font-medium text-zinc-100">{title}</span>
        {href && (
          <Link
            href={href}
            className="block truncate text-xs text-zinc-400 hover:text-zinc-200"
          >
            {href}
          </Link>
        )}
        {description && (
          <span className="block truncate text-sm text-zinc-400">
            {description}
          </span>
        )}
      </div>
      {icon}
    </div>
  );
}
