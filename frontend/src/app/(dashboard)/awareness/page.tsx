"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, AlertTriangle, ShieldCheck, FileWarning, HelpCircle } from "lucide-react";
import Link from "next/link";

const ALERTS = [
  {
    title: "Digital Arrest Scam",
    date: "Latest",
    desc: "Scammers posing as CBI/Customs officials claim your Aadhar is linked to illegal parcels. Do not pay. Police never demand money over video call.",
    type: "Critical",
  },
  {
    title: "Fake Trading Apps",
    date: "Recent",
    desc: "Fraudsters promise 10x returns via WhatsApp groups. Once you invest a large amount, they block your withdrawal.",
    type: "High",
  },
  {
    title: "Electricity Bill Disconnection",
    date: "Ongoing",
    desc: "SMS claiming your power will be cut tonight at 9 PM. Asks you to call a number and install screen-sharing apps like AnyDesk.",
    type: "High",
  }
];

const TOPICS = [
  {
    title: "Banking Safety",
    icon: ShieldCheck,
    tips: [
      "Never share your OTP, PIN, or CVV.",
      "Banks will never call you to verify details.",
      "Check the URL for 'https' before entering net banking."
    ]
  },
  {
    title: "UPI & Payment Scams",
    icon: AlertTriangle,
    tips: [
      "Entering a UPI PIN is ONLY for sending money, never for receiving.",
      "Beware of 'collect requests' from unknown IDs.",
      "Do not scan QR codes sent by strangers to 'receive cash'."
    ]
  },
  {
    title: "Social Media & Phishing",
    icon: FileWarning,
    tips: [
      "Do not click on links promising free gifts or prizes.",
      "If a friend urgently asks for money via messenger, call them to verify.",
      "Enable Two-Factor Authentication (2FA) on all accounts."
    ]
  }
];

export default function AwarenessHub() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-primary" />
          Cyber Safety Learning Center
        </h2>
        <p className="text-muted-foreground mt-2">
          Stay informed about the latest threats and learn how to protect your digital identity.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-1 md:col-span-3 bg-red-500/5 border-red-500/20">
          <CardHeader>
            <CardTitle className="text-red-500 flex items-center gap-2">
              <AlertTriangle />
              Latest Scam Alerts
            </CardTitle>
            <CardDescription>Active threats currently targeting citizens</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {ALERTS.map((alert, i) => (
                <div key={i} className="p-4 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-sm">{alert.title}</h4>
                    <span className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-500 font-medium">
                      {alert.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{alert.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {TOPICS.map((topic, i) => {
          const Icon = topic.icon;
          return (
            <Card key={i} className="bg-background/40 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon className="text-primary w-5 h-5" />
                  {topic.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {topic.tips.map((tip, j) => (
                    <li key={j} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-1">•</span>
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-col md:flex-row gap-4 p-6 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-primary/20 items-center justify-between">
        <div>
          <h3 className="text-lg font-bold">Victim of a Cyber Crime?</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Report it immediately. The "Golden Hour" is critical for recovering stolen funds.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/report-crime" className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm">
            Report Now
          </Link>
          <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="px-5 py-2.5 bg-background border border-border rounded-lg font-medium hover:bg-muted transition-colors text-sm">
            Visit Gov Portal
          </a>
        </div>
      </div>
    </div>
  );
}
