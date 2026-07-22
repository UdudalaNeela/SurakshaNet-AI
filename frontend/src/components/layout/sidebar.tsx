"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, ShieldAlert, FileSearch, Network, Map, MessageSquareText, FileText, 
  BookOpen, AlertOctagon, Briefcase, Settings, MessageCircle, Mail, Phone, Globe, 
  QrCode, CreditCard, Lock, DollarSign, Bell, User, LogOut, FileWarning, Activity, 
  FolderSearch, Flame, Database, Shield, ListTodo, CheckCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/auth";

const citizenNavItems = [
  { name: "Dashboard", href: "/citizen/dashboard", icon: LayoutDashboard },
  { name: "AI Scam Checker", href: "/scam-shield", icon: ShieldAlert },
  { name: "Phone Number Checker", href: "/phone-checker", icon: Phone },
  { name: "Website Checker", href: "/url-checker", icon: Globe },
  { name: "QR Code Checker", href: "/qr-checker", icon: QrCode },
  { name: "OTP Safety Checker", href: "/otp-checker", icon: Lock },
  { name: "Currency Detection", href: "/currency", icon: DollarSign },
  { name: "AI Cyber Assistant", href: "/copilot", icon: MessageSquareText },
  { name: "Report Cyber Crime", href: "/report-crime", icon: AlertOctagon },
  { name: "Track Complaint", href: "/track-complaint", icon: FileSearch },
  { name: "Cyber Safety Learning", href: "/awareness", icon: BookOpen },
  { name: "Logout", href: "/login", icon: LogOut },
];

const officerNavItems = [
  { name: "Dashboard", href: "/officer/dashboard", icon: LayoutDashboard },
  { name: "Fraud Network", href: "/network", icon: Network },
  { name: "Heatmap", href: "/heatmap", icon: Map },
  { name: "Logout", href: "/login", icon: LogOut },
];

const adminNavItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Citizens", href: "/admin/citizens", icon: User },
  { name: "Officers", href: "/admin/officers", icon: Briefcase },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Logout", href: "/login", icon: LogOut },
];

export function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState("citizen");

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetchWithAuth("/auth/profile");
        if (res.ok) {
          const user = await res.json();
          setRole(user.role || "citizen");
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadProfile();
  }, []);

  const visibleItems = role === "admin" ? adminNavItems : role === "officer" ? officerNavItems : citizenNavItems;

  return (
    <aside className="w-64 border-r border-border/50 bg-background/50 backdrop-blur-xl hidden md:flex flex-col h-full sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            SurakshaNet AI
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {visibleItems.map((item) => {
          const isActive = pathname.startsWith(item.href) && (item.href !== "/" || pathname === "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-primary" : ""}`} />
              {item.name}
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t border-border/50">
        <div className="bg-primary/10 rounded-xl p-4 border border-primary/20">
          <p className="text-xs text-primary font-medium mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-muted-foreground">All nodes active</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
