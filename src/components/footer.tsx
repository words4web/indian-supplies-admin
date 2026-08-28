import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-border/70 bg-card text-card-foreground">
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-extrabold tracking-tight text-primary-foreground">
                IS
              </span>
              <div>
                <span className="block font-serif text-base font-extrabold tracking-tight">
                  Indian Supplies
                </span>
                <span className="block text-[11px] font-medium text-muted-foreground">
                  Wholesale food &amp; essentials
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your trusted wholesale partner for authentic Indian groceries,
              staples, and daily essentials. Designed specifically for trade and
              businesses.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/catalogue"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Catalogue
                </Link>
              </li>
              <li>
                <Link
                  href="/orders"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">
              Customer Service
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/delivery"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Delivery Information
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-foreground">
              Legal
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border/40 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Indian Supplies. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for trade and businesses.
          </p>
        </div>
      </div>
    </footer>
  );
}
