"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useCategoryDetail,
  useUpdateCategory,
} from "@/services/category/category.hook";
import { CategoryForm } from "@/components/category/CategoryForm";
import { CategoryFormValues } from "@/types/category/category.types";
import { QueryBoundary } from "@/components/common/QueryBoundary";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, isError, error, refetch } = useCategoryDetail(id);
  const { mutate: updateCategory, isPending } = useUpdateCategory();

  const category = data?.data;

  const handleSubmit = (values: CategoryFormValues) => {
    updateCategory(
      { id, payload: values },
      { onSuccess: () => router.push(ROUTES.CATEGORIES) },
    );
  };

  return (
    <QueryBoundary
      isLoading={isLoading}
      isError={isError}
      error={error}
      refetch={refetch}
      hasData={!!category}
      notFoundMessage="Category not found.">
      <PageHeader
        title="Edit Category"
        subtitle={category?.name}
        backHref={`${ROUTES.CATEGORIES}/${id}`}
      />
      <div className="flex flex-col items-center justify-center min-h-[55vh]">
        <div className="w-full max-w-xl">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <CategoryForm
              defaultValues={{
                name: category?.name,
                slug: category?.slug,
                isActive: category?.isActive,
              }}
              onSubmit={handleSubmit}
              isLoading={isPending}
              submitLabel="Save Changes"
            />
          </div>
        </div>
      </div>
    </QueryBoundary>
  );
}
