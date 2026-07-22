"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, Activity, FileSearch, CheckCircle, MapPin, SearchCheck, MessageSquare, Phone, Globe, QrCode, KeyRound, BookOpen, AlertOctagon, ListTodo, FileText } from "lucide-react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/auth";

// Types for dashboard data
interface DashboardChart {
  name: string;
  alerts: number;
  resolved: number;
}
interface ScamCategory {
  name: string;
  value: number;
}
interface DashboardData {
  dashboard_charts_data: DashboardChart[];
  scam_categories: ScamCategory[];
}

const COLORS = ["#ef4444", "#3b82f6", "#8b5cf6", "#eab308"];

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetchWithAuth("/analytics");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  if (!data) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading Live Data...</div>;
  }

  const stats = [
    { title: "Total Checks Performed", value: "1,248", change: "+12%", icon: SearchCheck, color: "text-blue-500" },
    { title: "Current Threat Level", value: "Moderate", change: "Stable", icon: Activity, color: "text-orange-500" },
    { title: "My Complaints", value: "2", change: "+1", icon: FileText, color: "text-purple-500" },
    { title: "Active Complaint Status", value: "Under Investigation", change: "Updated 2h ago", icon: ListTodo, color: "text-yellow-500" },
    { title: "Cyber Safety Score", value: "85/100", change: "+5 points", icon: ShieldAlert, color: "text-green-500" },
    { title: "Today's Scam Alert", value: "WhatsApp KYC Scam", change: "Critical", icon: AlertOctagon, color: "text-red-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground mt-2">
          Overview of the SurakshaNet AI Public Safety Platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-background/40 backdrop-blur-sm border-border/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className={stat.change.startsWith("+") ? "text-red-500" : stat.change.startsWith("-") ? "text-green-500" : ""}>
                    {stat.change}
                  </span>{" "}
                  from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 bg-background/40 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Monthly Fraud Alerts</CardTitle>
            <CardDescription>Alerts vs Resolved cases over the last 7 months</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.dashboard_charts_data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAlerts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151" }}
                  itemStyle={{ color: "#e5e7eb" }}
                />
                <Area type="monotone" dataKey="alerts" stroke="#ef4444" fillOpacity={1} fill="url(#colorAlerts)" />
                <Area type="monotone" dataKey="resolved" stroke="#3b82f6" fillOpacity={1} fill="url(#colorResolved)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3 bg-background/40 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Fraud Type Distribution</CardTitle>
            <CardDescription>Most common scams reported</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.scam_categories}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.scam_categories.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151", borderRadius: "8px" }}
                  itemStyle={{ color: "#e5e7eb" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {data.scam_categories.map((entry: any, index: number) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-xs text-muted-foreground">{entry.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <h3 className="text-2xl font-bold tracking-tight mb-4">Cyber Safety Center</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/scam-shield?source=whatsapp">
            <Card className="bg-background/40 backdrop-blur-sm border-border/50 hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center justify-center gap-3">
                <MessageSquare className="w-8 h-8 text-green-500" />
                <h4 className="font-semibold">Check WhatsApp</h4>
              </CardContent>
            </Card>
          </Link>
          <Link href="/scam-shield?source=sms">
            <Card className="bg-background/40 backdrop-blur-sm border-border/50 hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center justify-center gap-3">
                <MessageSquare className="w-8 h-8 text-blue-500" />
                <h4 className="font-semibold">Check SMS</h4>
              </CardContent>
            </Card>
          </Link>
          <Link href="/scam-shield?source=email">
            <Card className="bg-background/40 backdrop-blur-sm border-border/50 hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center justify-center gap-3">
                <FileText className="w-8 h-8 text-red-400" />
                <h4 className="font-semibold">Check Email</h4>
              </CardContent>
            </Card>
          </Link>
          <Link href="/phone-checker">
            <Card className="bg-background/40 backdrop-blur-sm border-border/50 hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center justify-center gap-3">
                <Phone className="w-8 h-8 text-purple-500" />
                <h4 className="font-semibold">Check Phone Number</h4>
              </CardContent>
            </Card>
          </Link>
          <Link href="/url-checker">
            <Card className="bg-background/40 backdrop-blur-sm border-border/50 hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center justify-center gap-3">
                <Globe className="w-8 h-8 text-indigo-500" />
                <h4 className="font-semibold">Check Website URL</h4>
              </CardContent>
            </Card>
          </Link>
          <Link href="/qr-checker">
            <Card className="bg-background/40 backdrop-blur-sm border-border/50 hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center justify-center gap-3">
                <QrCode className="w-8 h-8 text-pink-500" />
                <h4 className="font-semibold">Check QR Code</h4>
              </CardContent>
            </Card>
          </Link>
          <Link href="/phone-checker">
            <Card className="bg-background/40 backdrop-blur-sm border-border/50 hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center justify-center gap-3">
                <SearchCheck className="w-8 h-8 text-cyan-500" />
                <h4 className="font-semibold">Check UPI ID</h4>
              </CardContent>
            </Card>
          </Link>
          <Link href="/otp-checker">
            <Card className="bg-background/40 backdrop-blur-sm border-border/50 hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center justify-center gap-3">
                <KeyRound className="w-8 h-8 text-amber-500" />
                <h4 className="font-semibold">OTP Safety Checker</h4>
              </CardContent>
            </Card>
          </Link>
          <Link href="/currency">
            <Card className="bg-background/40 backdrop-blur-sm border-border/50 hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center justify-center gap-3">
                <FileSearch className="w-8 h-8 text-emerald-500" />
                <h4 className="font-semibold">Currency Detection</h4>
              </CardContent>
            </Card>
          </Link>
          <Link href="/copilot">
            <Card className="bg-background/40 backdrop-blur-sm border-border/50 hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center justify-center gap-3">
                <ShieldAlert className="w-8 h-8 text-blue-400" />
                <h4 className="font-semibold">AI Cyber Assistant</h4>
              </CardContent>
            </Card>
          </Link>
          <Link href="/awareness">
            <Card className="bg-background/40 backdrop-blur-sm border-border/50 hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center justify-center gap-3">
                <AlertOctagon className="w-8 h-8 text-red-500" />
                <h4 className="font-semibold">Latest Scam Alerts</h4>
              </CardContent>
            </Card>
          </Link>
          <Link href="/awareness">
            <Card className="bg-background/40 backdrop-blur-sm border-border/50 hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center justify-center gap-3">
                <BookOpen className="w-8 h-8 text-violet-500" />
                <h4 className="font-semibold">Cyber Learning Center</h4>
              </CardContent>
            </Card>
          </Link>
          <Link href="/report-crime">
            <Card className="bg-background/40 backdrop-blur-sm border-border/50 hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center justify-center gap-3">
                <AlertOctagon className="w-8 h-8 text-orange-500" />
                <h4 className="font-semibold">Report Cyber Crime</h4>
              </CardContent>
            </Card>
          </Link>
          <Link href="/track-complaint">
            <Card className="bg-background/40 backdrop-blur-sm border-border/50 hover:bg-muted/50 transition-colors cursor-pointer h-full">
              <CardContent className="p-6 flex flex-col items-center text-center justify-center gap-3">
                <ListTodo className="w-8 h-8 text-teal-500" />
                <h4 className="font-semibold">Track Complaint Status</h4>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
