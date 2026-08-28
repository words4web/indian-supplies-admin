import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, className = "", containerClassName = "", id, ...props },
    ref,
  ) => {
    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label htmlFor={id} className="text-sm font-bold text-foreground">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal outline-none transition-all placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
          {...props}
        />
        {error && (
          <p
            className="text-xs font-semibold text-destructive mt-0.5"
            role="alert">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
