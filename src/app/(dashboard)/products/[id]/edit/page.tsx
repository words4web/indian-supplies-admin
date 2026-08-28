"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useProductDetail,
  useUpdateProduct,
} from "@/services/product/product.hook";
import { ProductForm } from "@/components/product/ProductForm";
import { ProductFormValues } from "@/types/product/product.types";
import { Loader } from "@/components/common/Loader";
import { ErrorView } from "@/components/common/ErrorView";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, isError, error, refetch } = useProductDetail(id);
  const { mutate: updateProduct, isPending } = useUpdateProduct();

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

  const handleSubmit = (values: ProductFormValues) => {
    updateProduct(
      { id, payload: values },
      { onSuccess: () => router.push(ROUTES.PRODUCTS) },
    );
  };

  const formattedDefaultValues: Partial<ProductFormValues> = {
    name: product?.name,
    slug: product?.slug,
    pack: product?.pack,
    price: product?.price,
    categoryId:
      typeof product?.categoryId === "object"
        ? product?.categoryId?._id
        : product?.categoryId,
    isVatApplicable: product?.isVatApplicable,
    isActive: product?.isActive,
  };

  return (
    <>
      <PageHeader
        title="Edit Product"
        subtitle={product?.name}
        backHref={`${ROUTES.PRODUCTS}/${id}`}
      />
      <div className="flex flex-col items-center justify-center min-h-[55vh]">
        <div className="w-full max-w-lg">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <ProductForm
              defaultValues={formattedDefaultValues}
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
