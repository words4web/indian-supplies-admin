"use client";

import { useParams, useRouter } from "next/navigation";
import { Pencil, Tag, ToggleLeft, ToggleRight, Calendar } from "lucide-react";
import { useCategoryDetail } from "@/services/category/category.hook";
import { Loader } from "@/components/common/Loader";
import { ErrorView } from "@/components/common/ErrorView";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, isError, error, refetch } = useCategoryDetail(id);

  const category = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError || !category) {
    return (
      <ErrorView
        message={
          (error as any)?.response?.data?.message ?? "Category not found."
        }
        onRetry={refetch}
        className="mt-8"
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-3">
        <PageHeader
          title={category?.name}
          subtitle={category?.slug}
          backHref={ROUTES.CATEGORIES}
        />
        <div className="flex items-center gap-2 flex-shrink-0 pt-1">
          <button
            id="edit-category-btn"
            onClick={() => router.push(`${ROUTES.CATEGORIES}/${id}/edit`)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium">
            <Pencil className="size-4" />
            Edit
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        <div className="flex items-start gap-4">
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Tag className="size-6 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Category Name
            </p>
            <p className="text-lg font-semibold text-foreground mt-0.5">
              {category?.name}
            </p>
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Slug
            </p>
            <p className="font-mono text-sm bg-muted px-3 py-2 rounded-lg mt-1 text-foreground">
              {category?.slug}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </p>
            <div className="flex items-center gap-2 mt-1">
              {category?.isActive ? (
                <ToggleRight className="size-5 text-emerald-500" />
              ) : (
                <ToggleLeft className="size-5 text-muted-foreground" />
              )}
              <span
                className={`text-sm font-semibold ${category?.isActive ? "text-emerald-600" : "text-muted-foreground"}`}>
                {category?.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Created
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                {new Date(category?.createdAt)?.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Last Updated
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                {new Date(category?.updatedAt)?.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
