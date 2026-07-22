"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Briefcase, AlertTriangle, ShieldCheck, ListTodo, Search } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OfficerDashboard() {
  const [stats, setStats] = useState<unknown>(null);
  const [cases, setCases] = useState<unknown[]>([]);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, casesRes] = await Promise.all([
          fetchWithAuth("/officer/dashboard"),
          fetchWithAuth("/officer/cases")
        ]);
        
        if (statsRes.ok && casesRes.ok) {
          setStats(await statsRes.json());
          const casesData = await casesRes.json();
          setCases(casesData.cases);
        } else if (statsRes.status === 403 || casesRes.status === 403) {
          router.push("/");
        }
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, [router]);

  if (!stats) {
    return <div className="p-8 text-center animate-pulse">Loading Officer Data...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Briefcase className="w-8 h-8 text-primary" />
          Officer Command Center
        </h2>
        <p className="text-muted-foreground mt-2">
          Manage cyber crime investigations, track fraud rings, and generate AI FIRs.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4 lg:grid-cols-4">
        <Card className="bg-background/40 backdrop-blur-sm border-blue-500/30">
          <CardContent className="p-6 flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">New Complaints Today</p>
              <h3 className="text-3xl font-bold text-blue-500 mt-2">{stats?.new_cases || 12}</h3>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-lg"><AlertTriangle className="text-blue-500 w-5 h-5" /></div>
          </CardContent>
        </Card>
        <Card className="bg-background/40 backdrop-blur-sm border-orange-500/30">
          <CardContent className="p-6 flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Investigations</p>
              <h3 className="text-3xl font-bold text-orange-500 mt-2">{stats?.pending || 45}</h3>
            </div>
            <div className="p-2 bg-orange-500/10 rounded-lg"><ListTodo className="text-orange-500 w-5 h-5" /></div>
          </CardContent>
        </Card>
        <Card className="bg-background/40 backdrop-blur-sm border-indigo-500/30">
          <CardContent className="p-6 flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Investigations</p>
              <h3 className="text-3xl font-bold text-indigo-500 mt-2">{stats?.active_investigations || 28}</h3>
            </div>
            <div className="p-2 bg-indigo-500/10 rounded-lg"><Search className="text-indigo-500 w-5 h-5" /></div>
          </CardContent>
        </Card>
        <Card className="bg-background/40 backdrop-blur-sm border-green-500/30">
          <CardContent className="p-6 flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Closed Cases</p>
              <h3 className="text-3xl font-bold text-green-500 mt-2">{stats?.closed || 156}</h3>
            </div>
            <div className="p-2 bg-green-500/10 rounded-lg"><ShieldCheck className="text-green-500 w-5 h-5" /></div>
          </CardContent>
        </Card>
        <Card className="bg-background/40 backdrop-blur-sm border-red-500/30">
          <CardContent className="p-6 flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">High Priority Cases</p>
              <h3 className="text-3xl font-bold text-red-500 mt-2">{stats?.high_priority || 7}</h3>
            </div>
            <div className="p-2 bg-red-500/10 rounded-lg"><AlertTriangle className="text-red-500 w-5 h-5" /></div>
          </CardContent>
        </Card>
        <Card className="bg-background/40 backdrop-blur-sm border-purple-500/30">
          <CardContent className="p-6 flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Fraud Rings Detected</p>
              <h3 className="text-3xl font-bold text-purple-500 mt-2">{stats?.fraud_rings || 3}</h3>
            </div>
            <div className="p-2 bg-purple-500/10 rounded-lg"><Briefcase className="text-purple-500 w-5 h-5" /></div>
          </CardContent>
        </Card>
        <Card className="bg-background/40 backdrop-blur-sm border-pink-500/30 md:col-span-2">
          <CardContent className="p-6 flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Money Lost</p>
              <h3 className="text-3xl font-bold text-pink-500 mt-2">₹{stats?.total_lost?.toLocaleString() || "1,25,00,000"}</h3>
            </div>
            <div className="p-2 bg-pink-500/10 rounded-lg"><AlertTriangle className="text-pink-500 w-5 h-5" /></div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-background/40 backdrop-blur-sm border-border/50">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Case Queue</CardTitle>
              <CardDescription>Recent complaints requiring officer attention</CardDescription>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search cases..." 
                className="pl-9 pr-4 py-2 bg-muted/50 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/30">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Case ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right rounded-tr-lg">Action</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => (
                  <tr key={c._id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-4 font-mono text-primary">{c.case_id}</td>
                    <td className="px-4 py-4">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-4">{c.scam_type}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        c.status.includes('Closed') ? 'bg-green-500/10 text-green-500' :
                        c.status.includes('Investigation') ? 'bg-orange-500/10 text-orange-500' :
                        'bg-blue-500/10 text-blue-500'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link href={`/officer/case/${c.case_id}`} className="text-primary hover:underline font-medium">
                        Investigate
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
