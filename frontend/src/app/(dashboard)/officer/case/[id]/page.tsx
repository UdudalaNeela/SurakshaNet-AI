"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldAlert, Network, FileText, CheckCircle2, User, Phone, MapPin, Database, Send } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";
import { useParams } from "next/navigation";

export default function CaseInvestigation() {
  const params = useParams();
  const caseId = params.id as string;
  
  interface CaseData {
    case_id: string;
    name: string;
    phone_number: string;
    email: string;
    city: string;
    state: string;
    scam_type: string;
    amount_lost: number;
    suspect_phone?: string;
    upi_id?: string;
    bank_name?: string;
    description: string;
    status: string;
    created_at: string;
    remarks: string[];
  }
  interface NetworkCase {
    case_id: string;
    name: string;
    amount_lost: number;
  }
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [networkData, setNetworkData] = useState<NetworkCase[]>([]);
  
  const [newStatus, setNewStatus] = useState("");
  const [newRemark, setNewRemark] = useState("");
  const [updating, setUpdating] = useState(false);
  
  const [firContent, setFirContent] = useState("");
  const [generatingFir, setGeneratingFir] = useState(false);

  const fetchCase = useCallback(async () => {
    try {
      const res = await fetchWithAuth(`/officer/cases/${caseId}`);
      if (res.ok) {
        setCaseData(await res.json());
      }
      
      const netRes = await fetchWithAuth(`/officer/cases/${caseId}/network`);
      if (netRes.ok) {
        setNetworkData((await netRes.json()).network);
      }
    } catch (e) {
      console.error(e);
    }
  }, [caseId]);

  useEffect(() => {
    if (caseId) {
      (async () => {
        await fetchCase();
      })();
    }
  }, [caseId, fetchCase]);

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      interface UpdatePayload { status?: string; remark?: string; }
      const payload: UpdatePayload = {};
      if (newStatus) payload.status = newStatus;
      if (newRemark) payload.remark = newRemark;
      
      const res = await fetchWithAuth(`/officer/cases/${caseId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setNewRemark("");
        fetchCase();
      }
    } catch (e) {
      console.error(e);
    }
    setUpdating(false);
  };

  const handleGenerateFIR = async () => {
    setGeneratingFir(true);
    try {
      const res = await fetchWithAuth(`/officer/cases/${caseId}/generate-fir`, {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        setFirContent(data.fir_content);
      }
    } catch (e) {
      console.error(e);
    }
    setGeneratingFir(false);
  };

  if (!caseData) {
    return <div className="p-8 text-center animate-pulse">Loading Investigation Workspace...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-mono text-primary">
            {caseData.case_id}
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              caseData.status === 'Closed' ? 'bg-green-500/10 text-green-500' :
              caseData.status === 'Under Investigation' ? 'bg-orange-500/10 text-orange-500' :
              'bg-blue-500/10 text-blue-500'
            }`}>
              {caseData.status}
            </span>
            <span className="text-sm text-muted-foreground">
              Filed: {new Date(caseData.created_at).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-background/40 backdrop-blur-sm border border-border/50">
          <TabsTrigger value="details">Case Details</TabsTrigger>
          <TabsTrigger value="network">Fraud Network ({networkData.length})</TabsTrigger>
          <TabsTrigger value="actions">Officer Actions</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-background/40 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" /> Victim Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-medium">{caseData.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{caseData.phone_number}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">{caseData.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium">{caseData.city}, {caseData.state}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background/40 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-500" /> Incident / Suspect Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Scam Type</p>
                    <p className="font-medium">{caseData.scam_type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Amount Lost</p>
                    <p className="font-bold text-red-500">₹{caseData.amount_lost.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Suspect Phone</p>
                    <p className="font-mono text-red-400">{caseData.suspect_phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Suspect UPI / Bank</p>
                    <p className="font-mono text-red-400">{caseData.upi_id || caseData.bank_name || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-background/40 backdrop-blur-sm border-border/50 md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg">Incident Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed bg-muted/30 p-4 rounded-lg border border-border/50">
                  {caseData.description}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <Card className="bg-background/40 backdrop-blur-sm border-purple-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="text-purple-500 w-5 h-5" />
                AI Fraud Ring Analysis
              </CardTitle>
              <CardDescription>
                The AI has scanned the MongoDB database for matching attributes (Phone, UPI, Email) to identify repeat offenders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {networkData.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground bg-muted/20 rounded-lg">
                  No linked cases found. This appears to be an isolated incident.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-500">Repeat Offender Detected</h4>
                      <p className="text-sm text-red-400">Found {networkData.length} other complaints sharing identical suspect details.</p>
                    </div>
                  </div>
                  
                  <div className="grid gap-3 mt-4">
                    {networkData.map((netCase, i) => (
                      <div key={i} className="p-4 bg-muted/30 border border-border/50 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-mono font-bold text-primary">{netCase.case_id}</p>
                          <p className="text-xs text-muted-foreground mt-1">Victim: {netCase.name} • Lost: ₹{netCase.amount_lost}</p>
                        </div>
                        <a href={`/officer/case/${netCase.case_id}`} target="_blank" className="text-xs text-primary hover:underline">
                          View Case
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-background/40 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>Update Investigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Change Status</label>
                  <select 
                    value={newStatus} 
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-muted/50 border border-border/50 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">-- No Change --</option>
                    <option value="Under Investigation">Under Investigation</option>
                    <option value="Closed">Closed / Resolved</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Add Officer Note</label>
                  <textarea 
                    value={newRemark}
                    onChange={(e) => setNewRemark(e.target.value)}
                    className="w-full h-24 bg-muted/50 border border-border/50 rounded-lg p-2.5 text-sm resize-none focus:ring-2 focus:ring-primary/50"
                    placeholder="E.g., Contacted bank to freeze account..."
                  />
                </div>
                <button
                  onClick={handleUpdate}
                  disabled={updating || (!newStatus && !newRemark)}
                  className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {updating ? "Saving..." : "Save Updates"}
                </button>
              </CardContent>
            </Card>

            <Card className="bg-background/40 backdrop-blur-sm border-blue-500/30 flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="text-blue-500 w-5 h-5" /> AI FIR Generator
                </CardTitle>
                <CardDescription>Automatically draft an official First Information Report based on case data.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end">
                {firContent ? (
                  <div className="relative">
                    <div className="h-64 overflow-y-auto bg-muted/30 p-4 rounded-lg border border-border/50 text-xs font-mono whitespace-pre-wrap leading-relaxed">
                      {firContent}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleGenerateFIR}
                    disabled={generatingFir}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    {generatingFir ? (
                      <span className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Database className="w-5 h-5" /> Generate Draft FIR
                      </>
                    )}
                  </button>
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card className="bg-background/40 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Case Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {caseData.remarks.map((remark: string, i: number) => (
                  <div key={i} className="p-3 bg-muted/30 border border-border/50 rounded-lg text-sm">
                    {remark}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
