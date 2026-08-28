export interface ProductRow {
  _id: string;
  name: string;
  slug: string;
  pack: string;
  price: number;
  categoryId:
    | {
        _id: string;
        name: string;
      }
    | string;
  isVatApplicable: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPayload {
  name: string;
  slug: string;
  pack: string;
  price: number;
  categoryId: string;
  isVatApplicable?: boolean;
  isActive?: boolean;
}

export interface ProductFormValues {
  name: string;
  slug: string;
  pack: string;
  price: number;
  categoryId: string;
  isVatApplicable: boolean;
  isActive: boolean;
}

export interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (values: ProductFormValues) => void;
  isLoading?: boolean;
  submitLabel?: string;
}
