import Link from "next/link";
import { ShieldAlert, User, Briefcase, Settings } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-blue-600/30 to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-purple-600/20 to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl w-full text-center space-y-12">
        <div className="space-y-4">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldAlert className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            SurakshaNet AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            India&apos;s most advanced digital public safety platform. Select your portal to continue.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/login?role=citizen" className="group">
            <div className="h-full bg-background/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8 hover:bg-muted/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/10 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all" />
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6 border border-blue-500/30">
                <User className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Citizen Portal</h3>
              <p className="text-muted-foreground">
                Report cyber crimes, track your complaints, and access AI-powered fraud verification tools.
              </p>
            </div>
          </Link>

          <Link href="/login?role=officer" className="group">
            <div className="h-full bg-background/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8 hover:bg-muted/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all" />
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 border border-purple-500/30">
                <Briefcase className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Cyber Crime Officer</h3>
              <p className="text-muted-foreground">
                Access the investigation workspace, analyze AI fraud rings, and generate FIRs.
              </p>
            </div>
          </Link>

          <Link href="/login?role=admin" className="group">
            <div className="h-full bg-background/50 backdrop-blur-xl border border-border/50 rounded-2xl p-8 hover:bg-muted/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-red-500/10 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl group-hover:bg-red-500/20 transition-all" />
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mb-6 border border-red-500/30">
                <Settings className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Admin Portal</h3>
              <p className="text-muted-foreground">
                Manage global platform health, user roles, and view system-wide analytics.
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* ==== Sections ==== */}
      <section id="about" className="w-full max-w-5xl py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">About SurakshaNet AI</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          SurakshaNet AI combines cutting‑edge machine learning with a comprehensive fraud‑detection ecosystem to protect citizens, businesses, and government agencies from digital scams.
        </p>
      </section>

      <section id="features" className="w-full max-w-5xl p-10 bg-slate-900 border border-blue-500 rounded-[20px] shadow-[0_0_30px_rgba(59,130,246,0.2)] mx-auto my-12 transition-all hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]">
        <h2 className="text-4xl font-extrabold text-center text-white mb-10 tracking-tight">Key Features</h2>
        <ul className="grid md:grid-cols-2 gap-x-12 gap-y-6 text-left max-w-4xl mx-auto">
          {[
            "AI‑driven Scam Detection",
            "Fake Currency Verification",
            "OTP & QR Code Checker",
            "Website URL Reputation Scoring",
            "Phone Number Risk Analyzer",
            "AI Copilot for investigative assistance",
            "Real‑time Cyber Awareness alerts",
            "Citizen Complaint tracking"
          ].map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] shrink-0" />
              <span className="text-gray-300 text-lg leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
      </section>

      <section id="ai-scam-detection" className="w-full max-w-5xl p-8 bg-slate-900 border border-blue-500/50 rounded-[20px] shadow-[0_0_20px_rgba(59,130,246,0.1)] mx-auto my-8 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:border-blue-400">
        <h3 className="text-3xl font-bold text-white mb-4">AI Scam Detection</h3>
        <p className="text-gray-300 text-lg leading-relaxed">Leverages deep‑learning models to identify phishing messages, fraudulent emails, and social‑engineering attempts.</p>
      </section>

      <section id="fake-currency-detection" className="w-full max-w-5xl p-8 bg-slate-900 border border-blue-500/50 rounded-[20px] shadow-[0_0_20px_rgba(59,130,246,0.1)] mx-auto my-8 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:border-blue-400">
        <h3 className="text-3xl font-bold text-white mb-4">Fake Currency Detection</h3>
        <p className="text-gray-300 text-lg leading-relaxed">Detects counterfeit notes and digital currency scams using image analysis and blockchain verification.</p>
      </section>

      <section id="otp-checker" className="w-full max-w-5xl p-8 bg-slate-900 border border-blue-500/50 rounded-[20px] shadow-[0_0_20px_rgba(59,130,246,0.1)] mx-auto my-8 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:border-blue-400">
        <h3 className="text-3xl font-bold text-white mb-4">OTP Checker</h3>
        <p className="text-gray-300 text-lg leading-relaxed">Validates one‑time passwords against known attack patterns to prevent OTP‑based fraud.</p>
      </section>

      <section id="qr-checker" className="w-full max-w-5xl p-8 bg-slate-900 border border-blue-500/50 rounded-[20px] shadow-[0_0_20px_rgba(59,130,246,0.1)] mx-auto my-8 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:border-blue-400">
        <h3 className="text-3xl font-bold text-white mb-4">QR Checker</h3>
        <p className="text-gray-300 text-lg leading-relaxed">Scans QR codes for malicious redirects and unsafe payloads.</p>
      </section>

      <section id="url-checker" className="w-full max-w-5xl p-8 bg-slate-900 border border-blue-500/50 rounded-[20px] shadow-[0_0_20px_rgba(59,130,246,0.1)] mx-auto my-8 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:border-blue-400">
        <h3 className="text-3xl font-bold text-white mb-4">Website URL Checker</h3>
        <p className="text-gray-300 text-lg leading-relaxed">Analyzes URLs for phishing, malware, and reputation using threat intelligence feeds.</p>
      </section>

      <section id="phone-checker" className="w-full max-w-5xl p-8 bg-slate-900 border border-blue-500/50 rounded-[20px] shadow-[0_0_20px_rgba(59,130,246,0.1)] mx-auto my-8 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:border-blue-400">
        <h3 className="text-3xl font-bold text-white mb-4">Phone Number Checker</h3>
        <p className="text-gray-300 text-lg leading-relaxed">Cross‑references phone numbers with scam databases and call‑spam registries.</p>
      </section>

      <section id="ai-copilot" className="w-full max-w-5xl p-8 bg-slate-900 border border-blue-500/50 rounded-[20px] shadow-[0_0_20px_rgba(59,130,246,0.1)] mx-auto my-8 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:border-blue-400">
        <h3 className="text-3xl font-bold text-white mb-4">AI Copilot</h3>
        <p className="text-gray-300 text-lg leading-relaxed">Provides contextual assistance to investigators, suggesting next steps and evidence links.</p>
      </section>

      <section id="awareness" className="w-full max-w-5xl p-8 bg-slate-900 border border-blue-500/50 rounded-[20px] shadow-[0_0_20px_rgba(59,130,246,0.1)] mx-auto my-8 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:border-blue-400">
        <h3 className="text-3xl font-bold text-white mb-4">Cyber Awareness</h3>
        <p className="text-gray-300 text-lg leading-relaxed">Educational resources, alerts, and best‑practice guidelines for the public.</p>
      </section>

      <section id="report" className="w-full max-w-5xl p-8 bg-slate-900 border border-blue-500/50 rounded-[20px] shadow-[0_0_20px_rgba(59,130,246,0.1)] mx-auto my-8 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:border-blue-400">
        <h3 className="text-3xl font-bold text-white mb-4">Report Crime</h3>
        <p className="text-gray-300 text-lg leading-relaxed">Submit detailed reports of cyber incidents directly to authorities.</p>
      </section>

      <section id="track" className="w-full max-w-5xl p-8 bg-slate-900 border border-blue-500/50 rounded-[20px] shadow-[0_0_20px_rgba(59,130,246,0.1)] mx-auto my-8 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:border-blue-400">
        <h3 className="text-3xl font-bold text-white mb-4">Track Complaint</h3>
        <p className="text-gray-300 text-lg leading-relaxed">Monitor the status of submitted complaints in real‑time.</p>
      </section>

      <section id="emergency" className="w-full max-w-5xl p-8 bg-slate-900 border border-blue-500/50 rounded-[20px] shadow-[0_0_20px_rgba(59,130,246,0.1)] mx-auto my-8 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:border-blue-400">
        <h3 className="text-3xl font-bold text-white mb-4">Emergency Helpline</h3>
        <p className="text-gray-300 text-lg leading-relaxed">Access a 24/7 helpline for immediate assistance.</p>
      </section>

      <section id="contact" className="w-full max-w-5xl p-8 bg-slate-900 border border-blue-500/50 rounded-[20px] shadow-[0_0_20px_rgba(59,130,246,0.1)] mx-auto my-8 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:border-blue-400 text-center">
        <h3 className="text-3xl font-bold text-white mb-4">Contact Us</h3>
        <p className="text-gray-300 text-lg leading-relaxed">Email: support@surakshanet.ai | Phone: +91‑1800‑123‑456</p>
      </section>

      <footer id="footer" className="w-full py-6 text-center text-sm text-muted-foreground border-t border-border/30">
        © 2026 SurakshaNet AI. All rights reserved.
      </footer>
    </div>
  );
}
