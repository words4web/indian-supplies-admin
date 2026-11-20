import { useState } from "react";
import {
  ShoppingBag,
  CheckCircle2,
  Clock,
  FileText,
  Truck,
  CreditCard,
  Banknote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/common/ConfirmModal";

import { OrderHeaderProps } from "@/types/order.types";

export function OrderHeader({
  orderId,
  createdAt,
  total,
  paymentMethod,
  paymentStatus,
  isDelivered,
  isUpdating,
  isMarkingPaid,
  deliveryNoteUrl,
  invoiceUrl,
  onUpdateStatus,
  onMarkPaid,
}: OrderHeaderProps) {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPaidModal, setShowPaidModal] = useState(false);

  const isPaid = paymentStatus === "PAID";
  const isCredit = paymentMethod === "CREDIT";

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <ShoppingBag className="size-6 text-primary" />
              Order #{orderId}
            </h1>
            {isDelivered ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="size-3.5" />
                Delivered
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                <Clock className="size-3.5 animate-spin" />
                In Process
              </span>
            )}
            {isPaid ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <Banknote className="size-3.5" />
                Paid
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-0.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                <Clock className="size-3.5" />
                Payment Pending {isCredit ? "(Credit)" : ""}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Placed on{" "}
            <span className="font-medium text-foreground">
              {createdAt
                ? new Date(createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "N/A"}
            </span>
            {paymentMethod && (
              <span className="ml-2 font-semibold">
                • Payment: <span className="text-foreground">{paymentMethod}</span>
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {invoiceUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                window.open(invoiceUrl, "_blank", "noopener,noreferrer")
              }
              className="gap-1.5 font-semibold text-xs h-9 cursor-pointer">
              <FileText className="size-3.5 text-primary" />
              Invoice
            </Button>
          )}

          {deliveryNoteUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                window.open(deliveryNoteUrl, "_blank", "noopener,noreferrer")
              }
              className="gap-1.5 font-semibold text-xs h-9 cursor-pointer">
              <Truck className="size-3.5 text-primary" />
              Delivery Note
            </Button>
          )}

          {isCredit && !isPaid && onMarkPaid && (
            <Button
              size="sm"
              disabled={isMarkingPaid}
              onClick={() => setShowPaidModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm cursor-pointer h-9 gap-1.5">
              <Banknote className="size-4" />
              {isMarkingPaid ? "Updating…" : "Mark as Paid"}
            </Button>
          )}

          {!isDelivered && (
            <Button
              size="sm"
              disabled={isUpdating}
              onClick={() => setShowConfirmModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-sm cursor-pointer h-9">
              {isUpdating ? "Updating…" : "Mark as Delivered"}
            </Button>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setShowConfirmModal(false);
          onUpdateStatus("DELIVERED");
        }}
        title="Mark Order as Delivered"
        description={`Are you sure you want to mark Order #${orderId} as Delivered? This will confirm that the delivery has been completed.`}
        confirmText="Confirm Delivery"
        cancelText="Cancel"
      />

      <ConfirmModal
        isOpen={showPaidModal}
        onClose={() => setShowPaidModal(false)}
        onConfirm={() => {
          setShowPaidModal(false);
          onMarkPaid?.();
        }}
        title="Mark Credit Order as Paid"
        description={`Are you sure you want to mark Order #${orderId} as Paid? This will settle this credit invoice.`}
        confirmText="Confirm Paid"
        cancelText="Cancel"
      />
    </>
  );
}
