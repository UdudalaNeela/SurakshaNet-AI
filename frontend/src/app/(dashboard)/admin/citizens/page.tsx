"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, ArrowLeft, Loader2 } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CitizensManagement() {
  const [citizens, setCitizens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadCitizens = async () => {
    try {
      const res = await fetchWithAuth("/admin/citizens");
      if (res.ok) {
        const data = await res.json();
        setCitizens(data.citizens || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCitizens();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/dashboard" className="p-2 hover:bg-muted rounded-lg transition-colors border border-border/50">
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <User className="w-8 h-8 text-primary" />
            Citizen Directory
          </h2>
          <p className="text-muted-foreground mt-2">
            View all registered citizens on the SurakshaNet platform.
          </p>
        </div>
      </div>

      <Card className="bg-background/40 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Registered Citizens</CardTitle>
          <CardDescription>A complete list of registered citizen accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground animate-pulse">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                <span>Loading citizens...</span>
              </div>
            </div>
          ) : citizens.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">No citizens registered yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border/50">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">District</th>
                    <th className="px-4 py-3">State</th>
                    <th className="px-4 py-3">Aadhaar (Optional)</th>
                    <th className="px-4 py-3">Registered Date</th>
                  </tr>
                </thead>
                <tbody>
                  {citizens.map((citizen) => (
                    <tr key={citizen.id} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-4 font-semibold">{citizen.full_name}</td>
                      <td className="px-4 py-4">
                        <div>{citizen.email}</div>
                        <div className="text-xs text-muted-foreground">{citizen.mobile_number}</div>
                      </td>
                      <td className="px-4 py-4">{citizen.district || citizen.city || "N/A"}</td>
                      <td className="px-4 py-4">{citizen.state}</td>
                      <td className="px-4 py-4 font-mono">{citizen.aadhaar || "Not Provided"}</td>
                      <td className="px-4 py-4 text-muted-foreground text-xs">
                        {citizen.created_at ? new Date(citizen.created_at).toLocaleDateString() : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
