"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useCategoryDetail,
  useUpdateCategory,
} from "@/services/category/category.hook";
import { CategoryForm } from "@/components/category/CategoryForm";
import { CategoryFormValues } from "@/types/category/category.types";
import { Loader } from "@/components/common/Loader";
import { ErrorView } from "@/components/common/ErrorView";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, isError, error, refetch } = useCategoryDetail(id);
  const { mutate: updateCategory, isPending } = useUpdateCategory();

  const category = data?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader size="lg" />
      </div>
    );
  }

  if (isError || !category) {
    return (
      <ErrorView
        message={
          (error as any)?.response?.data?.message ?? "Category not found."
        }
        onRetry={refetch}
        className="mt-8"
      />
    );
  }

  const handleSubmit = (values: CategoryFormValues) => {
    updateCategory(
      { id, payload: values },
      { onSuccess: () => router.push(ROUTES.CATEGORIES) },
    );
  };

  return (
    <>
      <PageHeader
        title="Edit Category"
        subtitle={category.name}
        backHref={`${ROUTES.CATEGORIES}/${id}`}
      />
      <div className="flex flex-col items-center justify-center min-h-[55vh]">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <CategoryForm
              defaultValues={{
                name: category.name,
                slug: category.slug,
                isActive: category.isActive,
              }}
              onSubmit={handleSubmit}
              isLoading={isPending}
              submitLabel="Save Changes"
            />
          </div>
        </div>
      </div>
    </>
  );
}
