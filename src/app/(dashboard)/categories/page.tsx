"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { RowActions } from "@/components/common/RowActions";
import {
  useCategories,
  useDeleteCategory,
} from "@/services/category/category.hook";
import { DataTable, TableColumn } from "@/components/common/DataTable";
import { QueryBoundary } from "@/components/common/QueryBoundary";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { CategoryRow } from "@/types/category/category.types";
import { ROUTES } from "@/constants/routes";
import { Pagination } from "@/components/common/Pagination";
import { PageHeader } from "@/components/common/PageHeader";

export default function CategoriesPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<CategoryRow | null>(null);
  const limit = 20;

  const { data, isLoading, isError, error, refetch } = useCategories({
    page,
    limit,
  });
  const { mutate: deleteCategory } = useDeleteCategory();

  const categories: CategoryRow[] = data?.data?.categories ?? [];

  const total: number = data?.data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const columns: TableColumn<CategoryRow>[] = [
    {
      key: "name",
      header: "Name",
      render: (row) => (
        <span className="font-semibold text-foreground">{row?.name}</span>
      ),
    },
    {
      key: "slug",
      header: "Slug",
      render: (row) => <span className="font-mono text-xs">{row?.slug}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
            row?.isActive
              ? "bg-emerald-500/10 text-emerald-700"
              : "bg-muted text-muted-foreground"
          }`}>
          {row?.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <RowActions
          id={`actions-${row?._id}`}
          actions={[
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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        subtitle={`${total} ${total === 1 ? "category" : "categories"} total`}
        action={{
          id: "add-category-btn",
          label: "Add Category",
          icon: <Plus className="size-4" />,
          onClick: () => router.push(`${ROUTES.CATEGORIES}/new`),
        }}
      />

      <QueryBoundary
        isLoading={isLoading}
        isError={isError}
        error={error}
        refetch={refetch}
        hasData={true}
        notFoundMessage="Failed to load categories.">
        <DataTable
          columns={columns}
          data={categories}
          keyExtractor={(row) => row?._id}
          onRowClick={(row) => router.push(`${ROUTES.CATEGORIES}/${row?._id}`)}
          emptyMessage="No categories found. Create your first one!"
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </QueryBoundary>

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
