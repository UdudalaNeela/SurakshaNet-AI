"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo, Search, ShieldCheck, Clock, UserSquare2, FileText } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";
import { useSearchParams } from "next/navigation";

function TrackComplaintContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get('id') || "";
  
  const [caseId, setCaseId] = useState(initialId);
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleSearch = useCallback(async (idToSearch: string = caseId) => {
    if (!idToSearch) return;
    setSearching(true);
    setResult(null);
    try {
      const res = await fetchWithAuth(`/complaint/track/${encodeURIComponent(idToSearch)}`);
      if (res.ok) {
        setResult(await res.json());
      } else {
        alert("Complaint not found or you don't have permission to view it.");
      }
    } catch (e) {
      console.error(e);
    }
    setSearching(false);
  }, [caseId]);

  useEffect(() => {
    if (initialId) {
      (async () => {
        await handleSearch(initialId);
      })();
    }
  }, [initialId, handleSearch]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ListTodo className="w-8 h-8 text-primary" />
          Track Complaint Status
        </h2>
        <p className="text-muted-foreground mt-2">
          Enter your Case ID to check the real-time investigation progress of your report.
        </p>
      </div>

      <div className="max-w-xl">
        <Card className="bg-background/40 backdrop-blur-sm border-border/50">
          <CardContent className="p-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                className="flex-1 bg-muted/50 border border-border/50 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/50 uppercase font-mono tracking-wider"
                placeholder="e.g. SNET-2026-ABCDEF"
              />
              <button
                onClick={() => handleSearch(caseId)}
                disabled={searching || !caseId}
                className="px-6 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {searching ? <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : <><Search className="w-4 h-4" /> Track</>}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      {result && (
        <div className="grid md:grid-cols-3 gap-6 animate-in fade-in duration-500">
          <div className="md:col-span-1 space-y-6">
            <Card className="bg-background/40 backdrop-blur-sm border-border/50 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-1">Case ID</p>
                <h3 className="text-xl font-bold font-mono text-primary mb-6">{result.case_id}</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Filed On</p>
                      <p className="text-sm font-medium">{new Date(result.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Current Status</p>
                      <p className="text-sm font-medium text-green-500">{result.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                      <UserSquare2 className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Investigating Officer</p>
                      <p className="text-sm font-medium">{result.officer_assigned}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="bg-background/40 backdrop-blur-sm border-border/50 h-full">
              <CardHeader>
                <CardTitle>Investigation Timeline</CardTitle>
                <CardDescription>Live updates from the cyber crime cell</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative pl-6 border-l border-border/50 space-y-8 mt-4">
                  {result.remarks.map((remark: string, index: number) => (
                    <div key={index} className="relative">
                      <div className="absolute -left-[33px] w-4 h-4 rounded-full bg-primary ring-4 ring-background" />
                      <div className="bg-muted/30 p-4 rounded-xl border border-border/50">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="w-4 h-4 text-primary" />
                          <h4 className="font-semibold text-sm">Status Update</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{remark}</p>
                      </div>
                    </div>
                  ))}
                  <div className="relative opacity-50">
                    <div className="absolute -left-[33px] w-4 h-4 rounded-full bg-muted border-2 border-muted-foreground ring-4 ring-background" />
                    <div className="p-4">
                      <h4 className="font-semibold text-sm text-muted-foreground">Awaiting further updates...</h4>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackComplaint() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground animate-pulse">Loading Tracker...</div>}>
      <TrackComplaintContent />
    </Suspense>
  );
}
