"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import { useAdminOrdersQuery } from "@/services/order/order.hook";
import { DataTable, TableColumn } from "@/components/common/DataTable";
import { Loader } from "@/components/common/Loader";
import { ErrorView } from "@/components/common/ErrorView";
import { formatPounds } from "@/lib/format";

export default function OrdersPage() {
  const {
    data: responseBody,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminOrdersQuery();

  const orders = responseBody?.data || [];

  const columns: TableColumn<any>[] = [
    {
      key: "orderId",
      header: "Order ID",
      render: (row) => (
        <span className="font-serif font-bold text-foreground">
          {row.orderId}
        </span>
      ),
    },
    {
      key: "customer",
      header: "Customer",
      render: (row) => (
        <div>
          <p className="font-semibold text-foreground">
            {row.delivery?.contactPerson || row.userId?.name || "Customer"}
          </p>
          <p className="text-xs text-muted-foreground">
            {row.delivery?.businessName ||
              row.userId?.business ||
              "No business"}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const statusColors: Record<string, string> = {
          PENDING_REVIEW: "bg-amber-500/10 text-amber-600 border-amber-500/20",
          APPROVED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
          DISPATCHED: "bg-blue-500/10 text-blue-600 border-blue-500/20",
          DELIVERED: "bg-zinc-500/10 text-zinc-600 border-zinc-500/20",
          CANCELLED: "bg-rose-500/10 text-rose-600 border-rose-500/20",
        };
        const statusLabels: Record<string, string> = {
          PENDING_REVIEW: "Pending Review",
          APPROVED: "Approved",
          DISPATCHED: "Dispatched",
          DELIVERED: "Delivered",
          CANCELLED: "Cancelled",
        };
        return (
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
              statusColors[row.status] ||
              "bg-secondary text-secondary-foreground"
            }`}>
            {statusLabels[row.status] || row.status}
          </span>
        );
      },
    },
    {
      key: "itemsCount",
      header: "Items",
      render: (row) => {
        const count =
          row.items?.reduce(
            (acc: number, item: any) => acc + (item.quantity || 0),
            0,
          ) || 0;
        return <span className="font-semibold">{count}</span>;
      },
    },
    {
      key: "total",
      header: "Total",
      render: (row) => (
        <span className="font-serif font-extrabold text-foreground">
          {formatPounds(row.total)}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date Placed",
      render: (row) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <Link
          href={`/orders/${row._id}`}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
          <Eye className="h-3.5 w-3.5" /> View
        </Link>
      ),
    },
  ];

  if (isError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Orders
          </h1>
        </div>
        <ErrorView
          message={error?.message || "Failed to load orders"}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Orders
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View, track, and manage wholesale order requests.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader />
          </div>
        ) : (
          <DataTable
            data={orders}
            columns={columns}
            keyExtractor={(row) => row._id}
          />
        )}
      </div>
    </div>
  );
}
