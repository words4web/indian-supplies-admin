import {
  Box,
  CupSoda,
  Droplets,
  Flame,
  Package,
  Snowflake,
  Sprout,
  Waves,
} from "lucide-react";
import type { Product } from "@/types/product/product.types";

const icons = [
  Sprout,
  Droplets,
  Flame,
  Package,
  Snowflake,
  CupSoda,
  Waves,
  Box,
];
const tones = [
  "from-emerald-100 to-lime-50 text-emerald-700",
  "from-sky-100 to-cyan-50 text-sky-700",
  "from-amber-100 to-orange-50 text-orange-700",
  "from-violet-100 to-fuchsia-50 text-violet-700",
  "from-teal-100 to-emerald-50 text-teal-700",
  "from-rose-100 to-pink-50 text-rose-700",
  "from-blue-100 to-indigo-50 text-blue-700",
  "from-yellow-100 to-amber-50 text-amber-700",
];

function toneIndex(value: string) {
  return (
    [...value].reduce((sum, character) => sum + character.charCodeAt(0), 0) %
    tones.length
  );
}

export function ProductVisual({
  product,
  large = false,
}: {
  product: Product;
  large?: boolean;
}) {
  const index = toneIndex(product.categoryId + product.id);
  const Icon = icons[index];
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${tones[index]} ${large ? "min-h-72 md:min-h-96" : "aspect-[1.2]"}`}
      role="img"
      aria-label={`${product.name} product illustration`}>
      <span className="absolute left-4 top-4 rounded-full bg-background/75 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground/60">
        Indian Supplies
      </span>
      <Icon
        className={large ? "size-24 opacity-80" : "size-14 opacity-80"}
        strokeWidth={1.25}
      />
    </div>
  );
}

export function CategoryVisual({
  category,
  index = 0,
}: {
  category: { id: string; name: string };
  index?: number;
}) {
  const tone = (toneIndex(category.id) + index) % tones.length;
  const Icon = icons[tone];
  return (
    <div
      className={`flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tones[tone]}`}
      aria-hidden="true">
      <Icon className="size-6" strokeWidth={1.5} />
    </div>
  );
}
