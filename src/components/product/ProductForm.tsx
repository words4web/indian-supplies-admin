import { useEffect, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/common/Input";
import { Loader } from "@/components/common/Loader";
import { useCategories } from "@/services/category/category.hook";
import { productService } from "@/services/product/product.service";
import {
  PaginatedDropdown,
  DropdownOption,
} from "@/components/common/PaginatedDropdown";
import {
  ProductFormProps,
  ProductFormValues,
} from "@/types/product/product.types";
import { toSlug } from "@/lib/utils";

export function ProductForm({
  defaultValues,
  initialRelatedOptions,
  currentProductId,
  onSubmit,
  isLoading,
  submitLabel = "Save",
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      pack: "",
      price: 0,
      categoryId: "",
      relatedProducts: [],
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

  const fetchProductsOptions = useCallback(
    async ({
      search,
      page,
      limit,
    }: {
      search: string;
      page: number;
      limit: number;
    }) => {
      const res = await productService.list({ search, page, limit });
      const products = res?.data?.products || [];
      const total = res?.data?.total || 0;
      const options: DropdownOption[] = products
        ?.filter((p: any) => p?._id !== currentProductId)
        ?.map((p: any) => ({
          value: p?._id,
          label: p?.name,
        }));

      return {
        options,
        hasMore: page * limit < total,
      };
    },
    [currentProductId],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          id="name"
          label="Product Name"
          placeholder="e.g. Basmati Rice Extra Long"
          className="h-14 text-base px-4"
          error={errors.name?.message}
          {...register("name", { required: "Name is required" })}
        />

        <Input
          id="slug"
          label="Slug"
          placeholder="e.g. basmati-rice-extra-long"
          className="h-14 text-base px-4"
          error={errors.slug?.message}
          {...register("slug", {
            required: "Slug is required",
            pattern: {
              value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
              message: "Slug must be lowercase alphanumeric with hyphens only",
            },
          })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          id="pack"
          label="Pack Size / Weight"
          placeholder="e.g. 5kg, 12x400g"
          className="h-14 text-base px-4"
          error={errors.pack?.message}
          {...register("pack", { required: "Pack size is required" })}
        />

        <Input
          id="price"
          type="number"
          step="0.01"
          min={0}
          label="Price (£)"
          placeholder="e.g. 12.99"
          className="h-14 text-base px-4"
          error={errors.price?.message}
          {...register("price", {
            required: "Price is required",
            valueAsNumber: true,
            min: { value: 0, message: "Price cannot be negative" },
          })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="categoryId"
            className="text-base font-bold text-foreground">
            Category
          </label>
          {isLoadingCategories ? (
            <div className="h-14 flex items-center px-4 border border-input bg-background rounded-xl text-base">
              <Loader size="sm" className="mr-2" /> Loading categories...
            </div>
          ) : (
            <select
              id="categoryId"
              className="h-14 w-full rounded-xl border border-input bg-background px-4 text-base font-normal outline-none transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
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

        <div className="flex items-center gap-8 h-14 md:mt-8">
          <div className="flex items-center gap-3">
            <input
              id="isVatApplicable"
              type="checkbox"
              className="size-5 rounded border-input accent-primary cursor-pointer"
              {...register("isVatApplicable")}
            />
            <label
              htmlFor="isVatApplicable"
              className="text-base font-semibold text-foreground cursor-pointer select-none">
              VAT Applicable
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="isActive"
              type="checkbox"
              className="size-5 rounded border-input accent-primary cursor-pointer"
              {...register("isActive")}
            />
            <label
              htmlFor="isActive"
              className="text-base font-semibold text-foreground cursor-pointer select-none">
              Active
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-base font-bold text-foreground">
          Related Products (Optional)
        </label>
        <Controller
          name="relatedProducts"
          control={control}
          render={({ field }) => (
            <PaginatedDropdown
              value={field.value || []}
              onChange={field.onChange}
              fetchData={fetchProductsOptions}
              initialOptions={initialRelatedOptions}
              placeholder="Search & select related products..."
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="description"
          className="text-base font-bold text-foreground">
          Description (Optional)
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder="Enter a detailed product description, ingredients, or notes..."
          className="w-full rounded-xl border border-input bg-background p-4 text-base font-normal outline-none transition-all placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary"
          {...register("description")}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-14 rounded-xl bg-primary text-primary-foreground text-lg font-extrabold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer">
        {isLoading ? (
          <Loader size="sm" text="Saving..." className="animate-pulse" />
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}

export default ProductForm;
