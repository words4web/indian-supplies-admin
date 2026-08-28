"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useLogin } from "@/services/auth/auth.hook";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/schemas/auth";
import { Input } from "@/components/common/Input";

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin({
    onSuccess: () => {
      router.push("/");
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginInput) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="mt-6 font-serif text-3xl font-extrabold tracking-tight">
            Admin Console
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to manage Indian Supplies
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              {...register("email")}
              type="email"
              label="Email Address"
              placeholder="admin@indiansupplies.com"
              error={errors.email?.message}
            />

            <Input
              {...register("password")}
              type="password"
              label="Password"
              placeholder="••••••••"
              error={errors.password?.message}
            />
          </div>

          <Button
            type="submit"
            className="w-full py-2.5"
            disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}
