"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Eye, Search } from "lucide-react";
import { useProducts, useDeleteProduct } from "@/services/product/product.hook";
import { DataTable, TableColumn } from "@/components/common/DataTable";
import { QueryBoundary } from "@/components/common/QueryBoundary";
import { RowActions } from "@/components/common/RowActions";
import { Pagination } from "@/components/common/Pagination";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { ProductRow } from "@/types/product/product.types";
import { ROUTES } from "@/constants/routes";
import { useDebounce } from "@/hooks/useDebounce";
import { PageHeader } from "@/components/common/PageHeader";

export default function ProductsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 350);
  const [pendingDelete, setPendingDelete] = useState<ProductRow | null>(null);
  const limit = 20;

  const { data, isLoading, isError, error, refetch } = useProducts({
    page,
    limit,
    search: debouncedQuery?.trim() || undefined,
  });
  const { mutate: deleteProduct } = useDeleteProduct();

  const products: ProductRow[] = data?.data?.products ?? [];
  const total: number = data?.data?.total ?? 0;
  const totalPages = Math.ceil(total / limit);

  const columns: TableColumn<ProductRow>[] = [
    {
      key: "name",
      header: "Name",
      render: (row) => (
        <span className="font-semibold text-foreground">{row?.name}</span>
      ),
    },
    {
      key: "categoryId",
      header: "Category",
      render: (row) => {
        const cat =
          typeof row?.categoryId === "object" ? row?.categoryId?.name : "-";
        return (
          <span className="text-sm font-medium text-foreground">{cat}</span>
        );
      },
    },
    {
      key: "pack",
      header: "Pack Size",
      render: (row) => (
        <span className="text-sm text-foreground">{row?.pack}</span>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (row) => (
        <span className="text-sm font-bold text-foreground">
          £{row?.price?.toFixed(2)}
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
            className={`size-1.5 rounded-full ${
              row?.isActive ? "bg-emerald-500" : "bg-destructive"
            }`}
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
              onClick: () => router.push(`${ROUTES.PRODUCTS}/${row?._id}`),
            },
            {
              label: "Edit",
              icon: <Pencil className="size-4" />,
              onClick: () => router.push(`${ROUTES.PRODUCTS}/${row?._id}/edit`),
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
        title="Products"
        subtitle={`${total} ${total === 1 ? "product" : "products"} total`}
        action={{
          id: "add-product-btn",
          label: "Add Product",
          icon: <Plus className="size-4" />,
          onClick: () => router.push(`${ROUTES.PRODUCTS}/new`),
        }}
      />

      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search products..."
          className="h-10 w-full rounded-xl border border-input bg-card pl-9 pr-4 text-sm shadow-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary/20"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setPage(1);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary hover:underline cursor-pointer">
            Clear
          </button>
        )}
      </div>

      <QueryBoundary
        isLoading={isLoading}
        isError={isError}
        error={error}
        refetch={refetch}
        hasData={true}
        notFoundMessage="Failed to load products.">
        <DataTable
          columns={columns}
          data={products}
          keyExtractor={(row) => row?._id}
          onRowClick={(row) => router.push(`${ROUTES.PRODUCTS}/${row?._id}`)}
          emptyMessage={
            query
              ? "No products match your search query."
              : "No products found. Create your first one!"
          }
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
        description="This action cannot be undone. The product will be permanently removed."
        confirmText="Delete"
        variant="destructive"
        onConfirm={() => {
          if (pendingDelete) {
            deleteProduct(pendingDelete._id, {
              onSuccess: () => setPendingDelete(null),
            });
          }
        }}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
}
