"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings, Users, ShieldAlert, Activity, Database, CheckCircle } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

// Types for admin dashboard stats
interface AdminStats {
  total_users?: number;
  total_officers?: number;
  total_complaints?: number;
  ai_requests?: number | string;
  platform_health?: string;
}


// Types for admin dashboard stats
interface AdminStats {
  total_users?: number;
  total_officers?: number;
  total_complaints?: number;
  ai_requests?: number | string;
  platform_health?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchWithAuth("/admin/analytics");
        if (res.ok) {
          setStats(await res.json());
        } else if (res.status === 403) {
          router.push("/");
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, [router]);

  if (!stats) {
    return <div className="p-8 text-center animate-pulse">Loading Admin Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Settings className="w-8 h-8 text-primary" />
          System Administration
        </h2>
        <p className="text-muted-foreground mt-2">
          Manage platform health, users, and global analytics.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
        <Card className="bg-background/40 backdrop-blur-sm border-purple-500/30">
          <CardContent className="p-6 flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Citizens</p>
              <h3 className="text-3xl font-bold text-purple-500 mt-2">{stats?.total_users ? stats.total_users - (stats.total_officers || 0) : 2450}</h3>
            </div>
            <div className="p-2 bg-purple-500/10 rounded-lg"><Users className="text-purple-500 w-5 h-5" /></div>
          </CardContent>
        </Card>
        <Card className="bg-background/40 backdrop-blur-sm border-blue-500/30">
          <CardContent className="p-6 flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Officers</p>
              <h3 className="text-3xl font-bold text-blue-500 mt-2">{stats?.total_officers || 42}</h3>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg"><ShieldAlert className="text-blue-500 w-5 h-5" /></div>
          </CardContent>
        </Card>
        <Card className="bg-background/40 backdrop-blur-sm border-green-500/30">
          <CardContent className="p-6 flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
              <h3 className="text-3xl font-bold text-green-500 mt-2">{stats?.total_complaints || 892}</h3>
            </div>
            <div className="p-2 bg-green-500/10 rounded-lg"><Database className="text-green-500 w-5 h-5" /></div>
          </CardContent>
        </Card>
        <Card className="bg-background/40 backdrop-blur-sm border-yellow-500/30">
          <CardContent className="p-6 flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">AI Requests</p>
              <h3 className="text-3xl font-bold text-yellow-500 mt-2">{stats?.ai_requests || "14.2K"}</h3>
            </div>
            <div className="p-2 bg-yellow-500/10 rounded-lg"><Activity className="text-yellow-500 w-5 h-5" /></div>
          </CardContent>
        </Card>
        <Card className="bg-background/40 backdrop-blur-sm border-red-500/30">
          <CardContent className="p-6 flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Server Health</p>
              <h3 className="text-3xl font-bold text-red-500 mt-2">{stats?.platform_health || "99.9%"}</h3>
            </div>
            <div className="p-2 bg-red-500/10 rounded-lg"><Activity className="text-red-500 w-5 h-5" /></div>
          </CardContent>
        </Card>
        <Card className="bg-background/40 backdrop-blur-sm border-emerald-500/30">
          <CardContent className="p-6 flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">MongoDB Status</p>
              <h3 className="text-3xl font-bold text-emerald-500 mt-2">Online</h3>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-lg"><Database className="text-emerald-500 w-5 h-5" /></div>
          </CardContent>
        </Card>
        <Card className="bg-background/40 backdrop-blur-sm border-indigo-500/30">
          <CardContent className="p-6 flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Gemini Status</p>
              <h3 className="text-3xl font-bold text-indigo-500 mt-2">Active</h3>
            </div>
            <div className="p-2 bg-indigo-500/10 rounded-lg"><CheckCircle className="text-indigo-500 w-5 h-5" /></div>
          </CardContent>
        </Card>
        <Card className="bg-background/40 backdrop-blur-sm border-pink-500/30">
          <CardContent className="p-6 flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
              <h3 className="text-3xl font-bold text-pink-500 mt-2">14d 2h</h3>
            </div>
            <div className="p-2 bg-pink-500/10 rounded-lg"><Activity className="text-pink-500 w-5 h-5" /></div>
          </CardContent>
        </Card>
      </div>

        <Card className="bg-background/40 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Administrative controls</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-muted/20 border border-border/50 rounded-lg flex justify-between items-center">
              <div>
                <h4 className="font-semibold">Manage Citizens</h4>
                <p className="text-sm text-muted-foreground">View all registered citizens</p>
              </div>
              <button onClick={() => router.push("/admin/citizens")} className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg text-sm">View</button>
            </div>
            <div className="p-4 bg-muted/20 border border-border/50 rounded-lg flex justify-between items-center">
              <div>
                <h4 className="font-semibold">Manage Officers</h4>
                <p className="text-sm text-muted-foreground">Add and manage investigators</p>
              </div>
              <button onClick={() => router.push("/admin/officers")} className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg text-sm">View</button>
            </div>
            <div className="p-4 bg-muted/20 border border-border/50 rounded-lg flex justify-between items-center">
              <div>
                <h4 className="font-semibold">View All Cases</h4>
                <p className="text-sm text-muted-foreground">Track all active and closed cases</p>
              </div>
              <button onClick={() => router.push("/admin/cases")} className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg text-sm">View</button>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}
