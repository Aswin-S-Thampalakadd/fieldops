"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { useAuth } from "@/src/lib/hooks/useAuth";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { LoadingSpinner } from "@/src/components/shared/LoadingSpinner";

import "./LoginPage.css";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  const { login, loginLoading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);

      await login(data);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.message || "Unable to sign in. Please try again.");
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-page-wrapper">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">F</div>

            <h1 className="login-title">Welcome back</h1>

            <p className="login-subtitle">
              Sign in to your FieldOps admin dashboard
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="login-field">
              <label className="login-label" htmlFor="email">
                Email address
              </label>

              <div className="login-input-wrapper">
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  autoComplete="email"
                  {...register("email")}
                  className={`login-input ${
                    errors.email ? "login-input-error" : ""
                  }`}
                />
              </div>

              {errors.email && (
                <p className="login-error">{errors.email.message}</p>
              )}
            </div>

            <div className="login-field">
              <label className="login-label" htmlFor="password">
                Password
              </label>

              <div className="login-input-wrapper">
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...register("password")}
                  className={`login-input ${
                    errors.password ? "login-input-error" : ""
                  }`}
                />
              </div>

              {errors.password && (
                <p className="login-error">{errors.password.message}</p>
              )}
            </div>

            {error && (
              <div className="login-error-box">
                <span className="login-error-icon">!</span>

                <p className="login-error-text">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="login-submit-btn"
              disabled={loginLoading}
            >
              {loginLoading && (
                <LoadingSpinner size="sm" className="login-spinner" />
              )}

              {loginLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="login-footer">FieldOps Admin Portal</div>
        </div>
      </div>
    </div>
  );
}
