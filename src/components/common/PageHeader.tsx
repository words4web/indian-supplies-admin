import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface PageHeaderAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  id?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
  action?: PageHeaderAction;
}

export function PageHeader({
  title,
  subtitle,
  backHref,
  action,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-start justify-between gap-4 mb-6 w-full">
      <div className="flex items-center gap-3">
        {backHref && (
          <button
            id="page-header-back-btn"
            onClick={() => router.push(backHref)}
            className="p-2 rounded-xl hover:bg-muted transition-colors text-muted-foreground flex-shrink-0">
            <ArrowLeft className="size-5" />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {action && (
        <div className="flex items-center gap-2 flex-shrink-0 pt-1">
          <button
            id={action?.id}
            onClick={action?.onClick}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium cursor-pointer">
            {action?.icon}
            {action?.label}
          </button>
        </div>
      )}
    </div>
  );
}

export default PageHeader;
