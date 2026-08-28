import { Clock3, ShieldCheck, Truck } from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="border-t border-border/70 bg-card">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-10 sm:grid-cols-3 lg:px-8">
        <div className="flex gap-3">
          <Truck className="mt-1 size-5 text-primary" />
          <div>
            <p className="font-bold">Delivery arranged</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Share your address at checkout and we&apos;ll confirm a delivery
              slot.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Clock3 className="mt-1 size-5 text-primary" />
          <div>
            <p className="font-bold">Quick responses</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              We&apos;ll review your order and get back to you promptly.
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <ShieldCheck className="mt-1 size-5 text-primary" />
          <div>
            <p className="font-bold">Built for trade</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Clear pack sizes and simple reordering for your business.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
