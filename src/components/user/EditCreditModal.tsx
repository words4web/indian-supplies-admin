"use client";

import React, { useRef, useEffect, useState } from "react";
import { X, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/common/Input";

interface EditCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { allowCredit: boolean; creditLimit: number }) => void;
  customerName: string;
  initialAllowCredit: boolean;
  initialCreditLimit: number;
  isLoading?: boolean;
}

export function EditCreditModal({
  isOpen,
  onClose,
  onConfirm,
  customerName,
  initialAllowCredit,
  initialCreditLimit,
  isLoading = false,
}: EditCreditModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [allowCredit, setAllowCredit] = useState(initialAllowCredit);
  const [creditLimit, setCreditLimit] = useState(String(initialCreditLimit));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setAllowCredit(initialAllowCredit);
    setCreditLimit(String(initialCreditLimit));
    setError(null);
  }, [initialAllowCredit, initialCreditLimit, isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      e.preventDefault();
      if (!isLoading) {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (isLoading) return;
      if (e.target === dialog) {
        const rect = dialog.getBoundingClientRect();
        const isInside =
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width;
        if (!isInside) {
          onClose();
        }
      }
    };

    dialog.addEventListener("cancel", handleCancel);
    dialog.addEventListener("click", handleClickOutside);

    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      dialog.removeEventListener("click", handleClickOutside);
    };
  }, [onClose, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const limitNum = parseInt(creditLimit, 10);

    if (allowCredit) {
      if (isNaN(limitNum)) {
        setError("Please enter a valid credit limit.");
        return;
      }
      if (limitNum < 0 || limitNum > 100) {
        setError("Credit limit must be between 0 and 100.");
        return;
      }
    }

    setError(null);
    onConfirm({
      allowCredit,
      creditLimit: allowCredit ? limitNum : 0,
    });
  };

  return (
    <dialog
      ref={dialogRef}
      className="fixed inset-0 m-auto w-full max-w-md h-fit rounded-2xl border border-border bg-card p-6 shadow-xl backdrop:bg-black/60 backdrop:backdrop-blur-sm text-card-foreground focus:outline-none animate-in fade-in zoom-in-95 duration-200">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold tracking-tight">
                Credit Account Settings
              </h3>
              <p className="text-xs text-muted-foreground truncate">
                Customer: {customerName}
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg text-muted-foreground"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close dialog">
            <X className="size-4" />
          </Button>
        </div>

        <div className="space-y-4 rounded-xl border border-border/70 bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <div>
              <label
                htmlFor="allow-credit-toggle"
                className="text-sm font-semibold text-foreground cursor-pointer">
                Enable Credit Purchases
              </label>
              <p className="text-xs text-muted-foreground">
                Allow customer to place orders on credit terms
              </p>
            </div>
            <input
              id="allow-credit-toggle"
              type="checkbox"
              checked={allowCredit}
              onChange={(e) => {
                setAllowCredit(e.target.checked);
                setError(null);
              }}
              className="size-5 rounded border-input text-primary focus:ring-primary/20 cursor-pointer accent-primary"
            />
          </div>

          <div className="pt-2 border-t border-border/50">
            <Input
              label="Credit Purchase Limit (Orders)"
              id="credit-limit"
              type="number"
              min={0}
              max={100}
              value={creditLimit}
              onChange={(e) => {
                setCreditLimit(e.target.value);
                setError(null);
              }}
              placeholder="e.g. 5"
              disabled={!allowCredit || isLoading}
            />
            <p className="text-[11px] text-muted-foreground mt-1">
              Maximum credit orders allowed (0 – 100).
            </p>
            {error && (
              <div className="flex items-center gap-1.5 text-xs text-destructive mt-1.5 font-medium">
                <AlertCircle className="size-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </form>
    </dialog>
  );
}
