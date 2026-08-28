"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCreateProduct } from "@/services/product/product.hook";
import { ProductForm } from "@/components/product/ProductForm";
import { ProductFormValues } from "@/types/product/product.types";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";

export default function NewProductPage() {
  const router = useRouter();
  const { mutate: createProduct, isPending } = useCreateProduct();

  const handleSubmit = (values: ProductFormValues) => {
    createProduct(values, {
      onSuccess: () => router.push(ROUTES.PRODUCTS),
    });
  };

  return (
    <>
      <PageHeader
        title="New Product"
        subtitle="Create a new product listing"
        backHref={ROUTES.PRODUCTS}
      />
      <div className="flex flex-col items-center justify-center min-h-[55vh]">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <ProductForm
              onSubmit={handleSubmit}
              isLoading={isPending}
              submitLabel="Create Product"
            />
          </div>
        </div>
      </div>
    </>
  );
}
