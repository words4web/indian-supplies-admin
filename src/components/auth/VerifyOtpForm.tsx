import React, { useState, useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function VerifyOtpForm({
  onSubmit,
  isPending,
  description,
}: {
  onSubmit: (otp: string) => void;
  isPending: boolean;
  description: string;
}) {
  const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (value: string, index: number) => {
    const val = value?.replace(/\D/g, "");
    if (!val) {
      const newOtpValues = [...otpValues];
      newOtpValues[index] = "";
      setOtpValues(newOtpValues);
      return;
    }

    const newOtpValues = [...otpValues];
    if (val.length > 1) {
      const pasted = val?.split("")?.slice(0, 6 - index);
      pasted?.forEach((char, i) => {
        newOtpValues[index + i] = char;
      });
      setOtpValues(newOtpValues);
      const nextIdx = Math.min(index + pasted?.length, 5);
      inputRefs.current[nextIdx]?.focus();

      const joinedOtp = newOtpValues.join("");
      if (joinedOtp.length === 6 && /^\d{6}$/.test(joinedOtp)) {
        onSubmit(joinedOtp);
      }
    } else {
      newOtpValues[index] = val;
      setOtpValues(newOtpValues);
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }

      const joinedOtp = newOtpValues.join("");
      if (joinedOtp.length === 6 && /^\d{6}$/.test(joinedOtp)) {
        onSubmit(joinedOtp);
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      if (!otpValues[index] && index > 0) {
        const newOtpValues = [...otpValues];
        newOtpValues[index - 1] = "";
        setOtpValues(newOtpValues);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtpValues = [...otpValues];
        newOtpValues[index] = "";
        setOtpValues(newOtpValues);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pastedData.length === 6) {
      setOtpValues(pastedData.split(""));
      inputRefs.current[5]?.focus();
      onSubmit(pastedData);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpValues.join("");
    if (!/^\d{6}$/.test(otp)) {
      toast.error("OTP must be exactly 6 digits.");
      return;
    }
    onSubmit(otp);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="mt-6 font-serif text-2xl font-bold">Verify OTP</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="flex gap-2 justify-between mt-7">
        {otpValues.map((val, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputRefs.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={val}
            onChange={(e) => handleChange(e.target.value, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            onPaste={handlePaste}
            className="w-12 h-12 text-center text-xl font-bold bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            required
          />
        ))}
      </div>

      <Button
        type="submit"
        className="mt-7 w-full"
        size="lg"
        disabled={isPending}>
        {isPending ? "Verifying..." : "Verify & Sign In"} <ArrowRight />
      </Button>
    </form>
  );
}

export default VerifyOtpForm;
