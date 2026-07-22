"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound, ShieldAlert, Bot } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";

export default function OtpChecker() {
  const [question, setQuestion] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const analyzeOtp = async () => {
    if (!question) return;
    setAnalyzing(true);
    setResult(null);
    try {
      const res = await fetchWithAuth(`/checker/otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: question, language: "en" })
      });
      if (res.ok) {
        setResult(await res.json());
      } else {
        alert("Failed to analyze OTP query");
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
          <KeyRound className="w-8 h-8 text-primary" />
          OTP Safety Checker
        </h2>
        <p className="text-muted-foreground mt-2">
          Ask the AI if it is safe to share an OTP in your specific situation.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-background/40 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Describe the Situation</CardTitle>
            <CardDescription>Who is asking for the OTP and why?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full h-32 bg-muted/50 border border-border/50 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              placeholder='e.g., "A courier delivery boy is asking for the OTP sent to my phone to cancel a package I did not order. Should I share it?"'
            ></textarea>
            <button
              onClick={analyzeOtp}
              disabled={analyzing || !question}
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {analyzing ? "Asking AI Copilot..." : "Evaluate Safety"}
            </button>
          </CardContent>
        </Card>

        {result && (
          <Card className={`bg-background/40 backdrop-blur-sm border-border/50 border-primary/50`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="text-primary" />
                AI Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20 text-sm leading-relaxed whitespace-pre-wrap">
                {result.analysis}
              </div>
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs text-red-400">
                  <strong className="text-red-500">Golden Rule:</strong> Never share an OTP with anyone over a phone call, WhatsApp, or email, regardless of who they claim to be (Bank, Police, Courier, CBI).
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
