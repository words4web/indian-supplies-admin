"use client";

import Link from "next/link";
import { ArrowLeft, Check, Minus, Plus, ShoppingBasket } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/types/product/product.types";
import { useCart } from "@/hooks/useCart";
import { formatPounds } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ProductVisual } from "@/components/product-visual";

export function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  function add() {
    addItem(product, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-6xl px-5 py-8 lg:px-8">
        <Link
          href="/catalogue"
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary">
          <ArrowLeft className="size-4" /> Back to catalogue
        </Link>
        <div className="mt-8 grid gap-8 md:grid-cols-2 md:items-start">
          <div className="overflow-hidden rounded-3xl border border-border">
            <ProductVisual product={product} large />
          </div>
          <div className="pt-2">
            <p className="text-sm font-bold uppercase tracking-[.14em] text-primary">
              {product.categoryName}
            </p>
            <h1 className="mt-3 font-serif text-4xl font-extrabold tracking-tight md:text-5xl">
              {product.name}
            </h1>
            <p className="mt-4 text-base leading-7 text-muted-foreground">
              A dependable wholesale pack for your business. Confirm the
              quantity you need and tell us where to deliver it at checkout.
            </p>
            <div className="mt-8 rounded-2xl border border-border bg-card p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="font-serif text-3xl font-extrabold">
                    {formatPounds(product.price)}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Guide price per pack
                  </p>
                </div>
                <p className="rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-secondary-foreground">
                  {product.pack ?? "Wholesale pack"}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex items-center rounded-xl border border-input">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-muted"
                    aria-label="Decrease quantity">
                    <Minus className="size-4" />
                  </button>
                  <span className="min-w-10 text-center text-sm font-bold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(99, quantity + 1))}
                    className="p-3 hover:bg-muted"
                    aria-label="Increase quantity">
                    <Plus className="size-4" />
                  </button>
                </div>
                <Button className="flex-1" size="lg" onClick={add}>
                  {added ? <Check /> : <ShoppingBasket />}
                  {added ? "Added to basket" : "Add to basket"}
                </Button>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary">
              <Check className="size-4" /> Available to order
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
