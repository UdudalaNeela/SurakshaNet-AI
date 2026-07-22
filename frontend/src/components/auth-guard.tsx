"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { fetchWithAuth, getToken } from "@/lib/auth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const token = await getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetchWithAuth("/auth/profile");
        if (res.ok) {
          const user = await res.json();
          const role = user.role || "citizen";

          // Strict Role Checking
          if (role === "admin") {
            // Admin can access everything
            setAuthorized(true);
            return;
          }

          if (role === "officer") {
            if (pathname.startsWith("/admin")) {
              router.push("/login?error=UnauthorizedAccess");
              return;
            }
            setAuthorized(true);
            return;
          }

          if (role === "citizen") {
            if (pathname.startsWith("/admin") || pathname.startsWith("/officer") || pathname.startsWith("/network") || pathname.startsWith("/heatmap")) {
              router.push("/login?error=UnauthorizedAccess");
              return;
            }
            setAuthorized(true);
            return;
          }

          router.push("/login");
        } else {
          localStorage.removeItem("surakshanet_token");
          router.push("/login");
        }
      } catch (e) {
        router.push("/login");
      }
    }
    checkAuth();
  }, [pathname, router]);

  if (!authorized) {
    return <div className="min-h-screen flex items-center justify-center">Verifying Access...</div>;
  }

  return <>{children}</>;
}
