"use client";

import { useParams, useRouter } from "next/navigation";
import {
  useProductDetail,
  useUpdateProduct,
} from "@/services/product/product.hook";
import { ProductForm } from "@/components/product/ProductForm";
import { ProductFormValues } from "@/types/product/product.types";
import { QueryBoundary } from "@/components/common/QueryBoundary";
import { PageHeader } from "@/components/common/PageHeader";
import { ROUTES } from "@/constants/routes";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, isError, error, refetch } = useProductDetail(id);
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  const product = data?.data;

  const handleSubmit = (values: ProductFormValues) => {
    updateProduct(
      { id, payload: values },
      { onSuccess: () => router.push(ROUTES.PRODUCTS) },
    );
  };

  const formattedDefaultValues: Partial<ProductFormValues> = {
    name: product?.name,
    slug: product?.slug,
    description: product?.description || "",
    pack: product?.pack,
    price: product?.price,
    categoryId:
      typeof product?.categoryId === "object"
        ? product?.categoryId?._id
        : product?.categoryId,
    relatedProducts: Array.isArray(product?.relatedProducts)
      ? product?.relatedProducts?.map((p: any) =>
          typeof p === "object" ? p?._id : p,
        )
      : [],
    isVatApplicable: product?.isVatApplicable,
    isActive: product?.isActive,
  };

  const initialRelatedOptions = Array.isArray(product?.relatedProducts)
    ? product?.relatedProducts
        ?.filter((p: any) => typeof p === "object" && p?._id && p?.name)
        ?.map((p: any) => ({ value: p._id, label: p.name }))
    : [];

  return (
    <QueryBoundary
      isLoading={isLoading}
      isError={isError}
      error={error}
      refetch={refetch}
      hasData={!!product}
      notFoundMessage="Product not found.">
      <PageHeader
        title="Edit Product"
        subtitle={product?.name}
        backHref={`${ROUTES.PRODUCTS}/${id}`}
      />
      <div className="flex flex-col items-center justify-center min-h-[55vh]">
        <div className="w-full max-w-4xl">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            <ProductForm
              defaultValues={formattedDefaultValues}
              initialRelatedOptions={initialRelatedOptions}
              currentProductId={id || product?._id}
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
