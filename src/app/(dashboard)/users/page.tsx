"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye } from "lucide-react";
import { useUsersQuery } from "@/services/user/user.hook";
import { DataTable, TableColumn } from "@/components/common/DataTable";
import { PageHeader } from "@/components/common/PageHeader";
import { PageFilters } from "@/components/common/PageFilters";
import { QueryBoundary } from "@/components/common/QueryBoundary";
import { Pagination } from "@/components/common/Pagination";
import { ROUTES } from "@/constants/routes";

const LIMIT = 10;

export default function UsersPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: responseBody,
    isFetching,
    isError,
    error,
    refetch,
  } = useUsersQuery({
    page,
    limit: LIMIT,
    search: searchTerm?.trim() || undefined,
  });

  const users = responseBody?.data || [];
  const meta = responseBody?.meta || { totalPages: 1, total: 0 };
  const total = meta?.totalCount || meta?.total || users.length;
  const totalPages = meta?.totalPages || Math.ceil(total / LIMIT) || 1;

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
      className: "text-right w-24",
      render: (row) => (
        <div className="flex justify-end">
          <Link
            href={ROUTES.USERS.DETAIL(row?._id)}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary">
            <Eye className="size-3.5" /> View
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Accounts"
        subtitle={`${total} ${total === 1 ? "account" : "accounts"} total`}
      />

      <PageFilters
        searchQuery={searchTerm}
        onSearchChange={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
        searchPlaceholder="Search by name, business, email..."
        onClearFilters={() => {
          setSearchTerm("");
          setPage(1);
        }}
        hasActiveFilters={!!searchTerm}
      />

      <QueryBoundary
        isLoading={false}
        isError={isError}
        error={error}
        refetch={refetch}
        hasData={true}
        notFoundMessage="Failed to load customer accounts.">
        <DataTable
          columns={columns}
          data={users}
          isLoading={isFetching}
          skeletonCount={LIMIT}
          keyExtractor={(row) => row._id}
          onRowClick={(row) => router.push(ROUTES.USERS.DETAIL(row._id))}
          emptyMessage={
            searchTerm
              ? "No customer accounts match your search filter."
              : "No registered customer accounts found."
          }
        />

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          isLoading={isFetching}
        />
      </QueryBoundary>
    </div>
  );
}
