import { ProductGrid } from "@/components/product-card";

export function ProductsSection({ products }: { products: any[] }) {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
      <div className="mb-7 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[.14em] text-primary">
            Ready to order
          </p>
          <h2 className="mt-2 font-serif text-3xl font-extrabold tracking-tight">
            Popular wholesale picks
          </h2>
        </div>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
