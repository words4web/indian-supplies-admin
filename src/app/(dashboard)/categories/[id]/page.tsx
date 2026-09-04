"use client";

import { useParams, useRouter } from "next/navigation";
import { Pencil, Tag, Calendar, Clock } from "lucide-react";
import { useCategoryDetail } from "@/services/category/category.hook";
import { QueryBoundary } from "@/components/common/QueryBoundary";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, isError, error, refetch } = useCategoryDetail(id);

  const category = data?.data;

  return (
    <QueryBoundary
      isLoading={isLoading}
      isError={isError}
      error={error}
      refetch={refetch}
      hasData={!!category}
      notFoundMessage="Category not found.">
      <div className="w-full space-y-8 animate-fade-in">
        <PageHeader
          title={category?.name}
          subtitle="View product category information"
          backHref={ROUTES.CATEGORIES}
          action={{
            id: "edit-category-btn",
            label: "Edit Category",
            icon: <Pencil className="size-4" />,
            onClick: () => router.push(`${ROUTES.CATEGORIES}/${id}/edit`),
          }}
        />

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div className="size-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Tag className="size-7" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      Product Category
                    </span>
                    <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-foreground mt-0.5">
                      {category?.name}
                    </h2>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold ${
                    category?.isActive
                      ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
                      : "bg-rose-500/10 text-rose-700 border-rose-500/30"
                  }`}>
                  {category?.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="space-y-4 pt-6 border-t border-border/40">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    URL path slug
                  </span>
                  <div className="bg-muted px-4 py-3 rounded-xl font-mono text-sm border border-border/30 text-foreground break-all">
                    {category?.slug}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <h3 className="font-serif text-xl font-bold text-foreground">
                Audit Logs
              </h3>

              <div className="space-y-6 text-sm">
                <div className="flex items-start gap-3">
                  <Calendar className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                      Created At
                    </p>
                    <p className="text-foreground font-medium mt-1">
                      {new Date(category?.createdAt)?.toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="size-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-foreground text-xs uppercase tracking-wider text-muted-foreground">
                      Last Updated
                    </p>
                    <p className="text-foreground font-medium mt-1">
                      {new Date(category?.updatedAt)?.toLocaleDateString(
                        "en-GB",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </QueryBoundary>
  );
}
