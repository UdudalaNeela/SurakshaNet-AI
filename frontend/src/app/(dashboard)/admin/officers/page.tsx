"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldAlert, Plus, Loader2, MoreVertical, Trash, UserX, Edit2, Key, Check, Ban } from "lucide-react";
import { fetchWithAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";

export default function OfficersManagement() {
  const [officers, setOfficers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    officer_id: "",
    full_name: "",
    email: "",
    password: "",
    mobile_number: "",
    designation: "",
    rank: "",
    district: "",
    state: "",
    department: "",
    police_station: "",
    badge_number: ""
  });

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingOfficerId, setEditingOfficerId] = useState<string | null>(null);

  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [resettingOfficerId, setResettingOfficerId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState("");


  const loadOfficers = async () => {
    try {
      const res = await fetchWithAuth("/admin/officers");
      if (res.ok) {
        const data = await res.json();
        setOfficers(data.officers || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOfficers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetchWithAuth("/admin/officers", {
        method: "POST",
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsDialogOpen(false);
        setFormData({
          officer_id: "", full_name: "", email: "", password: "", mobile_number: "",
          designation: "", rank: "", district: "", state: "", department: "", police_station: "", badge_number: ""
        });
        loadOfficers();
      } else {
        const err = await res.json();
        setError(err.detail || "Failed to create officer");
      }
    } catch (e: any) {
      setError(e.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuspend = async (officerId: string) => {
    if (!confirm("Are you sure you want to suspend this officer?")) return;
    try {
      const res = await fetchWithAuth(`/admin/officers/${officerId}/suspend`, { method: "PUT" });
      if (res.ok) loadOfficers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleApprove = async (officerId: string) => {
    try {
      const res = await fetchWithAuth(`/admin/officers/${officerId}/approve`, { method: "PUT" });
      if (res.ok) loadOfficers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDisable = async (officerId: string) => {
    try {
      const res = await fetchWithAuth(`/admin/officers/${officerId}/disable`, { method: "PUT" });
      if (res.ok) loadOfficers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (officerId: string) => {
    if (!confirm("Are you sure you want to delete this officer? This cannot be undone.")) return;
    try {
      const res = await fetchWithAuth(`/admin/officers/${officerId}`, { method: "DELETE" });
      if (res.ok) loadOfficers();
    } catch (e) {
      console.error(e);
    }
  };

  const openEditDialog = (officer: any) => {
    setFormData({
      officer_id: officer.officer_id || "",
      full_name: officer.full_name || "",
      email: officer.email || "",
      password: "",
      mobile_number: officer.mobile_number || "",
      designation: officer.designation || "",
      rank: officer.rank || "",
      district: officer.district || "",
      state: officer.state || "",
      department: officer.department || "",
      police_station: officer.police_station || "",
      badge_number: officer.badge_number || ""
    });
    setEditingOfficerId(officer.officer_id);
    setIsEditDialogOpen(true);
  };

  const handleUpdateOfficer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOfficerId) return;
    setIsSubmitting(true);
    setError("");

    try {
      const updateData = { ...formData };
      delete (updateData as any).password;
      delete (updateData as any).officer_id; // don't update ID

      const res = await fetchWithAuth(`/admin/officers/${editingOfficerId}`, {
        method: "PUT",
        body: JSON.stringify(updateData)
      });

      if (res.ok) {
        setIsEditDialogOpen(false);
        setEditingOfficerId(null);
        loadOfficers();
      } else {
        const err = await res.json();
        setError(err.detail || "Failed to update officer");
      }
    } catch (e: any) {
      setError(e.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openResetDialog = (officerId: string) => {
    setResettingOfficerId(officerId);
    setNewPassword("");
    setIsResetDialogOpen(true);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resettingOfficerId) return;
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetchWithAuth(`/admin/officers/${resettingOfficerId}/reset-password`, {
        method: "PUT",
        body: JSON.stringify({ new_password: newPassword })
      });

      if (res.ok) {
        setIsResetDialogOpen(false);
        setResettingOfficerId(null);
      } else {
        const err = await res.json();
        setError(err.detail || "Failed to reset password");
      }
    } catch (e: any) {
      setError(e.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-8 h-8 text-primary" />
            Officer Management
          </h2>
          <p className="text-muted-foreground mt-2">
            Add, suspend, or remove cyber crime officers.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" /> Add Officer
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Officer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateOfficer} className="space-y-4">
              {error && <div className="text-red-500 text-sm p-2 bg-red-500/10 rounded">{error}</div>}
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Officer ID</label>
                  <input required name="officer_id" value={formData.officer_id} onChange={handleChange} className="w-full h-10 bg-muted/50 border border-border/50 rounded-lg px-3" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input required name="full_name" value={formData.full_name} onChange={handleChange} className="w-full h-10 bg-muted/50 border border-border/50 rounded-lg px-3" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Official Email</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full h-10 bg-muted/50 border border-border/50 rounded-lg px-3" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <input required type="password" name="password" value={formData.password} onChange={handleChange} className="w-full h-10 bg-muted/50 border border-border/50 rounded-lg px-3" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mobile Number</label>
                  <input required name="mobile_number" value={formData.mobile_number} onChange={handleChange} className="w-full h-10 bg-muted/50 border border-border/50 rounded-lg px-3" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Badge Number</label>
                  <input required name="badge_number" value={formData.badge_number} onChange={handleChange} className="w-full h-10 bg-muted/50 border border-border/50 rounded-lg px-3" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Designation</label>
                  <input required name="designation" value={formData.designation} onChange={handleChange} className="w-full h-10 bg-muted/50 border border-border/50 rounded-lg px-3" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rank</label>
                  <input required name="rank" value={formData.rank} onChange={handleChange} className="w-full h-10 bg-muted/50 border border-border/50 rounded-lg px-3" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Department</label>
                  <input required name="department" value={formData.department} onChange={handleChange} className="w-full h-10 bg-muted/50 border border-border/50 rounded-lg px-3" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">District</label>
                  <input required name="district" value={formData.district} onChange={handleChange} className="w-full h-10 bg-muted/50 border border-border/50 rounded-lg px-3" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Police Station</label>
                  <input required name="police_station" value={formData.police_station} onChange={handleChange} className="w-full h-10 bg-muted/50 border border-border/50 rounded-lg px-3" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">State</label>
                  <input required name="state" value={formData.state} onChange={handleChange} className="w-full h-10 bg-muted/50 border border-border/50 rounded-lg px-3" />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Create Officer Account
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-background/40 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle>Registered Officers</CardTitle>
          <CardDescription>A list of all cyber crime officers with platform access.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 text-center text-muted-foreground animate-pulse">Loading officers...</div>
          ) : officers.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">No officers found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border/50">
                  <tr>
                    <th className="px-4 py-3">Officer ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">District/State</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {officers.map((officer) => (
                    <tr key={officer.id} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-3 font-medium">{officer.officer_id}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold">{officer.full_name}</div>
                        <div className="text-xs text-muted-foreground">{officer.email}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div>{officer.department}</div>
                        <div className="text-xs text-muted-foreground">{officer.designation}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div>{officer.district}</div>
                        <div className="text-xs text-muted-foreground">{officer.state}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${officer.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          {officer.status || "Active"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {officer.status !== "Active" && (
                            <button onClick={() => handleApprove(officer.officer_id)} title="Approve Officer" className="p-2 hover:bg-green-500/10 text-green-500 rounded transition-colors">
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {officer.status === "Active" && (
                            <button onClick={() => handleDisable(officer.officer_id)} title="Disable Officer" className="p-2 hover:bg-red-500/10 text-red-500 rounded transition-colors">
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => openEditDialog(officer)} title="Edit Officer" className="p-2 hover:bg-blue-500/10 text-blue-500 rounded transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => openResetDialog(officer.officer_id)} title="Reset Password" className="p-2 hover:bg-orange-500/10 text-orange-500 rounded transition-colors">
                            <Key className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(officer.officer_id)} title="Delete Officer" className="p-2 hover:bg-red-500/10 text-red-500 rounded transition-colors">
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Officer</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateOfficer} className="space-y-4">
            {error && <div className="text-red-500 text-sm p-2 bg-red-500/10 rounded">{error}</div>}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <input required name="full_name" value={formData.full_name} onChange={handleChange} className="w-full h-10 bg-muted/50 border border-border/50 rounded-lg px-3" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Official Email</label>
                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full h-10 bg-muted/50 border border-border/50 rounded-lg px-3" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mobile Number</label>
                <input required name="mobile_number" value={formData.mobile_number} onChange={handleChange} className="w-full h-10 bg-muted/50 border border-border/50 rounded-lg px-3" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Badge Number</label>
                <input required name="badge_number" value={formData.badge_number} onChange={handleChange} className="w-full h-10 bg-muted/50 border border-border/50 rounded-lg px-3" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Designation</label>
                <input required name="designation" value={formData.designation} onChange={handleChange} className="w-full h-10 bg-muted/50 border border-border/50 rounded-lg px-3" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Rank</label>
                <input required name="rank" value={formData.rank} onChange={handleChange} className="w-full h-10 bg-muted/50 border border-border/50 rounded-lg px-3" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Department</label>
                <input required name="department" value={formData.department} onChange={handleChange} className="w-full h-10 bg-muted/50 border border-border/50 rounded-lg px-3" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">District</label>
                <input required name="district" value={formData.district} onChange={handleChange} className="w-full h-10 bg-muted/50 border border-border/50 rounded-lg px-3" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Police Station</label>
                <input required name="police_station" value={formData.police_station} onChange={handleChange} className="w-full h-10 bg-muted/50 border border-border/50 rounded-lg px-3" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">State</label>
                <input required name="state" value={formData.state} onChange={handleChange} className="w-full h-10 bg-muted/50 border border-border/50 rounded-lg px-3" />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Officer Password</DialogTitle>
            <DialogDescription>Enter a new password for the officer. They will use this new password to log in.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetPassword} className="space-y-4 pt-4">
            {error && <div className="text-red-500 text-sm p-2 bg-red-500/10 rounded">{error}</div>}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <input 
                required 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                className="w-full h-10 bg-muted/50 border border-border/50 rounded-lg px-3" 
                placeholder="Minimum 8 characters"
                minLength={8}
              />
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <button type="button" onClick={() => setIsResetDialogOpen(false)} className="px-4 py-2 border border-border/50 rounded-lg hover:bg-muted/50 transition-colors">
                Cancel
              </button>
              <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                Reset Password
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
