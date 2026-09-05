"use client";

import { User, Building2, Mail, Phone, MapPin, FileText } from "lucide-react";

import { OrderCustomerDetailsProps } from "@/types/order.types";

export function OrderCustomerDetails({
  delivery,
  userId,
}: OrderCustomerDetailsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <User className="size-5 text-primary" />
          <h2 className="font-serif text-lg font-bold text-foreground">
            Customer &amp; Business Details
          </h2>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <User className="size-4 text-muted-foreground shrink-0" />
              Contact Name
            </span>
            <span className="font-semibold text-foreground">
              {delivery?.contactPerson || userId?.name || "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Building2 className="size-4 text-muted-foreground shrink-0" />
              Business Name
            </span>
            <span className="font-semibold text-foreground">
              {delivery?.businessName || userId?.business || "Not Provided"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Mail className="size-4 text-muted-foreground shrink-0" />
              Email Address
            </span>
            <span className="font-mono font-medium text-foreground">
              {userId?.email || "N/A"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground flex items-center gap-2">
              <Phone className="size-4 text-muted-foreground shrink-0" />
              Contact Phone
            </span>
            <span className="font-mono font-medium text-foreground">
              {delivery?.phone || userId?.phone || "N/A"}
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <MapPin className="size-5 text-primary" />
          <h2 className="font-serif text-lg font-bold text-foreground">
            Delivery Destination
          </h2>
        </div>
        <div className="space-y-3 text-sm">
          <p className="font-medium text-foreground leading-relaxed">
            {delivery?.address || "No delivery address specified."}
          </p>
          {delivery?.notes && (
            <div className="mt-4 border-t border-border/60 pt-3">
              <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                <FileText className="size-3.5 text-primary" /> Delivery Notes
              </span>
              <p className="text-xs text-muted-foreground italic bg-muted/50 p-2.5 rounded-lg border border-border/40 leading-relaxed">
                &ldquo;{delivery?.notes}&rdquo;
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
