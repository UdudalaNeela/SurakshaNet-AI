"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, ScanLine, AlertTriangle, CheckCircle2, ScanFace, FileSearch } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { fetchWithAuth } from "@/lib/auth";

export default function CurrencyDetector() {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const [fileInput, setFileInput] = useState<File | null>(null);

  const analyzeFile = async () => {
    if (!fileInput) return;
    setAnalyzing(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", fileInput);
      const res = await fetchWithAuth("/currency/detect", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
        // The backend returns id, status, confidence_score, suspicious_regions, explanation
        setResult(data);
      } else {
        alert("Failed to analyze file");
      }
    } catch (e) {
      console.error(e);
    }
    setAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ScanLine className="w-8 h-8 text-primary" />
          Fake Currency Detection
        </h2>
        <p className="text-muted-foreground mt-2">
          Upload images of currency notes for deep computer vision inspection.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-background/40 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Scan Note</CardTitle>
            <CardDescription>Upload a clear, well-lit image of the currency note</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="border-2 border-dashed border-border/50 rounded-xl h-64 flex flex-col items-center justify-center text-muted-foreground bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer relative overflow-hidden group">
              <Upload className="w-10 h-10 mb-3 opacity-70 group-hover:scale-110 transition-transform" />
              <p className="text-sm font-medium">{fileInput ? fileInput.name : "Click to upload note image"}</p>
              <p className="text-xs opacity-70 mt-1">High resolution required (Front or Back)</p>
              <input type="file" className="hidden" accept="image/png, image/jpeg, image/jpg" onChange={(e) => setFileInput(e.target.files?.[0] || null)} />
            </label>
            
            <button
              onClick={analyzeFile}
              disabled={analyzing || !fileInput}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {analyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  Running Computer Vision...
                </>
              ) : (
                <>
                  <ScanFace className="w-5 h-5" />
                  Analyze Currency
                </>
              )}
            </button>
          </CardContent>
        </Card>

        <Card className="bg-background/40 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Vision Analysis</CardTitle>
            <CardDescription>Feature extraction and verification results</CardDescription>
          </CardHeader>
          <CardContent>
            {!result && !analyzing && (
              <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <FileSearch className="w-16 h-16 mb-4" />
                <p>Upload a note to begin analysis</p>
              </div>
            )}

            {analyzing && (
              <div className="h-[300px] flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="w-48 h-24 border-2 border-primary/50 rounded-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary/20 animate-pulse" />
                    <div className="absolute top-0 bottom-0 left-0 w-2 bg-primary animate-[scan_2s_ease-in-out_infinite]" />
                  </div>
                </div>
                <div className="space-y-2 text-center w-full max-w-[250px]">
                  <p className="text-sm font-medium text-primary">Extracting Features...</p>
                  <Progress value={45} className="h-1 bg-muted [&>div]:bg-primary animate-pulse" />
                </div>
              </div>
            )}

            {result && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className={`flex items-center justify-between p-4 rounded-lg border ${
                  result.status === "Counterfeit" 
                    ? "bg-red-500/10 border-red-500/20" 
                    : "bg-green-500/10 border-green-500/20"
                }`}>
                  <div className="flex items-center gap-3">
                    {result.status === "Counterfeit" ? (
                      <AlertTriangle className="w-8 h-8 text-red-500" />
                    ) : (
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    )}
                    <div>
                      <h3 className={`font-bold ${result.status === "Counterfeit" ? "text-red-500" : "text-green-500"}`}>
                        {result.status} Note
                      </h3>
                      <p className="text-sm text-muted-foreground">AI Confidence: {result.confidence_score}%</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Suspicious Regions</h4>
                  <div className="space-y-2">
                    {(result.suspicious_regions || []).map((region: string, idx: number) => (
                      <div key={idx} className="bg-muted/50 p-2 rounded text-sm text-muted-foreground border border-border/50">
                        {region}
                      </div>
                    ))}
                    {(!result.suspicious_regions || result.suspicious_regions.length === 0) && (
                       <p className="text-sm text-muted-foreground">No suspicious regions detected.</p>
                    )}
                  </div>
                </div>

                <div className="bg-muted/30 p-3 rounded-lg border border-border/50 text-sm text-muted-foreground">
                  <strong>Analysis Details: </strong>{result.explanation || "No explanation provided."}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
