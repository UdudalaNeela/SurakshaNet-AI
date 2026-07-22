"use client";
import CitizenRegisterForm from '@/components/CitizenRegisterForm';

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldAlert, User, Briefcase, Settings, Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";



import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetRole = searchParams.get("role") || "citizen";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminId, setAdminId] = useState("");
  const [officerId, setOfficerId] = useState("");
  


  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  // Forgot Password fields
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMobile, setForgotMobile] = useState("");
  const [forgotNewPassword, setForgotNewPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");

  const getRoleInfo = () => {
    switch (targetRole) {
      case "officer":
        return { title: isRegister ? "Officer Registration" : "Officer Login", icon: Briefcase, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/30" };
      case "admin":
        return { title: isRegister ? "Admin Registration" : "Admin Login", icon: Settings, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30" };
      default:
        return { title: isRegister ? "Citizen Registration" : "Citizen Login", icon: User, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30" };
    }
  };

  const roleInfo = getRoleInfo();
  const Icon = roleInfo.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isRegister && targetRole !== "citizen") {
        if (password !== confirmPassword) {
          throw new Error("Passwords do not match");
        }
        
        const regRes = await fetch("http://127.0.0.1:8000/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            role: targetRole,
          }),
        });

        if (!regRes.ok) {
          const err = await regRes.json();
          throw new Error(err.detail || "Registration failed");
        }
        
        // After successful registration, log them in automatically
        const loginRes = await fetch("http://127.0.0.1:8000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, role: "citizen" }),
        });
        
        if (!loginRes.ok) throw new Error("Auto-login failed. Please sign in manually.");
        const data = await loginRes.json();
        localStorage.setItem("surakshanet_token", data.access_token);
        router.push("/citizen/dashboard");
        return;
      }

      // Login Flow
      interface LoginPayload {
        email: string;
        password: string;
        role: string;
        officer_id?: string;
      }

      const payload: LoginPayload = {
        email,
        password,
        role: targetRole,
      };
      if (targetRole === "officer") {
        if (!officerId) throw new Error("Officer ID is required");
        payload.officer_id = officerId;
      }

      const res = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Invalid credentials");
      }

      const data = await res.json();
      localStorage.setItem("surakshanet_token", data.access_token);

      // Verify Role and redirect
      const profileRes = await fetch("http://127.0.0.1:8000/auth/profile", {
        headers: { Authorization: `Bearer ${data.access_token}` },
      });

      if (profileRes.ok) {
        const user = await profileRes.json();
        const userRole = user.role || targetRole;

        if (userRole === "admin") {
          router.push("/admin/dashboard");
        } else if (userRole === "officer") {
          router.push("/officer/dashboard");
        } else {
          router.push("/citizen/dashboard");
        }
      } else {
        throw new Error("Failed to load profile");
      }
    } catch (err) {
  setError(err instanceof Error ? err.message : "An unexpected error occurred");
} finally {
  setLoading(false);
}    
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotError("");
    setForgotSuccess("");
    try {
      const res = await fetch("http://127.0.0.1:8000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: forgotEmail,
          mobile_number: forgotMobile,
          new_password: forgotNewPassword
        })
      });
      if (res.ok) {
        setForgotSuccess("Password reset successfully! You can now sign in.");
        setForgotEmail("");
        setForgotMobile("");
        setForgotNewPassword("");
      } else {
        const err = await res.json();
        throw new Error(err.detail || "Failed to reset password");
      }
    } catch (err) {
  setForgotError(err instanceof Error ? err.message : "An unexpected error occurred");
} finally {
  setForgotLoading(false);
}    
  };

  return (
    <div className="min-h-full bg-background flex flex-col items-center justify-center p-6 relative overflow-y-auto">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-blue-600/20 to-transparent" />
      </div>
      
      <div className="z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
            <ShieldAlert className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              SurakshaNet AI
            </span>
          </Link>

          <div className={`w-16 h-16 mx-auto rounded-2xl ${roleInfo.bg} ${roleInfo.border} border flex items-center justify-center mb-4`}>
            <Icon className={`w-8 h-8 ${roleInfo.color}`} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{roleInfo.title}</h1>
          <p className="text-muted-foreground text-sm mt-2">
            {isRegister ? "Create a new account" : "Sign in to access your portal"}
          </p>
        </div>

        {isRegister && targetRole === "citizen" ? (
          <>
            <CitizenRegisterForm />
            <div className="mt-6 text-center text-sm w-full">
              <span className="text-muted-foreground">Already have an account?</span>
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="text-primary hover:underline font-medium ml-2"
              >
                Sign In
              </button>
            </div>
          </>
        ) : (
        <div className="bg-background/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div role="alert" aria-live="assertive" className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

            {isRegister && targetRole === "officer" ? (
              <div className="space-y-6 py-4 text-center animate-in fade-in duration-300">
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm leading-relaxed font-medium">
                  Officer accounts can only be created by the Cyber Crime Department Administrator.
                </div>
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="w-full h-11 border border-border/50 rounded-lg font-medium hover:bg-muted/50 transition-colors"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {!isRegister && targetRole === "officer" && (
                  <div className="space-y-2">
                    <label htmlFor="officerId" className="text-sm font-medium">Officer ID</label>
                    <input
                      id="officerId"
                      type="text"
                      required
                      value={officerId}
                      onChange={(e) => setOfficerId(e.target.value)}
                      disabled={loading}
                      className="w-full h-11 bg-muted/50 border border-border/50 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="OFF-101"
                    />
                  </div>
                )}

                <div className="space-y-2">
                   <label htmlFor="email" className="text-sm font-medium">
                     {targetRole === 'admin' ? 'Official Government Email' : targetRole === 'officer' ? 'Official Email' : 'Email Address'}
                   </label>
                   <input
                     id="email"
                     type="email"
                     required
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     disabled={loading}
                     className="w-full h-11 bg-muted/50 border border-border/50 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                     placeholder="email@example.com"
                   />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Password</label>
                    {!isRegister && targetRole === "citizen" && (
                      <button
                        type="button"
                        onClick={() => {
                          setForgotError("");
                          setForgotSuccess("");
                          setIsForgotOpen(true);
                        }}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-11 bg-muted/50 border border-border/50 rounded-lg px-4 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="••••••••"
                  />
                </div>

                {isRegister && (
                  <div className="space-y-2">
                     <label htmlFor="password" className="text-sm font-medium">Password</label>
                     <div className="relative">
                       <input
                         id="password"
                         type={showPassword ? "text" : "password"}
                         required
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         disabled={loading}
                         className="w-full h-11 bg-muted/50 border border-border/50 rounded-lg px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50"
                         placeholder="••••••••"
                       />
                       <button
                         type="button"
                         onClick={() => setShowPassword(!showPassword)}
                         className="absolute inset-y-0 right-2 flex items-center text-muted-foreground"
                         aria-label={showPassword ? "Hide password" : "Show password"}
                       >
                         {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                       </button>
                     </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 mt-6"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isRegister ? "Create Account" : "Sign In"}
                </button>
              </div>
            )}
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              {isRegister ? "Already have an account?" : "New to SurakshaNet?"}
            </span>
            {targetRole !== "admin" && (
              <button
                type="button"
                onClick={() => setIsRegister(!isRegister)}
                className="text-primary hover:underline font-medium"
              >
                {isRegister ? "Sign In" : "Register here"}
              </button>
            )}
          </div>
        </div>
        )}
      </div>

      <Dialog open={isForgotOpen} onOpenChange={setIsForgotOpen}>
        <DialogContent className="max-w-md bg-background border border-border/50">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Verify your email and mobile number to reset your password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-4 pt-4">
                {forgotError && (
                  <div role="alert" aria-live="assertive" className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                    {forgotError}
                  </div>
                )}
            {forgotSuccess && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-sm text-center">
                {forgotSuccess}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <input
                required
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full h-10 bg-muted/50 border border-border/50 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Registered Mobile Number</label>
              <input
                required
                type="tel"
                value={forgotMobile}
                onChange={(e) => setForgotMobile(e.target.value)}
                className="w-full h-10 bg-muted/50 border border-border/50 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="9876543210"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <input
                required
                type="password"
                value={forgotNewPassword}
                onChange={(e) => setForgotNewPassword(e.target.value)}
                className="w-full h-10 bg-muted/50 border border-border/50 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="••••••••"
                minLength={8}
              />
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsForgotOpen(false)}
                className="px-4 py-2 border border-border/50 rounded-lg hover:bg-muted/50 transition-colors text-sm"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={forgotLoading}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                {forgotLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Reset Password
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
