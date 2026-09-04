import { DropdownOption } from "@/components/common/PaginatedDropdown";

export interface RelatedProductItem {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  pack?: string;
  price?: number;
}

export interface ProductRow {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  pack: string;
  price: number;
  categoryId:
    | {
        _id: string;
        name: string;
      }
    | string;
  relatedProducts?: RelatedProductItem[] | string[];
  isVatApplicable: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPayload {
  name: string;
  slug: string;
  description?: string;
  pack: string;
  price: number;
  categoryId: string;
  relatedProducts?: string[];
  isVatApplicable?: boolean;
  isActive?: boolean;
}

export interface ProductFormValues {
  name: string;
  slug: string;
  description?: string;
  pack: string;
  price: number;
  categoryId: string;
  relatedProducts: string[];
  isVatApplicable: boolean;
  isActive: boolean;
}

export interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>;
  initialRelatedOptions?: DropdownOption[];
  currentProductId?: string;
  onSubmit: (values: ProductFormValues) => void;
  isLoading?: boolean;
  submitLabel?: string;
}
