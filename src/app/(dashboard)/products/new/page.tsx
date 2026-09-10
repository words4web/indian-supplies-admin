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
      onSuccess: () => router.back(),
    });
  };

  return (
    <>
      <PageHeader
        title="New Product"
        subtitle="Create a new product listing"
        showBack={true}
        action={{
          label: "Create Product",
          type: "submit",
          form: "product-form",
          variant: "default",
          isLoading: isPending,
        }}
      />
      <div className="flex flex-col items-center justify-center min-h-[55vh]">
        <div className="w-full max-w-4xl">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <ProductForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </>
  );
}
