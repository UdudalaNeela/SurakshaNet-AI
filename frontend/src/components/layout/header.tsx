"use client";

import { Bell, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/auth";

export function Header() {
  const [profile, setProfile] = useState<{ full_name: string; role: string } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetchWithAuth("/auth/profile");
        if (res.ok) {
          setProfile(await res.json());
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadProfile();
  }, []);

  return (
    <header className="h-16 border-b border-border/50 bg-background/50 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center flex-1">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search cases, reports, or phone numbers..."
            className="w-full h-10 bg-muted/50 border border-border/50 rounded-full pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-muted/50 transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-border/50">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium">{profile ? profile.full_name : "Loading..."}</span>
            <span className="text-xs text-muted-foreground capitalize">
              {profile ? (profile.role === "officer" ? "Cyber Crime Cell" : profile.role === "admin" ? "System Administrator" : "Citizen Account") : "Authenticating"}
            </span>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>
    </header>
  );
}
