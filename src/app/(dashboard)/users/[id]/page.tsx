"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Mail,
  MapPin,
  PackageCheck,
  Phone,
  User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/Loader";
import { ErrorView } from "@/components/common/ErrorView";
import { useUserDetailQuery } from "@/services/user/user.hook";
import { formatPounds } from "@/lib/format";
import { ROUTES } from "@/constants/routes";

export default function UserDetailPage() {
  const params = useParams();
  const router = useRouter();
  const userId = params?.id as string;

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

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <Loader text="Loading User Details..." />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => router.push(ROUTES.USERS)}
          className="inline-flex items-center gap-2 text-sm font-semibold">
          <ArrowLeft className="h-4 w-4" /> Back to users
        </Button>
        <ErrorView
          message={error?.message || "User details not found"}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push(ROUTES.USERS)}
          className="inline-flex items-center gap-2 text-sm font-semibold -ml-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to users list
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-4 pb-4 border-b border-border">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserIcon className="size-7" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">
              {user.fullName}
            </h1>
            <p className="text-sm font-medium text-muted-foreground">
              {user.businessName
                ? `Business: ${user.businessName}`
                : "Individual Customer"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/30 p-3.5">
            <Mail className="size-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Email Address
              </p>
              <p className="font-semibold text-foreground">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/30 p-3.5">
            <Phone className="size-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Mobile Number
              </p>
              <p className="font-semibold font-mono text-foreground">
                {user.mobileNumber || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/30 p-3.5">
            <Building2 className="size-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Business Name
              </p>
              <p className="font-semibold text-foreground">
                {user.businessName || "N/A"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/30 p-3.5">
            <Calendar className="size-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground font-medium">
                Account Created
              </p>
              <p className="font-semibold text-foreground">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="font-serif text-xl font-bold text-foreground">
          Saved Delivery Addresses ({user.addresses?.length || 0})
        </h2>
        {user.addresses?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.addresses.map((addr: any) => (
              <div
                key={addr._id}
                className="flex items-start gap-3 rounded-xl border border-border/60 p-4 bg-background">
                <MapPin className="size-5 text-primary shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-sm text-foreground">
                    {addr.fullName}
                  </p>
                  <p className="text-muted-foreground">
                    {addr.building ? `${addr.building}, ` : ""}
                    {addr.streetAddress}
                  </p>
                  <p className="text-muted-foreground">
                    {addr.city}, {addr.postalCode}
                  </p>
                  <p className="text-muted-foreground font-mono">
                    Phone: {addr.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            No addresses saved yet.
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h2 className="font-serif text-xl font-bold text-foreground">
          Order History ({orders.length})
        </h2>

        {orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/40 text-xs uppercase font-semibold text-muted-foreground">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {orders.map((ord: any) => (
                  <tr
                    key={ord._id}
                    className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-serif font-bold text-foreground">
                      {ord.orderId}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                          ord.status === "DELIVERED"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        }`}>
                        {ord.status === "DELIVERED"
                          ? "Delivered"
                          : "In Process"}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-serif font-extrabold text-foreground">
                      {formatPounds(ord.total)}
                    </td>
                    <td className="py-3 px-4 text-xs text-muted-foreground">
                      {new Date(ord.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={ROUTES.ORDER_DETAIL(ord._id)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                        View Order
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center border border-dashed border-border rounded-xl">
            <PackageCheck className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-2 text-sm font-semibold text-foreground">
              No orders placed yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
