"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import {
  useNotificationsQuery,
  useMarkReadMutation,
} from "@/services/notification/notification.hook";
import { useDispatch } from "react-redux";
import { setUnreadCount } from "@/lib/store/notificationSlice";
import { Button } from "@/components/ui/button";
import { NotificationSkeleton } from "@/components/skeleton/notification-skeleton";
import {
  Bell,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Inbox,
  ShoppingBag,
} from "lucide-react";
import { NotificationItem } from "@/types/notification.types";
import { ROUTES } from "@/constants/routes";

export default function AdminNotificationsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, ready } = useAuth();
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useNotificationsQuery(
    page,
    ready && !!user,
  );
  const markReadMutation = useMarkReadMutation();

  useEffect(() => {
    if (ready && !user) {
      router.replace("/login");
    }
  }, [ready, user, router]);

  const notifications: NotificationItem[] =
    data?.data?.notifications || data?.data?.docs || data?.data || [];
  const meta = data?.meta || {};
  const pagination = {
    page: meta?.page || page,
    totalPages: meta?.totalPages || 1,
    totalNotifications: meta?.total || notifications.length,
    hasNextPage: meta?.page < meta?.totalPages,
    hasPrevPage: meta?.page > 1,
  };

  const handleMarkAsRead = (item: NotificationItem) => {
    if (item.isRead) return;
    markReadMutation.mutate(item._id, {
      onSuccess: () => {
        dispatch(setUnreadCount(Math.max(0, (meta?.total || 1) - 1)));
      },
    });
  };

  const handleNotificationClick = (item: NotificationItem) => {
    handleMarkAsRead(item);
    const orderId = item.metadata?.orderId;
    if (orderId) {
      router.push(ROUTES.ORDER_DETAIL(orderId));
    }
  };

  const showLoading = !ready || !user || isLoading;

  return (
    <div className="space-y-6 w-full max-w-4xl">
      <div className="flex items-center justify-between border-b border-border pb-5">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Bell className="size-6" />
          </div>
          <div>
            <h1 className="font-serif text-3xl font-extrabold tracking-tight text-foreground">
              Admin Notifications
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live updates for new incoming wholesale order requests
            </p>
          </div>
        </div>
      </div>

      {showLoading ? (
        <NotificationSkeleton />
      ) : notifications.length === 0 ? (
        <div className="mx-auto mt-12 max-w-md rounded-2xl border border-dashed border-border p-10 text-center bg-card">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <Inbox className="size-7" />
          </div>
          <h2 className="mt-4 font-serif text-xl font-bold text-foreground">
            No admin notifications
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            New customer order notifications and system alerts will appear here
            in real time.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="space-y-3">
            {notifications.map((item) => (
              <div
                key={item._id}
                onClick={() => handleNotificationClick(item)}
                className={`group relative flex flex-col gap-2 rounded-2xl border p-5 transition-all ${
                  item.isRead
                    ? "border-border/60 bg-card/60 text-muted-foreground"
                    : "border-primary/30 bg-primary/5 text-foreground shadow-xs cursor-pointer hover:border-primary/50 hover:bg-primary/10"
                }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    {!item.isRead && (
                      <span className="size-2.5 rounded-full bg-primary shrink-0" />
                    )}
                    <h3
                      className={`text-base ${
                        item.isRead
                          ? "font-semibold text-foreground/90"
                          : "font-bold text-foreground"
                      }`}>
                      {item.title}
                    </h3>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground shrink-0">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
                <div className="mt-1 flex items-center justify-between text-xs pt-1 border-t border-border/40">
                  {item.metadata?.orderId ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-primary group-hover:underline">
                      <ShoppingBag className="size-3.5" /> View Order Details
                    </span>
                  ) : (
                    <span />
                  )}
                  {!item.isRead && (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-muted-foreground hover:text-foreground">
                      <CheckCircle className="size-3.5" /> Mark as read
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-border pt-6 mt-6">
              <span className="text-xs font-medium text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasPrevPage || isFetching}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-9 gap-1.5 px-4 text-xs font-semibold">
                  <ChevronLeft className="size-4" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!pagination.hasNextPage || isFetching}
                  onClick={() => setPage((p) => p + 1)}
                  className="h-9 gap-1.5 px-4 text-xs font-semibold">
                  Next <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
