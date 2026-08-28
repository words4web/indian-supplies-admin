import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backHref?: string;
}

export function PageHeader({ title, subtitle, backHref }: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 mb-6">
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
  );
}

export default PageHeader;
