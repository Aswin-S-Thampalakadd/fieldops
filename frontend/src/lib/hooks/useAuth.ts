"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../api/auth";
import { LoginCredentials } from "../types/user";
import { toast } from "sonner";

export function useAuth() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      authService.login(credentials),
    onSuccess: (data) => {
      // Set cookies via document.cookie (since we're using httpOnly, this is just for demonstration)
      // In production with httpOnly, the server sets cookies
      document.cookie = `accessToken=${data.accessToken}; path=/; secure; samesite=strict`;
      queryClient.setQueryData(["user"], data.user);
      router.push("/dashboard");
      toast.success("Welcome back!");
    },
    onError: (error: any) => {
      toast.error(error.message || "Login failed");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      document.cookie =
        "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      queryClient.clear();
      router.push("/login");
      toast.success("Logged out successfully");
    },
    onError: () => {
      // Even if logout fails, clear local state
      document.cookie =
        "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      queryClient.clear();
      router.push("/login");
    },
  });

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: () => authService.getProfile(),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return {
    user,
    isLoading,
    login: loginMutation.mutate,
    loginLoading: loginMutation.isPending,
    logout: logoutMutation.mutate,
    logoutLoading: logoutMutation.isPending,
  };
}
