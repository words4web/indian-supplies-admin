export interface CategoryRow {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryPayload {
  name: string;
  slug: string;
  isActive?: boolean;
}

export interface CategoryFormValues {
  name: string;
  slug: string;
  isActive: boolean;
}

export interface CategoryFormProps {
  defaultValues?: Partial<CategoryFormValues>;
  onSubmit: (values: CategoryFormValues) => void;
  isLoading?: boolean;
  submitLabel?: string;
}
