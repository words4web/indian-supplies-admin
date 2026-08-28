"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/common/Input";
import { Loader } from "@/components/common/Loader";
import { useCategories } from "@/services/category/category.hook";
import {
  ProductFormProps,
  ProductFormValues,
} from "@/types/product/product.types";
import { toSlug } from "@/lib/utils";

export function ProductForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = "Save",
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      slug: "",
      pack: "",
      price: 0,
      categoryId: "",
      isVatApplicable: false,
      isActive: true,
      ...defaultValues,
    },
  });

  const { data: categoriesData, isLoading: isLoadingCategories } =
    useCategories({
      limit: 100,
      isActive: true,
    });
  const categories = categoriesData?.data?.categories || [];

  const nameValue = watch("name");
  const isEditing = !!defaultValues?.slug;

  useEffect(() => {
    if (!isEditing) {
      setValue("slug", toSlug(nameValue || ""), { shouldValidate: false });
    }
  }, [nameValue, isEditing, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        id="name"
        label="Product Name"
        placeholder="e.g. Basmati Rice Extra Long"
        error={errors.name?.message}
        {...register("name", { required: "Name is required" })}
      />

      <Input
        id="slug"
        label="Slug"
        placeholder="e.g. basmati-rice-extra-long"
        error={errors.slug?.message}
        {...register("slug", {
          required: "Slug is required",
          pattern: {
            value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            message: "Slug must be lowercase alphanumeric with hyphens only",
          },
        })}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          id="pack"
          label="Pack Size / Weight"
          placeholder="e.g. 5kg, 12x400g"
          error={errors.pack?.message}
          {...register("pack", { required: "Pack size is required" })}
        />

        <Input
          id="price"
          type="number"
          step="1"
          min={0}
          label="Price (£)"
          placeholder="e.g. 12.99"
          error={errors.price?.message}
          {...register("price", {
            required: "Price is required",
            valueAsNumber: true,
            min: { value: 0, message: "Price cannot be negative" },
          })}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="categoryId"
          className="text-sm font-bold text-foreground">
          Category
        </label>
        {isLoadingCategories ? (
          <div className="h-11 flex items-center px-3 border border-input bg-background rounded-xl">
            <Loader size="sm" className="mr-2" /> Loading categories...
          </div>
        ) : (
          <select
            id="categoryId"
            className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary"
            {...register("categoryId", { required: "Category is required" })}>
            <option value="">Select a Category</option>
            {categories.map((category: any) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        )}
        {errors.categoryId && (
          <p
            className="text-xs font-semibold text-destructive mt-0.5"
            role="alert">
            {errors.categoryId.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <input
            id="isVatApplicable"
            type="checkbox"
            className="size-4 rounded border-input accent-primary"
            {...register("isVatApplicable")}
          />
          <label
            htmlFor="isVatApplicable"
            className="text-sm font-medium text-foreground">
            VAT Applicable
          </label>
        </div>

        <div className="flex items-center gap-3">
          <input
            id="isActive"
            type="checkbox"
            className="size-4 rounded border-input accent-primary"
            {...register("isActive")}
          />
          <label
            htmlFor="isActive"
            className="text-sm font-medium text-foreground">
            Active
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
        {isLoading && <Loader size="sm" />}
        {submitLabel}
      </button>
    </form>
  );
}

export default ProductForm;
