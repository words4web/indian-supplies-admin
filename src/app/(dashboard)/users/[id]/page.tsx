"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  Calendar,
  Mail,
  Phone,
  User as UserIcon,
  CheckCircle2,
  XCircle,
  Eye,
  Package,
  CreditCard,
  Settings2,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/common/PageHeader";
import { QueryBoundary } from "@/components/common/QueryBoundary";
import { DataTable, type TableColumn } from "@/components/common/DataTable";
import {
  useUserDetailQuery,
  useUpdateUserStatusMutation,
  useUpdateUserCreditMutation,
} from "@/services/user/user.hook";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { EditCreditModal } from "@/components/user/EditCreditModal";
import { SavedAddresses } from "@/components/user/saved-addresses";
import { formatPounds } from "@/lib/format";
import { ROUTES } from "@/constants/routes";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [showCreditModal, setShowCreditModal] = useState(false);

  const {
    data: responseBody,
    isLoading,
    isError,
    error,
    refetch,
  } = useUserDetailQuery(userId);

  const userData = responseBody?.data;
  const user = userData?.user;
  const orders = userData?.orders || [];

  const updateStatusMutation = useUpdateUserStatusMutation();
  const updateCreditMutation = useUpdateUserCreditMutation();

  const handleConfirmCreditChange = (data: {
    allowCredit: boolean;
    creditLimit: number;
  }) => {
    updateCreditMutation.mutate(
      {
        id: userId,
        allowCredit: data.allowCredit,
        creditLimit: data.creditLimit,
      },
      {
        onSuccess: () => {
          toast.success("Customer credit settings updated successfully.");
          setShowCreditModal(false);
        },
        onError: (err: any) => {
          toast.error(
            err.response?.data?.message || "Failed to update credit settings.",
          );
        },
      },
    );
  };

  const handleConfirmStatusChange = () => {
    if (!user) return;
    const newStatus = !user.isActive;
    updateStatusMutation.mutate(
      { id: userId, isActive: newStatus },
      {
        onSuccess: () => {
          toast.success(
            `Account ${newStatus ? "activated" : "deactivated"} successfully.`,
          );
          setShowStatusConfirm(false);
        },
        onError: (err: any) => {
          toast.error(
            err.response?.data?.message || `Failed to update status.`,
          );
        },
      },
    );
  };

  const orderColumns: TableColumn<any>[] = [
    {
      key: "orderId",
      header: "Order ID",
      className: "w-36",
      render: (row) => (
        <span className="font-mono font-bold text-sm text-foreground hover:text-primary transition-colors cursor-pointer">
          {row?.orderId}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => {
        const isDelivered = row?.status === "DELIVERED";
        return (
          <span
            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${
              isDelivered
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
            }`}>
            {isDelivered ? "Delivered" : "In Process"}
          </span>
        );
      },
    },
    {
      key: "total",
      header: "Total",
      render: (row) => (
        <div className="font-serif font-bold text-foreground">
          {formatPounds(row?.total)}
        </div>
      ),
    },
    {
      key: "createdAt",
      header: "Date Placed",
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {row?.createdAt
            ? new Date(row?.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : "N/A"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      className: "text-right w-24",
      render: (row) => (
        <div className="flex justify-end">
          <Link
            href={ROUTES.ORDERS.DETAIL(row?._id)}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 rounded-lg border border-border/70 bg-card px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-muted">
            <Eye className="size-3 text-muted-foreground" /> View
          </Link>
        </div>
      ),
    },
  ];

  return (
    <QueryBoundary
      isLoading={isLoading}
      isError={isError}
      error={error}
      refetch={refetch}
      hasData={!!user}
      notFoundMessage="Customer details not found.">
      <div className="space-y-5 max-w-5xl mx-auto animate-fade-in pb-8">
        <PageHeader
          title={user?.fullName || "Customer Details"}
          subtitle={
            user?.businessName
              ? `Business: ${user?.businessName}`
              : user?.email || "Customer Details"
          }
          showBack
          backHref={ROUTES.USERS.ROOT}
          action={{
            label: user?.isActive ? "Deactivate Account" : "Approve Account",
            icon: user?.isActive ? (
              <XCircle className="size-4 mr-1.5" />
            ) : (
              <CheckCircle2 className="size-4 mr-1.5" />
            ),
            variant: user?.isActive ? "destructive" : "default",
            onClick: () => setShowStatusConfirm(true),
            disabled: updateStatusMutation.isPending,
          }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
          <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-sm">
            <div>
              <div className="flex items-center gap-3 pb-3.5 border-b border-border/60">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UserIcon className="size-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-serif text-base sm:text-lg font-bold text-foreground truncate">
                      {user?.fullName}
                    </h2>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        user?.isActive
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}>
                      {user?.isActive ? "Active" : "Pending Approval"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.businessName || "Individual Customer"}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-border/40 text-xs pt-1">
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Mail className="size-3.5 text-muted-foreground/70 shrink-0" />
                    Email Address
                  </span>
                  <span className="font-medium text-foreground truncate max-w-[55%] text-right">
                    {user?.email || "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Phone className="size-3.5 text-muted-foreground/70 shrink-0" />
                    Mobile Number
                  </span>
                  <span className="font-mono font-medium text-foreground">
                    {user?.mobileNumber || "N/A"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Building2 className="size-3.5 text-muted-foreground/70 shrink-0" />
                    Business Name
                  </span>
                  <span className="font-medium text-foreground truncate max-w-[55%] text-right">
                    {user?.businessName || "Not Provided"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Calendar className="size-3.5 text-muted-foreground/70 shrink-0" />
                    Member Since
                  </span>
                  <span className="font-medium text-foreground">
                    {user?.createdAt
                      ? new Date(user?.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <SavedAddresses addresses={user?.addresses} />

          <div className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-5 shadow-sm lg:col-span-2">
            <div>
              <div className="flex items-center justify-between pb-3.5 border-b border-border/60">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <CreditCard className="size-5" />
                  </div>
                  <div>
                    <h2 className="font-serif text-base sm:text-lg font-bold text-foreground">
                      Credit Account Settings
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Configure customer credit purchases and maximum order
                      limits
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCreditModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-border bg-background hover:bg-muted text-foreground transition-all cursor-pointer">
                  <Settings2 className="size-3.5" /> Configure
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 py-4">
                <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-center">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Credit Status
                  </p>
                  <p
                    className={`text-sm font-bold mt-1 ${
                      user?.allowCredit
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-muted-foreground"
                    }`}>
                    {user?.allowCredit ? "Enabled" : "Disabled"}
                  </p>
                </div>

                <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-center">
                  <p className="text-[11px] font-medium text-muted-foreground">
                    Credit Purchase Limit
                  </p>
                  <p className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                    {user?.creditLimit || 0} Orders
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Package className="size-4 text-primary" />
              <h2 className="font-serif text-base sm:text-lg font-bold text-foreground">
                Order History
              </h2>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                {orders?.length || 0}
              </span>
            </div>
          </div>

          <DataTable
            columns={orderColumns}
            data={orders}
            keyExtractor={(row) => row?._id}
            onRowClick={(row) => router.push(ROUTES.ORDERS.DETAIL(row?._id))}
            emptyMessage="No orders placed yet."
          />
        </div>

        <ConfirmModal
          isOpen={showStatusConfirm}
          onClose={() => setShowStatusConfirm(false)}
          onConfirm={handleConfirmStatusChange}
          title={
            user?.isActive ? "Deactivate Account" : "Approve & Activate Account"
          }
          description={
            user?.isActive
              ? `Are you sure you want to deactivate ${user?.fullName}'s account? They will be logged out and cannot place orders.`
              : `Are you sure you want to approve and activate ${user?.fullName}'s account? They will be able to log in and place orders.`
          }
          confirmText={user?.isActive ? "Deactivate" : "Approve Account"}
          variant={user?.isActive ? "destructive" : "default"}
          isLoading={updateStatusMutation.isPending}
        />

        <EditCreditModal
          isOpen={showCreditModal}
          onClose={() => setShowCreditModal(false)}
          onConfirm={handleConfirmCreditChange}
          customerName={user?.fullName || "Customer"}
          initialAllowCredit={Boolean(user?.allowCredit)}
          initialCreditLimit={user?.creditLimit || 0}
          isLoading={updateCreditMutation.isPending}
        />
      </div>
    </QueryBoundary>
  );
}
