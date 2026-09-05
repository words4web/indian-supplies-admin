"use client";

import { CreditCard } from "lucide-react";
import { formatPounds } from "@/lib/format";

import { OrderItemsTableProps } from "@/types/order.types";

export function OrderItemsTable({
  items,
  subtotal,
  vat,
  total,
}: OrderItemsTableProps) {
  const totalItems =
    items?.reduce((acc, item) => acc + (item?.quantity || 0), 0) || 0;

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="size-5 text-primary" />
          <h2 className="font-serif text-lg font-bold text-foreground">
            Items Ordered ({totalItems})
          </h2>
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {items?.length || 0} unique items
        </span>
      </div>

      <div className="bg-muted/30 p-6 flex flex-col items-end border-b border-border">
        <div className="w-full max-w-xs space-y-2.5 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="font-semibold text-foreground">
              {formatPounds(subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>VAT (20%)</span>
            <span className="font-semibold text-foreground">
              {formatPounds(vat)}
            </span>
          </div>
          <div className="flex justify-between border-t border-border pt-3 text-base font-bold">
            <span className="text-foreground">Total Order Amount</span>
            <span className="text-primary font-serif text-xl font-extrabold">
              {formatPounds(total)}
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wider font-semibold">
              <th className="px-6 py-3.5">Product Name</th>
              <th className="px-6 py-3.5">Pack Size</th>
              <th className="px-6 py-3.5 text-center">Quantity</th>
              <th className="px-6 py-3.5 text-right">Price at Order</th>
              <th className="px-6 py-3.5 text-right">Total Price</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {items?.map((item, index) => (
              <tr
                key={item?.productId?._id || `item-${index}`}
                className="hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-semibold text-foreground">
                    {item?.productId?.name || "Deleted Product"}
                  </p>
                  {item?.productId?.slug && (
                    <p className="text-xs text-muted-foreground font-mono truncate max-w-xs">
                      {item?.productId?.slug}
                    </p>
                  )}
                </td>
                <td className="px-6 py-4 text-muted-foreground font-medium">
                  {item?.productId?.pack || "N/A"}
                </td>
                <td className="px-6 py-4 text-center font-bold">
                  <span className="inline-flex items-center justify-center min-w-8 px-2 py-0.5 rounded-md bg-muted font-bold text-foreground">
                    {item?.quantity}
                  </span>
                </td>
                <td className="px-6 py-4 text-right font-medium text-muted-foreground">
                  {formatPounds(item?.priceAtOrder || 0)}
                </td>
                <td className="px-6 py-4 text-right font-bold text-foreground">
                  {formatPounds(
                    (item?.priceAtOrder || 0) * (item?.quantity || 0),
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
