import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/common/Input";
import { signupSchema, SignupInput } from "@/schemas/auth";

export function SignupDetailsForm({
  onSubmit,
  isPending,
}: {
  onSubmit: (data: SignupInput) => void;
  isPending: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-6">
        <h2 className="font-serif text-2xl font-bold">
          Register Business Details
        </h2>
      </div>
      <div className="mt-7 space-y-5">
        <Input
          label="Full Name"
          placeholder="e.g. Jane Doe"
          error={errors.fullName?.message}
          {...register("fullName")}
        />

        <Input
          label="Business Name"
          placeholder="e.g. Spice House Ltd"
          error={errors.businessName?.message}
          {...register("businessName")}
        />

        <Input
          label="Enter your business email"
          type="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Mobile Number"
          placeholder="e.g. 07123456789"
          error={errors.mobileNumber?.message}
          {...register("mobileNumber")}
        />
      </div>

      <Button
        type="submit"
        className="mt-7 w-full"
        size="lg"
        disabled={isPending}>
        {isPending ? "Submitting..." : "Sign Up"} <ArrowRight />
      </Button>
    </form>
  );
}

export default SignupDetailsForm;
