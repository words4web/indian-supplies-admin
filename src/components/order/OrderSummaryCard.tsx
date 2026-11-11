"use client";

import { FileText, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/common/Textarea";
import { formatPounds } from "@/lib/format";
import { SelectedOrderItem, OrderSummaryCardProps } from "@/types/order.types";

export function OrderSummaryCard({
  selectedItems,
  notes,
  onNotesChange,
  onSubmitOrder,
  isValid,
  isSubmitting,
  minOrderAmount = 150,
}: OrderSummaryCardProps) {
  const { subtotal, vat, total } = (selectedItems || [])?.reduce(
    (acc, item) => {
      const price = item?.price ?? 0;
      const quantity = item?.quantity ?? 0;
      const itemSubtotal = price * quantity;
      const itemVat = item?.isVatApplicable ? itemSubtotal * 0.2 : 0;
      acc.subtotal += itemSubtotal;
      acc.vat += itemVat;
      acc.total += itemSubtotal + itemVat;
      return acc;
    },
    { subtotal: 0, vat: 0, total: 0 },
  );

  const isBelowMin = selectedItems.length > 0 && total < minOrderAmount;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-5 shadow-sm sticky top-6">
      <div className="flex items-center gap-2.5 pb-3 border-b border-border">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ShoppingBag className="size-4.5" />
        </div>
        <div>
          <h2 className="font-serif text-base font-bold text-foreground">
            Order Summary
          </h2>
          <p className="text-xs text-muted-foreground">
            Price breakdown & delivery notes
          </p>
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between text-muted-foreground">
          <span>Items ({selectedItems.length})</span>
          <span className="font-medium text-foreground">
            {selectedItems.reduce((sum, item) => sum + item.quantity, 0)} units
          </span>
        </div>

        <div className="flex items-center justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="font-mono font-medium text-foreground">
            {formatPounds(subtotal)}
          </span>
        </div>

        <div className="flex items-center justify-between text-muted-foreground">
          <span>VAT (20% applicable items)</span>
          <span className="font-mono font-medium text-foreground">
            {formatPounds(vat)}
          </span>
        </div>

        <div className="pt-3 border-t border-border flex items-baseline justify-between">
          <span className="font-serif font-bold text-base text-foreground">
            Grand Total
          </span>
          <span className="font-serif text-xl font-extrabold text-primary">
            {formatPounds(total)}
          </span>
        </div>
      </div>

      {isBelowMin && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300 space-y-1">
          <p className="font-bold">
            Minimum order requirement is {formatPounds(minOrderAmount)}
          </p>
          <p className="text-[11px] opacity-90">
            Total must be at least {formatPounds(minOrderAmount)} to create
            order (needs {formatPounds(Math.max(0, minOrderAmount - total))}{" "}
            more).
          </p>
        </div>
      )}

      <div className="space-y-1.5 pt-2">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <FileText className="size-3.5 text-muted-foreground" />
          Delivery Notes (Optional)
        </label>
        <Textarea
          placeholder="Special delivery instructions or order references..."
          rows={3}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="text-xs"
        />
      </div>

      <Button
        onClick={onSubmitOrder}
        disabled={!isValid || isSubmitting || isBelowMin}
        className="w-full h-11 text-sm font-bold shadow-lg shadow-primary/20">
        {isSubmitting ? "Creating Order..." : "Create Wholesale Order"}
      </Button>

      {!isValid ? (
        <p className="text-[11px] text-center text-muted-foreground">
          Please select a customer, delivery address, and at least 1 product.
        </p>
      ) : isBelowMin ? (
        <p className="text-[11px] text-center text-amber-600 dark:text-amber-400 font-medium">
          Order total does not meet customer&apos;s minimum{" "}
          {formatPounds(minOrderAmount)} delivery limit.
        </p>
      ) : null}
    </div>
  );
}
