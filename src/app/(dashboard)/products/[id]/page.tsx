"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Pencil,
  Package,
  ToggleLeft,
  ToggleRight,
  Calendar,
} from "lucide-react";
import { useProductDetail } from "@/services/product/product.hook";
import { Loader } from "@/components/common/Loader";
import { ErrorView } from "@/components/common/ErrorView";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, isError, error, refetch } = useProductDetail(id);
  const product = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <ErrorView
        message={
          (error as any)?.response?.data?.message ?? "Product not found."
        }
        onRetry={refetch}
        className="mt-8"
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-3">
        <PageHeader
          title={product?.name}
          subtitle={product?.slug}
          backHref={ROUTES.PRODUCTS}
        />
        <div className="flex items-center gap-2 flex-shrink-0 pt-1">
          <button
            id="edit-product-btn"
            onClick={() => router.push(`${ROUTES.PRODUCTS}/${id}/edit`)}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-border hover:bg-muted transition-colors text-sm font-medium">
            <Pencil className="size-4" />
            Edit
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
        <div className="flex items-start gap-4">
          <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Package className="size-6 text-primary" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Product Name
            </p>
            <p className="text-lg font-semibold text-foreground mt-0.5">
              {product?.name}
            </p>
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Price
            </p>
            <p className="text-xl font-bold text-foreground mt-1">
              £{product?.price?.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Pack Size
            </p>
            <p className="text-sm font-semibold text-foreground mt-1 bg-muted px-3 py-2 rounded-lg inline-block">
              {product?.pack}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Category
            </p>
            <p className="text-sm text-foreground mt-1 font-medium">
              {typeof product?.categoryId === "object"
                ? product.categoryId?.name
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              VAT Applicable
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  product?.isVatApplicable
                    ? "bg-amber-500/10 text-amber-600"
                    : "bg-muted text-muted-foreground"
                }`}>
                {product?.isVatApplicable
                  ? "Yes (Standard rate)"
                  : "No (Zero rated)"}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Status
            </p>
            <div className="flex items-center gap-2 mt-1">
              {product?.isActive ? (
                <ToggleRight className="size-5 text-emerald-500" />
              ) : (
                <ToggleLeft className="size-5 text-muted-foreground" />
              )}
              <span
                className={`text-sm font-semibold ${product?.isActive ? "text-emerald-600" : "text-muted-foreground"}`}>
                {product?.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Created
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="size-4 text-muted-foreground" />
              <span className="text-sm text-foreground">
                {new Date(product?.createdAt)?.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
