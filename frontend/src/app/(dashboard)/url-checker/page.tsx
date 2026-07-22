"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, ShieldAlert, CheckCircle } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";

export default function UrlChecker() {
  const [url, setUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  interface UrlResult {
  status: string;
  domain_age_days: number;
  ssl_certificate: string;
  blacklist_status: string;
  phishing_indicators?: string[];
}
const [result, setResult] = useState<UrlResult | null>(null);

  const analyzeUrl = async () => {
    if (!url) return;
    setAnalyzing(true);
    setResult(null);
    try {
      const res = await fetchWithAuth(`/checker/url?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        setResult(await res.json());
      } else {
        alert("Failed to analyze URL");
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
          <Globe className="w-8 h-8 text-primary" />
          Website URL Checker
        </h2>
        <p className="text-muted-foreground mt-2">
          Check if a link is safe before you click or enter credentials.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-background/40 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle>Input Link</CardTitle>
            <CardDescription>Enter the full URL (e.g., https://example.com)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full bg-muted/50 border border-border/50 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="https://..."
            />
            <button
              onClick={analyzeUrl}
              disabled={analyzing || !url}
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {analyzing ? "Analyzing domain..." : "Check URL"}
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
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                <span className="text-muted-foreground">Domain Age</span>
                <span className="font-bold">{result.domain_age_days} days</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                <span className="text-muted-foreground">SSL Certificate</span>
                <span className={`font-bold ${result.ssl_certificate === 'Valid' ? 'text-green-500' : 'text-red-500'}`}>{result.ssl_certificate}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                <span className="text-muted-foreground">Blacklist Status</span>
                <span className={`font-bold ${result.blacklist_status === 'Clean' ? 'text-green-500' : 'text-red-500'}`}>{result.blacklist_status}</span>
              </div>
              {result.phishing_indicators && result.phishing_indicators.length > 0 && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <h4 className="font-semibold text-sm mb-1 text-red-500">Phishing Indicators Detected</h4>
                  <ul className="text-sm text-red-400 list-disc list-inside">
                    {result.phishing_indicators.map((indicator: string, i: number) => (
                      <li key={i}>{indicator}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
