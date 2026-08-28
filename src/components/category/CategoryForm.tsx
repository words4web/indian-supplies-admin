"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/common/Input";
import { Loader } from "@/components/common/Loader";
import {
  CategoryFormValues,
  CategoryFormProps,
} from "@/types/category/category.types";
import { toSlug } from "@/lib/utils";

export function CategoryForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = "Save",
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    defaultValues: {
      name: "",
      slug: "",
      isActive: true,
      ...defaultValues,
    },
  });

  const nameValue = watch("name");
  const isEditing = !!defaultValues?.slug;

  useEffect(() => {
    if (!isEditing) {
      setValue("slug", toSlug(nameValue || ""), { shouldValidate: false });
    }
  }, [nameValue, isEditing, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      <Input
        id="name"
        label="Category Name"
        placeholder="e.g. Flours & Grains"
        className="h-14 text-base px-4"
        error={errors.name?.message}
        {...register("name", { required: "Name is required" })}
      />

      <Input
        id="slug"
        label="Slug"
        placeholder="e.g. flours-and-grains"
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

      <div className="flex items-center gap-3 py-1">
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

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-14 rounded-xl bg-primary text-primary-foreground text-lg font-extrabold hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer">
        {isLoading ? (
          <Loader size="sm" text="Creating..." className="animate-pulse" />
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}

export default CategoryForm;
