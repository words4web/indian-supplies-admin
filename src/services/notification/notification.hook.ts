import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  notificationService,
  SyncDevicePayload,
  RemoveDevicePayload,
} from "./notification.service";

export const NOTIFICATION_QUERY_KEYS = {
  all: ["admin", "notifications"] as const,
  unreadCount: ["admin", "notifications", "unreadCount"] as const,
  list: (page = 1) => ["admin", "notifications", "list", page] as const,
};

export const useSyncDevice = () => {
  return useMutation({
    mutationFn: (payload: SyncDevicePayload) =>
      notificationService.syncDevice(payload),
  });
};

export const useRemoveDevice = () => {
  return useMutation({
    mutationFn: (payload: RemoveDevicePayload) =>
      notificationService.removeDevice(payload),
  });
};

export const useUnreadCountQuery = (enabled = true) => {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.unreadCount,
    queryFn: () => notificationService.getUnreadCount(),
    enabled,
    staleTime: 1000 * 60 * 2,
  });
};

export const useNotificationsQuery = (page = 1, enabled = true) => {
  return useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.list(page),
    queryFn: () => notificationService.getNotifications(page),
    enabled,
  });
};

export const useMarkReadMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: NOTIFICATION_QUERY_KEYS.all,
      });
    },
  });
};
