"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FolderOpen, ArrowLeft, Loader2 } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";
import Link from "next/link";

export default function CasesManagement() {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCases = async () => {
    try {
      const res = await fetchWithAuth("/admin/cases");
      if (res.ok) {
        const data = await res.json();
        setCases(data.cases || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard" className="p-2 hover:bg-muted rounded-lg transition-colors border border-border/50">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <FolderOpen className="w-8 h-8 text-primary" />
            Cyber Crime Cases
          </h2>
          <p className="text-muted-foreground mt-2">
            Track and monitor all submitted incidents across the platform.
          </p>
        </div>
      </div>

      <Card className="bg-background/40 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Case Directory</CardTitle>
          <CardDescription>A consolidated database of cybercrime reports.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground animate-pulse">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span>Loading cases...</span>
              </div>
            </div>
          ) : cases.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">No cases registered on the platform.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border/50">
                  <tr>
                    <th className="px-4 py-3">Case ID</th>
                    <th className="px-4 py-3">Incident Date</th>
                    <th className="px-4 py-3">Scam Category</th>
                    <th className="px-4 py-3">Amount Lost</th>
                    <th className="px-4 py-3">Assigned To</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {cases.map((c) => (
                    <tr key={c._id} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-4 font-mono font-semibold text-primary">{c.case_id}</td>
                      <td className="px-4 py-4">{new Date(c.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-4">{c.scam_type}</td>
                      <td className="px-4 py-4 font-bold text-red-500">₹{c.amount_lost?.toLocaleString() || 0}</td>
                      <td className="px-4 py-4 text-muted-foreground">{c.officer_assigned || "Unassigned"}</td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          c.status.includes('Closed') ? 'bg-green-500/10 text-green-500' :
                          c.status.includes('Investigation') ? 'bg-orange-500/10 text-orange-500' :
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
