"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { RowActions } from "@/components/common/RowActions";
import {
  useCategories,
  useDeleteCategory,
} from "@/services/category/category.hook";
import { DataTable, TableColumn } from "@/components/common/DataTable";
import { Loader } from "@/components/common/Loader";
import { ErrorView } from "@/components/common/ErrorView";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { CategoryRow } from "@/types/category/category.types";
import { ROUTES } from "@/constants/routes";
import { Pagination } from "@/components/common/Pagination";

export default function CategoriesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<CategoryRow | null>(null);
  const limit = 20;

  const { data, isLoading, isError, error, refetch } = useCategories({
    page,
    limit,
  });
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const categories: CategoryRow[] = data?.data?.categories ?? [];

  const total: number = data?.data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const columns: TableColumn<CategoryRow>[] = [
    {
      key: "name",
      header: "Name",
      render: (row) => (
        <span className="font-semibold text-foreground">{row.name}</span>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      render: (row) => (
        <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
          {row.slug}
        </span>
      ),
    },
    {
      key: "isActive",
      header: "Status",
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            row?.isActive
              ? "bg-emerald-500/10 text-emerald-600"
              : "bg-destructive/10 text-destructive"
          }`}>
          <span
            className={`size-1.5 rounded-full ${row?.isActive ? "bg-emerald-500" : "bg-destructive"}`}
          />
          {row?.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right w-12",
      render: (row) => (
        <RowActions
          id={`actions-${row?._id}`}
          actions={[
            {
              label: "View",
              icon: <Eye className="size-4" />,
              onClick: () => router.push(`${ROUTES.CATEGORIES}/${row?._id}`),
            },
            {
              label: "Edit",
              icon: <Pencil className="size-4" />,
              onClick: () =>
                router.push(`${ROUTES.CATEGORIES}/${row?._id}/edit`),
            },
            {
              label: "Delete",
              icon: <Trash2 className="size-4" />,
              variant: "danger",
              onClick: () => setPendingDelete(row),
            },
          ]}
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorView
        message={
          (error as any)?.response?.data?.message ??
          "Failed to load categories."
        }
        onRetry={refetch}
        className="mt-8"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {total} {total === 1 ? "category" : "categories"} total
          </p>
        </div>
        <button
          id="add-category-btn"
          onClick={() => router.push(`${ROUTES.CATEGORIES}/new`)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm">
          <Plus className="size-4" />
          Add Category
        </button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        keyExtractor={(row) => row?._id}
        onRowClick={(row) => router.push(`${ROUTES.CATEGORIES}/${row?._id}`)}
        emptyMessage="No categories found. Create your first one!"
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />

      <ConfirmModal
        isOpen={!!pendingDelete}
        title={`Delete "${pendingDelete?.name}"?`}
        description="This action cannot be undone. The category will be permanently removed."
        confirmText="Delete"
        variant="destructive"
        onConfirm={() => {
          if (pendingDelete) {
            deleteCategory(pendingDelete._id, {
              onSuccess: () => setPendingDelete(null),
            });
          }
        }}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
