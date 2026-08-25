"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "../components/shared/LoadingSpinner";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in by checking for accessToken cookie
    const hasToken = document.cookie
      .split(";")
      .some((cookie) => cookie.trim().startsWith("accessToken="));

    if (hasToken) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <LoadingSpinner size="lg" />
    </div>
  );
}
