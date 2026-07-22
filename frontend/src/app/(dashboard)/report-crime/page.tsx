"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertOctagon, Send, CheckCircle2 } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";
import Link from "next/link";

export default function ReportCrime() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{case_id: string} | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    email: "",
    state: "",
    city: "",
    scam_type: "Financial Fraud",
    description: "",
    amount_lost: "",
    bank_name: "",
    upi_id: "",
    transaction_id: "",
    suspect_phone: "",
    suspect_website: ""
  });

  const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        amount_lost: parseFloat(formData.amount_lost) || 0
      };
      
      const res = await fetchWithAuth(`/complaint/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        setSuccess(await res.json());
      } else {
        alert("Failed to submit complaint. Please check all fields.");
      }
    } catch (err) {
      console.error(err);
    }
    setSubmitting(false);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in duration-500">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Complaint Registered Successfully</h2>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Your report has been securely saved in the SurakshaNet AI database and an officer will be assigned shortly.
        </p>
        
        <Card className="w-full max-w-md bg-background/40 backdrop-blur-sm border-primary/50 mb-8">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Your Case ID</p>
            <p className="text-2xl font-mono font-bold text-primary tracking-wider">{success.case_id}</p>
          </CardContent>
        </Card>
        
        <Link href={`/track-complaint?id=${success.case_id}`} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
          Track Investigation Status
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-orange-500">
          <AlertOctagon className="w-8 h-8" />
          Report Cyber Crime
        </h2>
        <p className="text-muted-foreground mt-2">
          File an official cyber crime complaint. All data is encrypted and securely stored.
        </p>
      </div>

      <Card className="bg-background/40 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Complaint Registration Form</CardTitle>
          <CardDescription>Fields marked with * are required.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-border/50 pb-2">1. Victim Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name *</label>
                  <input required name="name" value={formData.name} onChange={handleChange} className="w-full bg-muted/50 border border-border/50 rounded-lg p-2.5 text-sm" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Number *</label>
                  <input required name="phone_number" value={formData.phone_number} onChange={handleChange} className="w-full bg-muted/50 border border-border/50 rounded-lg p-2.5 text-sm" placeholder="10-digit number" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address *</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-muted/50 border border-border/50 rounded-lg p-2.5 text-sm" placeholder="email@example.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">State *</label>
                    <input required name="state" value={formData.state} onChange={handleChange} className="w-full bg-muted/50 border border-border/50 rounded-lg p-2.5 text-sm" placeholder="State" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">City *</label>
                    <input required name="city" value={formData.city} onChange={handleChange} className="w-full bg-muted/50 border border-border/50 rounded-lg p-2.5 text-sm" placeholder="City" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-border/50 pb-2 mt-8">2. Incident Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Scam Category *</label>
                  <select name="scam_type" value={formData.scam_type} onChange={handleChange} className="w-full bg-muted/50 border border-border/50 rounded-lg p-2.5 text-sm">
                    <option>Financial Fraud (UPI/Banking)</option>
                    <option>Social Media Harassment</option>
                    <option>Identity Theft</option>
                    <option>Fake E-Commerce</option>
                    <option>Job/Investment Scam</option>
                    <option>Digital Arrest / Extortion</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Description of Incident *</label>
                  <textarea required name="description" value={formData.description} onChange={handleChange} className="w-full h-24 bg-muted/50 border border-border/50 rounded-lg p-2.5 text-sm resize-none" placeholder="Please describe exactly what happened..." minLength={20}></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount Lost (₹)</label>
                  <input type="number" name="amount_lost" value={formData.amount_lost} onChange={handleChange} className="w-full bg-muted/50 border border-border/50 rounded-lg p-2.5 text-sm" placeholder="0" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bank Name</label>
                  <input name="bank_name" value={formData.bank_name} onChange={handleChange} className="w-full bg-muted/50 border border-border/50 rounded-lg p-2.5 text-sm" placeholder="e.g. HDFC, SBI" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">UPI ID Used for Transaction</label>
                  <input name="upi_id" value={formData.upi_id} onChange={handleChange} className="w-full bg-muted/50 border border-border/50 rounded-lg p-2.5 text-sm" placeholder="example@okhdfcbank" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Transaction ID</label>
                  <input name="transaction_id" value={formData.transaction_id} onChange={handleChange} className="w-full bg-muted/50 border border-border/50 rounded-lg p-2.5 text-sm" placeholder="UTR or Transaction Ref" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b border-border/50 pb-2 mt-8">3. Suspect Details (If known)</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Suspect Phone Number</label>
                  <input name="suspect_phone" value={formData.suspect_phone} onChange={handleChange} className="w-full bg-muted/50 border border-border/50 rounded-lg p-2.5 text-sm" placeholder="Number used by scammer" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Suspect Website/App</label>
                  <input name="suspect_website" value={formData.suspect_website} onChange={handleChange} className="w-full bg-muted/50 border border-border/50 rounded-lg p-2.5 text-sm" placeholder="Fraudulent URL or App Name" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {submitting ? (
                  <span className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Official Complaint
                  </>
                )}
              </button>
              <p className="text-xs text-center text-muted-foreground mt-3">
                By submitting this form, you acknowledge that all provided information is accurate to the best of your knowledge. False reporting is a punishable offense.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
