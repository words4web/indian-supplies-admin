import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/common/Input";
import { loginSchema, LoginInput } from "@/schemas/auth";

export function LoginDetailsForm({
  onSubmit,
  isPending,
}: {
  onSubmit: (data: LoginInput) => void;
  isPending: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Welcome back
        </span>
        <h2 className="mt-1 font-serif text-2xl font-bold">
          Sign in to access your trade account
        </h2>
      </div>
      <div className="mt-7 space-y-5">
        <Input
          label="Enter your business email"
          type="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>

      <Button
        type="submit"
        className="mt-7 w-full"
        size="lg"
        disabled={isPending}>
        {isPending ? "Sending OTP..." : "Get OTP Code"} <ArrowRight />
      </Button>
    </form>
  );
}

export default LoginDetailsForm;
