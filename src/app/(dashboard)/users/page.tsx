"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Search, UserCheck, Users } from "lucide-react";
import { useUsersQuery } from "@/services/user/user.hook";
import { DataTable, TableColumn } from "@/components/common/DataTable";
import { Loader } from "@/components/common/Loader";
import { ErrorView } from "@/components/common/ErrorView";
import { Pagination } from "@/components/common/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { ROUTES } from "@/constants/routes";

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);

  const {
    data: responseBody,
    isLoading,
    isError,
    error,
    refetch,
  } = useUsersQuery({
    page,
    limit: 10,
    search: debouncedSearch,
  });

  const users = responseBody?.data || [];
  const meta = responseBody?.meta || { totalPages: 1 };

  const columns: TableColumn<any>[] = [
    {
      key: "fullName",
      header: "Customer Name",
      render: (row) => (
        <div>
          <span className="font-semibold text-foreground">{row.fullName}</span>
          <p className="text-xs text-muted-foreground">{row.email}</p>
        </div>
      ),
    },
    {
      key: "businessName",
      header: "Business Name",
      render: (row) => (
        <span className="font-medium text-foreground">
          {row.businessName || "N/A"}
        </span>
      ),
    },
    {
      key: "mobileNumber",
      header: "Mobile Number",
      render: (row) => (
        <span className="text-sm font-mono text-muted-foreground">
          {row.mobileNumber || "N/A"}
        </span>
      ),
    },
    {
      key: "addresses",
      header: "Saved Addresses",
      render: (row) => (
        <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
          {row.addresses?.length || 0} address(es)
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Joined Date",
      render: (row) => (
        <span className="text-xs text-muted-foreground">
          {row.createdAt
            ? new Date(row.createdAt).toLocaleDateString("en-GB", {
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
      className: "text-right",
      render: (row) => (
        <div className="flex justify-end">
          <Link
            href={ROUTES.USER_DETAIL(row._id)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary">
            <Eye className="size-3.5" /> View Details
          </Link>
        </div>
      ),
    },
  ];

  if (isLoading) return <Loader text="Loading Retailer Accounts..." />;
  if (isError)
    return (
      <ErrorView
        message={error?.message || "Failed to load retailer accounts"}
        onRetry={refetch}
      />
    );

  return (
    <div className="space-y-6 w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-extrabold tracking-tight text-foreground">
            Retailer Accounts
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage wholesale customers, business profiles, and account details.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, business, email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-border bg-card pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <DataTable
          columns={columns}
          data={users}
          keyExtractor={(row) => row._id}
          emptyMessage={
            searchTerm
              ? "No retailer accounts match your search filter."
              : "No registered wholesale customer accounts found."
          }
        />

        {meta.totalPages > 1 && (
          <div className="mt-6 flex justify-end">
            <Pagination
              page={page}
              totalPages={meta.totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
