"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, ShieldAlert, CheckCircle, AlertTriangle } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";

export default function PhoneChecker() {
  const [number, setNumber] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<unknown>(null);

  const analyzePhone = async () => {
    if (!number || number.length < 10) return;
    setAnalyzing(true);
    setResult(null);
    try {
      const res = await fetchWithAuth(`/checker/phone/${encodeURIComponent(number)}`);
      if (res.ok) {
        setResult(await res.json());
      } else {
        alert("Failed to analyze phone number");
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
          <Phone className="w-8 h-8 text-primary" />
          Phone Number Checker
        </h2>
        <p className="text-muted-foreground mt-2">
          Verify if an incoming call or SMS is from a known scammer.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-background/40 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Input Number</CardTitle>
            <CardDescription>Enter the 10-digit mobile number</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <span className="inline-flex items-center px-3 rounded-lg bg-muted/50 border border-border/50 text-muted-foreground text-sm">
                +91
              </span>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="flex-1 bg-muted/50 border border-border/50 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter mobile number..."
              />
            </div>
            <button
              onClick={analyzePhone}
              disabled={analyzing || number.length < 10}
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {analyzing ? "Checking databases..." : "Check Number"}
            </button>
          </CardContent>
        </Card>

        {result && (
          <Card className={`bg-background/40 backdrop-blur-sm border-border/50 ${result.reputation === 'Dangerous' ? 'border-red-500/50' : result.reputation === 'Suspicious' ? 'border-yellow-500/50' : 'border-green-500/50'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.reputation === 'Dangerous' ? <ShieldAlert className="text-red-500" /> : result.reputation === 'Suspicious' ? <AlertTriangle className="text-yellow-500" /> : <CheckCircle className="text-green-500" />}
                Assessment: {result.reputation}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                <span className="text-muted-foreground">Spam Score</span>
                <span className={`font-bold ${result.spam_score > 70 ? 'text-red-500' : result.spam_score > 40 ? 'text-yellow-500' : 'text-green-500'}`}>{result.spam_score}/100</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                <span className="text-muted-foreground">Fraud Reports</span>
                <span className="font-bold">{result.fraud_reports}</span>
              </div>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <h4 className="font-semibold text-sm mb-1">AI Recommendation</h4>
                <p className="text-sm text-muted-foreground">{result.ai_recommendation}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
