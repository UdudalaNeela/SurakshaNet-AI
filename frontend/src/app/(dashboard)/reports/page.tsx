"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Trash2, Calendar, AlertTriangle, ShieldCheck } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";

interface Report {
  id: string;
  type: string; // e.g., 'scam' | 'currency'
  created_at: string;
  result?: {
    category?: string;
    status?: string;
  };
  input_text?: string;
  filename?: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReports() {
      try {
        const res = await fetchWithAuth("/reports?limit=20");
        if (res.ok) {
          const data = await res.json();
          setReports(data.data || []);
        }
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    fetchReports();
  }, []);

  const downloadReport = async (id: string, type: string) => {
    try {
      const res = await fetchWithAuth(`/reports/${type}/${id}/download`);
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `SurakshaNet_Report_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        alert("Failed to download report");
      }
    } catch (e) {
      console.error(e);
      alert("Error downloading report");
    }
  };

  const deleteReport = async (id: string, type: string) => {
    if (!confirm("Are you sure you want to delete this report?")) return;
    try {
      const res = await fetchWithAuth(`/reports/${type}/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setReports(reports.filter(r => r.id !== id));
      } else {
        alert("Failed to delete report");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="w-8 h-8 text-primary" />
          Incident Reports
        </h2>
        <p className="text-muted-foreground mt-2">
          View, manage, and download PDF reports of your analyzed cyber threats.
        </p>
      </div>

      <Card className="bg-background/40 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Your Reports</CardTitle>
          <CardDescription>Recent threat analysis logs</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center p-12 text-muted-foreground border-2 border-dashed border-border/50 rounded-xl">
              <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No reports generated yet.</p>
              <p className="text-sm mt-1">Use the AI Scam Shield or Fake Currency detector to generate reports.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${report.type === 'scam' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {report.type === 'scam' ? <AlertTriangle className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="font-semibold">{report.type === 'scam' ? 'Scam Detection' : 'Currency Detection'}</h4>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(report.created_at).toLocaleDateString()} {new Date(report.created_at).toLocaleTimeString()}
                        </span>
                        <span>
                          Status: <span className="text-foreground font-medium">{report.result?.category || report.result?.status || 'Completed'}</span>
                        </span>
                      </div>
                      <p className="text-sm mt-2 text-muted-foreground line-clamp-1">
                        {report.input_text || report.filename || 'No additional details.'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4 md:mt-0">
                    <button 
                      onClick={() => downloadReport(report.id, report.type)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </button>
                    <button 
                      onClick={() => deleteReport(report.id, report.type)}
                      className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
