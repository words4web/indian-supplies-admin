import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLogin, useSignup, useVerifyOtp } from "@/services/auth/auth.hook";

export function useAuthFlow({ isLogin }: { isLogin: boolean }) {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const [timerEndTime, setTimerEndTime] = useState<number | null>(null);

  const loginMutation = useLogin({
    onSuccess: (_, variables) => {
      setEmail(variables.email);
      setStep("otp");
      setTimerEndTime(Date.now() + 60 * 1000);
    },
  });

  const signupMutation = useSignup({
    onSuccess: (_, variables) => {
      setEmail(variables.email);
      setStep("otp");
      setTimerEndTime(Date.now() + 60 * 1000);
    },
  });

  const verifyOtpMutation = useVerifyOtp({
    onSuccess: () => {
      router.push("/");
    },
  });

  useEffect(() => {
    if (!timerEndTime) {
      setResendTimer(0);
      return;
    }

    const calculateTimeLeft = () => {
      const difference = timerEndTime - Date.now();
      const secondsLeft = Math.max(0, Math.ceil(difference / 1000));
      setResendTimer(secondsLeft);
      if (secondsLeft <= 0) {
        setTimerEndTime(null);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 250);

    return () => clearInterval(interval);
  }, [timerEndTime]);

  const handleSendOTP = useCallback(
    (data: { email: string; [key: string]: any }) => {
      if (isLogin) {
        loginMutation.mutate({ email: data.email });
      } else {
        signupMutation.mutate(data as any);
      }
    },
    [isLogin, loginMutation, signupMutation],
  );

  const handleVerifyOTP = useCallback(
    (otpCode: string) => {
      verifyOtpMutation.mutate({ email, otp: otpCode });
    },
    [email, verifyOtpMutation],
  );

  const handleResendOTP = useCallback(() => {
    if (resendTimer > 0) return;
    setOtp("");
    loginMutation.mutate({ email });
  }, [resendTimer, email, loginMutation]);

  const resetFlow = useCallback(() => {
    setStep("details");
    setOtp("");
    setTimerEndTime(null);
    setResendTimer(0);
  }, []);

  const loading =
    loginMutation.isPending ||
    signupMutation.isPending ||
    verifyOtpMutation.isPending;

  return {
    step,
    email,
    otp,
    setOtp,
    resendTimer,
    handleSendOTP,
    handleVerifyOTP,
    handleResendOTP,
    resetFlow,
    loading,
  };
}

export default useAuthFlow;
