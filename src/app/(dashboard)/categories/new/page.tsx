"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCreateCategory } from "@/services/category/category.hook";
import { CategoryForm } from "@/components/category/CategoryForm";
import { CategoryFormValues } from "@/types/category/category.types";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";

export default function NewCategoryPage() {
  const router = useRouter();
  const { mutate: createCategory, isPending } = useCreateCategory();

  const handleSubmit = (values: CategoryFormValues) => {
    createCategory(values, {
      onSuccess: () => router.push(ROUTES.CATEGORIES),
    });
  };

  return (
    <>
      <PageHeader
        title="New Category"
        subtitle="Create a new product category"
        backHref={ROUTES.CATEGORIES}
      />
      <div className="flex flex-col items-center justify-center min-h-[55vh]">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <CategoryForm
              onSubmit={handleSubmit}
              isLoading={isPending}
              submitLabel="Create Category"
            />
          </div>
        </div>
      </div>
    </>
  );
}
