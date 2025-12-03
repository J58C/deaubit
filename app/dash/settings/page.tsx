//app/dash/settings/page.tsx

"use client";

import { useState, useEffect } from "react";
import { User, Lock, Loader2, Save, Shield, Trash2, AlertTriangle, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    fetch("/api/session").then(r => r.json()).then(data => {
        if(data.user?.name) setName(data.user.name);
    });
  }, []);

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setMessage(""); setError("");
    try {
      const res = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, oldPassword, newPassword }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal update");
      
      setMessage("PROFILE UPDATED SUCCESSFULLY");
      setOldPassword(""); setNewPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAccount(e: React.FormEvent) {
    e.preventDefault();
    setDeleteLoading(true); setDeleteError("");

    try {
      const res = await fetch("/api/auth/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal menghapus akun");

      window.location.href = "/";
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Gagal");
      setDeleteLoading(false);
    }
  }

  return (
    <div className="w-full space-y-10 pb-20">
      
      <div className="border-b-4 border-[var(--db-border)] pb-6">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-[var(--db-text)]">Account Settings</h1>
        <p className="text-sm font-bold text-[var(--db-text-muted)] mt-2">Manage your identity & security preferences.</p>
      </div>

      <form onSubmit={handleUpdateProfile} className="space-y-12">
        
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="bg-[var(--db-accent)] p-2 border-2 border-[var(--db-border)] shadow-[4px_4px_0px_0px_var(--db-border)]">
                    <User className="h-6 w-6 text-[var(--db-accent-fg)]" />
                </div>
                <h2 className="text-2xl font-black uppercase text-[var(--db-text)]">Basic Profile</h2>
            </div>
            
            <div className="pl-0 md:pl-[3.5rem]">
                <label className="font-black text-xs uppercase mb-2 block text-[var(--db-text-muted)] tracking-wider">Display Name</label>
                <input 
                    className="w-full bg-[var(--db-bg)] border-2 border-[var(--db-border)] p-4 font-bold text-[var(--db-text)] focus:outline-none focus:shadow-[6px_6px_0px_0px_var(--db-border)] transition-all placeholder:text-[var(--db-text-muted)] placeholder:font-normal"
                    placeholder="Your Cool Name" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>
        </div>

        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="bg-[var(--db-primary)] p-2 border-2 border-[var(--db-border)] text-[var(--db-primary-fg)] shadow-[4px_4px_0px_0px_var(--db-border)]">
                    <Shield className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-black uppercase text-[var(--db-text)]">Security</h2>
            </div>

            <div className="pl-0 md:pl-[3.5rem] grid gap-8 md:grid-cols-2">
                <div>
                    <label className="font-black text-xs uppercase mb-2 block text-[var(--db-text-muted)] tracking-wider">Current Password</label>
                    <div className="relative">
                        <input 
                            type="password" 
                            className="w-full bg-[var(--db-bg)] border-2 border-[var(--db-border)] p-4 pl-12 font-bold text-[var(--db-text)] focus:outline-none focus:shadow-[6px_6px_0px_0px_var(--db-border)] transition-all placeholder:text-[var(--db-text-muted)] placeholder:font-normal"
                            placeholder="••••••••" 
                            value={oldPassword}
                            onChange={e => setOldPassword(e.target.value)}
                        />
                        <Lock className="absolute left-4 top-4 h-5 w-5 text-[var(--db-text-muted)]" />
                    </div>
                </div>
                <div>
                    <label className="font-black text-xs uppercase mb-2 block text-[var(--db-text-muted)] tracking-wider">New Password</label>
                    <div className="relative">
                        <input 
                            type="password" 
                            className="w-full bg-[var(--db-bg)] border-2 border-[var(--db-border)] p-4 pl-12 font-bold text-[var(--db-text)] focus:outline-none focus:shadow-[6px_6px_0px_0px_var(--db-border)] transition-all placeholder:text-[var(--db-text-muted)] placeholder:font-normal"
                            placeholder="Min. 6 chars" 
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                        />
                        <Lock className="absolute left-4 top-4 h-5 w-5 text-[var(--db-text-muted)]" />
                    </div>
                </div>
            </div>
        </div>

        <div className="pl-0 md:pl-[3.5rem] pt-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex-1 w-full">
                {message && (
                    <div className="p-3 bg-[var(--db-success)] border-2 border-[var(--db-border)] text-white font-bold text-sm text-center uppercase shadow-[4px_4px_0px_0px_var(--db-border)]">
                        {message}
                    </div>
                )}
                {error && (
                    <div className="p-3 bg-[var(--db-danger)] border-2 border-[var(--db-border)] text-white font-bold text-sm text-center uppercase shadow-[4px_4px_0px_0px_var(--db-border)]">
                        ❌ {error}
                    </div>
                )}
            </div>

            <button type="submit" disabled={loading} className="w-full md:w-auto bg-[var(--db-text)] text-[var(--db-bg)] py-4 px-10 border-2 border-[var(--db-border)] font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_var(--db-border)] hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_var(--db-border)] active:translate-y-0 active:shadow-[2px_2px_0px_0px_var(--db-border)] transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                {loading ? <Loader2 className="h-5 w-5 animate-spin"/> : <><Save className="h-5 w-5"/> SAVE CHANGES</>}
            </button>
        </div>
      </form>

      <div className="mt-20 border-t-4 border-[var(--db-border)] border-dashed pt-10">
        <div className="flex items-center gap-3 mb-6">
            <div className="bg-[var(--db-danger)] p-2 border-2 border-[var(--db-border)] text-white shadow-[4px_4px_0px_0px_var(--db-border)]">
                <AlertTriangle className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-black uppercase text-[var(--db-danger)]">Danger Zone</h2>
        </div>

        <div className="ml-0 md:ml-[3.5rem] border-4 border-[var(--db-danger)] bg-red-50 p-6 shadow-[8px_8px_0px_0px_var(--db-danger)]">
            <h3 className="text-lg font-black uppercase text-red-900 mb-2">DELETE ACCOUNT PERMANENTLY</h3>
            <p className="text-sm font-bold text-red-800 mb-6">
                Once you delete your account, there is no going back. All your shortlinks, analytics data, and settings will be permanently removed. Please be certain.
            </p>
            <button 
                onClick={() => setShowDeleteModal(true)}
                className="bg-[var(--db-danger)] text-white font-black uppercase py-3 px-6 border-2 border-[var(--db-border)] hover:shadow-[4px_4px_0px_0px_var(--db-border)] hover:-translate-y-1 transition-all flex items-center gap-2"
            >
                <Trash2 className="h-5 w-5" /> DELETE MY ACCOUNT
            </button>
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in">
           <div className="w-full max-w-md bg-[var(--db-surface)] border-4 border-[var(--db-border)] p-8 shadow-[12px_12px_0px_0px_var(--db-danger)] relative">
              <button 
                 onClick={() => setShowDeleteModal(false)} 
                 className="absolute top-4 right-4 border-2 border-[var(--db-border)] p-1 hover:bg-[var(--db-bg)] text-[var(--db-text)]"
              >
                 <X className="h-6 w-6" />
              </button>

              <div className="text-center mb-8">
                 <div className="inline-block p-4 bg-[var(--db-danger)] border-4 border-[var(--db-border)] rounded-full mb-4 text-white shadow-[4px_4px_0px_0px_var(--db-border)]">
                    <Trash2 className="h-8 w-8" />
                 </div>
                 <h2 className="text-3xl font-black uppercase leading-none text-[var(--db-text)] mb-2">FINAL WARNING</h2>
                 <p className="font-bold text-[var(--db-text-muted)] text-sm">Enter your password to confirm deletion.</p>
              </div>

              <form onSubmit={handleDeleteAccount} className="space-y-4">
                 <input 
                    type="password" 
                    className="w-full bg-[var(--db-bg)] border-4 border-[var(--db-border)] p-4 font-bold text-center text-lg text-[var(--db-text)] focus:outline-none focus:shadow-[6px_6px_0px_0px_var(--db-border)] transition-all placeholder:text-[var(--db-text-muted)]"
                    placeholder="YOUR PASSWORD" 
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    autoFocus
                    required
                 />

                 {deleteError && (
                    <div className="bg-[var(--db-danger)] text-white font-bold p-3 border-2 border-[var(--db-border)] text-center uppercase text-sm">
                       {deleteError}
                    </div>
                 )}

                 <div className="flex gap-3 pt-4">
                    <button 
                       type="button"
                       onClick={() => setShowDeleteModal(false)}
                       className="flex-1 py-4 font-black border-4 border-[var(--db-border)] text-[var(--db-text)] hover:bg-[var(--db-bg)] uppercase"
                    >
                       Cancel
                    </button>
                    <button 
                       type="submit"
                       disabled={deleteLoading}
                       className="flex-1 py-4 font-black bg-[var(--db-danger)] text-white border-4 border-[var(--db-border)] hover:shadow-[4px_4px_0px_0px_var(--db-border)] hover:-translate-y-1 transition-all uppercase flex justify-center items-center gap-2"
                    >
                       {deleteLoading ? <Loader2 className="animate-spin h-5 w-5"/> : "CONFIRM DELETE"}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
}
