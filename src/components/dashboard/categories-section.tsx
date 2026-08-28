import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { CategoryVisual } from "@/components/product-visual";

interface CategoryItem {
  id: string;
  name: string;
  productCount: number;
}

interface CategoriesSectionProps {
  categories: CategoryItem[];
}

export function CategoriesSection({ categories }: CategoriesSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.14em] text-primary">
            Shop by need
          </p>
          <h2 className="mt-2 font-serif text-3xl font-extrabold tracking-tight">
            Browse categories
          </h2>
        </div>
        <Link
          href="/catalogue"
          className="hidden items-center gap-1 text-sm font-bold text-primary hover:underline sm:flex">
          View all <ChevronRight className="size-4" />
        </Link>
      </div>
      <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
        {categories.slice(0, 8).map((category, index) => (
          <Link
            key={category.id}
            href={`/catalogue?category=${category.id}`}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-secondary/40">
            <CategoryVisual category={category} index={index} />
            <span className="min-w-0">
              <span className="block truncate text-sm font-bold">
                {category.name}
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                {category.productCount} items
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
