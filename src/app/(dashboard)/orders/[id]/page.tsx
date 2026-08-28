"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/Loader";
import { ErrorView } from "@/components/common/ErrorView";
import { useAdminOrderDetailQuery } from "@/services/order/order.hook";
import { formatPounds } from "@/lib/format";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;

  const {
    data: responseBody,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminOrderDetailQuery(orderId);

  const order = responseBody?.data;

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/orders")}
          className="inline-flex items-center gap-2 text-sm font-semibold">
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Button>
        <ErrorView
          message={error?.message || "Order details not found"}
          onRetry={refetch}
        />
      </div>
    );
  }

  const totalItems =
    order.items?.reduce(
      (acc: number, item: any) => acc + (item.quantity || 0),
      0,
    ) || 0;

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/orders")}
          className="inline-flex items-center gap-2 text-sm font-semibold -ml-2">
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </Button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
              Order {order.orderId}
            </h1>
            <span
              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                statusColors[order.status] ||
                "bg-secondary text-secondary-foreground"
              }`}>
              {statusLabels[order.status] || order.status}
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Placed{" "}
            {new Date(order.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <p className="font-serif text-3xl font-extrabold text-primary">
          {formatPounds(order.total)}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h2 className="font-serif text-xl font-bold text-foreground">
            Customer & Business Details
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contact Name</span>
              <span className="font-semibold text-foreground">
                {order.delivery?.contactPerson || order.userId?.name}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Business Name</span>
              <span className="font-semibold text-foreground">
                {order.delivery?.businessName ||
                  order.userId?.business ||
                  "Not Provided"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email Address</span>
              <span className="font-semibold text-foreground">
                {order.userId?.email}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Contact Phone</span>
              <span className="font-semibold text-foreground">
                {order.delivery?.phone || order.userId?.phone}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <h2 className="font-serif text-xl font-bold text-foreground">
            Delivery Address
          </h2>
          <div className="space-y-2 text-sm">
            <p className="font-medium text-foreground leading-relaxed">
              {order.delivery?.address}
            </p>
            {order.delivery?.notes && (
              <div className="mt-4 border-t border-border pt-4">
                <p className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-1">
                  Delivery Notes
                </p>
                <p className="text-muted-foreground italic leading-relaxed">
                  &ldquo;{order.delivery.notes}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="font-serif text-xl font-bold text-foreground">
            Items Ordered ({totalItems})
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-secondary/40 text-muted-foreground font-semibold">
                <th className="px-6 py-3.5">Product Name</th>
                <th className="px-6 py-3.5">Pack Size</th>
                <th className="px-6 py-3.5 text-center">Quantity</th>
                <th className="px-6 py-3.5 text-right">Price at Order</th>
                <th className="px-6 py-3.5 text-right">Total Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {order.items?.map((item: any) => (
                <tr
                  key={item.productId?._id || item.productId}
                  className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-semibold text-foreground">
                    {item.productId?.name || "Deleted Product"}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {item.productId?.pack || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-center font-bold">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {formatPounds(item.priceAtOrder)}
                  </td>
                  <td className="px-6 py-4 text-right font-semibold">
                    {formatPounds((item.priceAtOrder || 0) * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-secondary/30 p-6 flex flex-col items-end border-t border-border">
          <div className="w-full max-w-xs space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-foreground">
                {formatPounds(order.subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">VAT (20%)</span>
              <span className="font-semibold text-foreground">
                {formatPounds(order.vat)}
              </span>
            </div>
            <div className="flex justify-between border-t border-border/80 pt-2 text-base font-bold">
              <span className="text-foreground">Estimated Total</span>
              <span className="text-primary font-serif text-lg">
                {formatPounds(order.total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
