"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, ShieldCheck, AlertTriangle, AlertCircle, FileText, CheckCircle2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { fetchWithAuth } from "@/lib/auth";

export default function ScamShield() {
  const [analyzing, setAnalyzing] = useState(false);
  interface ScamResult {
  category?: string;
  risk_level?: string;
  probability?: number;
  confidence: number;
  explanation?: string;
  recommendations?: string[];
}
const [result, setResult] = useState<ScamResult | null>(null);

  const [textInput, setTextInput] = useState("");
  const [source, setSource] = useState("Unknown");
  const [fileInput, setFileInput] = useState<File | null>(null);

  const analyzeText = async () => {
    if (!textInput) return;
    setAnalyzing(true);
    setResult(null);
    try {
      const formData = new URLSearchParams();
      formData.append("text", `[Source: ${source}] ${textInput}`);
      const res = await fetchWithAuth("/scam/detect-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString()
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        alert("Failed to analyze text");
      }
    } catch (e) {
      console.error(e);
    }
    setAnalyzing(false);
  };

  const analyzeFile = async () => {
    if (!fileInput) return;
    setAnalyzing(true);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", fileInput);
      const res = await fetchWithAuth("/scam/detect-file", {
        method: "POST",
        body: formData
      });
      if (res.ok) {
        const data = await res.json();
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
          <ShieldCheck className="w-8 h-8 text-primary" />
          AI Scam Shield
        </h2>
        <p className="text-muted-foreground mt-2">
          Upload screenshots, PDFs, or paste text to detect potential scams using our AI engine.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-background/40 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Input Data</CardTitle>
            <CardDescription>Provide the suspicious message or document</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="text">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="text">Text / SMS</TabsTrigger>
                <TabsTrigger value="upload">File Upload</TabsTrigger>
              </TabsList>
              <TabsContent value="text" className="space-y-4">
                <div className="flex flex-col gap-2">
                  <select 
                    value={source} 
                    onChange={(e) => setSource(e.target.value)}
                    className="w-full bg-muted/50 border border-border/50 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="Unknown">Select Source Platform (Optional)</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="SMS">SMS Message</option>
                    <option value="Email">Email</option>
                    <option value="Telegram">Telegram</option>
                    <option value="Instagram">Instagram Message</option>
                    <option value="Facebook">Facebook Message</option>
                    <option value="URL">Website URL</option>
                  </select>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="w-full h-32 bg-muted/50 border border-border/50 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder="Paste the suspicious message, email, or URL here..."
                  ></textarea>
                </div>
                <button
                  onClick={analyzeText}
                  disabled={analyzing || !textInput}
                  className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {analyzing ? "Analyzing with AI..." : "Analyze Text"}
                </button>
              </TabsContent>
              <TabsContent value="upload" className="space-y-4">
                <label className="border-2 border-dashed border-border/50 rounded-xl h-40 flex flex-col items-center justify-center text-muted-foreground bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 mb-2 opacity-70" />
                  <p className="text-sm font-medium">{fileInput ? fileInput.name : "Click to upload or drag and drop"}</p>
                  <p className="text-xs opacity-70 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                  <input type="file" className="hidden" onChange={(e) => setFileInput(e.target.files?.[0] || null)} />
                </label>
                <button
                  onClick={analyzeFile}
                  disabled={analyzing || !fileInput}
                  className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {analyzing ? "Scanning Document..." : "Analyze File"}
                </button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="bg-background/40 backdrop-blur-sm border-border/50 relative overflow-hidden">
          {analyzing && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-primary font-medium animate-pulse">Running NLP Analysis...</p>
            </div>
          )}
          
          <CardHeader>
            <CardTitle>AI Analysis Results</CardTitle>
            <CardDescription>Real-time threat assessment</CardDescription>
          </CardHeader>
          <CardContent>
            {!result && !analyzing && (
              <div className="h-[250px] flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <FileText className="w-12 h-12 mb-3" />
                <p>Submit data to see AI analysis</p>
              </div>
            )}

            {result && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                    <div>
                      <h3 className="font-bold text-red-500">{result.category || "Unknown"}</h3>
                      <p className="text-sm text-red-400">Risk Level: {result.risk_level || "Unknown"}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-red-500">{result.probability || 0}%</div>
                    <p className="text-xs text-red-400">Scam Probability</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">AI Confidence Score</span>
                    <span className="font-medium text-green-500">{result.confidence}%</span>
                  </div>
                  <Progress value={result.confidence} className="h-2 bg-muted [&>div]:bg-green-500" />
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-primary" />
                    AI Reasoning
                  </h4>
                  <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
                    {result.explanation || "No explanation provided."}
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Safety Recommendations
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1 bg-green-500/5 p-3 rounded-lg border border-green-500/10">
                    {(result.recommendations || []).map((rec: string, i: number) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-green-500 mt-0.5">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
