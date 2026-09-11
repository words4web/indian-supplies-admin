"use client";

import React from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationItem } from "@/types/notification.types";
import { formatDate } from "@/lib/format";

export function NotificationCard({
  item,
  onClick,
  onMarkAsRead,
}: {
  item: NotificationItem;
  onClick: (item: NotificationItem) => void;
  onMarkAsRead: (e: React.MouseEvent, item: NotificationItem) => void;
}) {
  return (
    <div
      onClick={() => onClick(item)}
      className={`group relative flex flex-col gap-1.5 rounded-xl border px-3.5 py-2.5 w-full max-w-2xl mx-auto transition-all ${
        item?.isRead
          ? "border-border/60 bg-card/60 text-muted-foreground"
          : "border-primary/30 bg-primary/5 text-foreground shadow-2xs cursor-pointer hover:border-primary/50 hover:bg-primary/10"
      }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 pr-2">
          {!item?.isRead && (
            <span className="size-2 rounded-full bg-primary shrink-0" />
          )}
          <h3
            className={`text-sm tracking-tight ${
              item?.isRead
                ? "font-medium text-foreground/80"
                : "font-bold text-foreground"
            }`}>
            {item?.title}
          </h3>
        </div>

        <span className="text-[11px] font-medium text-muted-foreground shrink-0 pt-0.5">
          {formatDate(item?.createdAt)}
        </span>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {item?.body}
      </p>

      <div className="flex items-center justify-between text-xs pt-1 min-h-[24px]">
        <div>
          {item?.metadata?.orderId && (
            <Button size="sm" className="h-7 text-xs gap-1 px-3">
              View Order
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </Button>
          )}
        </div>

        {!item?.isRead && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => onMarkAsRead(e, item)}
            className="h-7 text-[11px] gap-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-primary hover:bg-primary/10 ml-auto"
            title="Mark as read">
            <CheckCircle className="size-3.5" />
            <span>Mark read</span>
          </Button>
        )}
      </div>
    </div>
  );
}

export default NotificationCard;
