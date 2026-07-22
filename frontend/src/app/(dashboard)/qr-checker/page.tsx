"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, ShieldAlert, CheckCircle, Upload } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";

interface QrResult {
  status: string;
  detected_url: string;
  type: string;
  analysis: string;
}

export default function QrChecker() {
  const [fileInput, setFileInput] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<QrResult | null>(null);

  const analyzeQr = async () => {
    if (!fileInput) return;
    setAnalyzing(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", fileInput);
      const res = await fetchWithAuth("/checker/qr", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        setResult(await res.json());
      } else {
        alert("Failed to analyze QR code");
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
          <QrCode className="w-8 h-8 text-primary" />
          QR Code Scanner
        </h2>
        <p className="text-muted-foreground mt-2">
          Detect malicious QR codes and fake payment requests before scanning them.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-background/40 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Upload QR Image</CardTitle>
            <CardDescription>Provide a screenshot or image of the QR code</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="border-2 border-dashed border-border/50 rounded-xl h-40 flex flex-col items-center justify-center text-muted-foreground bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 mb-2 opacity-70" />
              <p className="text-sm font-medium">{fileInput ? fileInput.name : "Click to upload image"}</p>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => setFileInput(e.target.files?.[0] || null)} />
            </label>
            <button
              onClick={analyzeQr}
              disabled={analyzing || !fileInput}
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {analyzing ? "Decoding QR..." : "Analyze QR Code"}
            </button>
          </CardContent>
        </Card>

        {result && (
          <Card className={`bg-background/40 backdrop-blur-sm border-border/50 ${result.status === 'Dangerous' ? 'border-red-500/50' : 'border-green-500/50'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.status === 'Dangerous' ? <ShieldAlert className="text-red-500" /> : <CheckCircle className="text-green-500" />}
                Assessment: {result.status}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/30 break-all">
                <span className="text-muted-foreground text-sm">Decoded Content</span>
                <span className="font-mono text-sm">{result.detected_url}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                <span className="text-muted-foreground text-sm">Detected Type</span>
                <span className="font-bold">{result.type}</span>
              </div>
              <div className={`p-4 rounded-lg border ${result.status === 'Dangerous' ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'}`}>
                <h4 className={`font-semibold text-sm mb-1 ${result.status === 'Dangerous' ? 'text-red-500' : 'text-green-500'}`}>Analysis</h4>
                <p className={`text-sm ${result.status === 'Dangerous' ? 'text-red-400' : 'text-green-400'}`}>{result.analysis}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
