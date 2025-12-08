//app/admin/page.tsx

"use client";

import { useEffect, useState } from "react";
import DeauBitLogo from "@/components/DeauBitLogo";
import UserMenu from "@/components/UserMenu";
import Link from "next/link";
import { 
    LayoutDashboard, Users, Link2, AlertTriangle, 
    Trash2, ExternalLink, Loader2, ArrowLeft, RefreshCw, X 
} from "lucide-react";

interface AdminData {
    reports: any[];
    publicLinks: any[];
    stats: {
        totalUsers: number;
        totalLinks: number;
        pendingReports: number;
    };
}

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"reports" | "public">("reports");
  
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; slug: string | null }>({ show: false, slug: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const [userEmail, setUserEmail] = useState("Admin");
  const [userRole, setUserRole] = useState("ADMIN");

  useEffect(() => {
    fetchSession();
    fetchData();
  }, []);

  async function fetchSession() {
    try {
        const res = await fetch("/api/session");
        const session = await res.json();
        if(session.user) {
            setUserEmail(session.user.email);
            setUserRole(session.user.role);
            if(session.user.role !== "ADMIN") {
                window.location.href = "/dash";
            }
        } else {
            window.location.href = "/";
        }
    } catch {}
  }

  async function fetchData() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data");
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setData(json);
    } catch {

    } finally {
      setLoading(false);
    }
  }

  function confirmDelete(slug: string) {
    setDeleteModal({ show: true, slug });
  }

  async function executeDelete() {
    if (!deleteModal.slug) return;
    setIsDeleting(true);
    try {
        const res = await fetch(`/api/links/${deleteModal.slug}`, { method: "DELETE" });
        if(res.ok) {
            setDeleteModal({ show: false, slug: null });
            fetchData();
        } else {
            alert("Failed to delete");
        }
    } catch {
        alert("Error");
    } finally {
        setIsDeleting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--db-bg)] pb-20">
      
      <header className="bg-[var(--db-surface)] border-b-4 border-[var(--db-border)] p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="bg-red-600 text-white p-1.5 border-2 border-[var(--db-border)]">
             <DeauBitLogo size={24} />
          </div>
          <span className="text-xl font-black uppercase tracking-tighter text-[var(--db-text)] flex items-center gap-2">
            ADMIN <span className="hidden sm:inline bg-red-100 text-red-600 text-[10px] px-2 py-0.5 border border-red-200">GOD MODE</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
            <Link href="/dash" className="hidden sm:flex items-center gap-1 text-xs font-bold text-[var(--db-text-muted)] hover:text-[var(--db-text)]">
                <ArrowLeft className="h-3 w-3"/> Back to User Dash
            </Link>
            <UserMenu username={userEmail} role={userRole} />
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[var(--db-surface)] border-4 border-[var(--db-border)] p-6 shadow-[6px_6px_0px_0px_var(--db-border)] flex items-center justify-between">
                <div>
                    <p className="text-xs font-black uppercase text-[var(--db-text-muted)]">Total Users</p>
                    <p className="text-3xl font-black text-[var(--db-text)]">{data?.stats.totalUsers || 0}</p>
                </div>
                <Users className="h-10 w-10 text-[var(--db-primary)] opacity-20" />
            </div>
            <div className="bg-[var(--db-surface)] border-4 border-[var(--db-border)] p-6 shadow-[6px_6px_0px_0px_var(--db-border)] flex items-center justify-between">
                <div>
                    <p className="text-xs font-black uppercase text-[var(--db-text-muted)]">Total Links</p>
                    <p className="text-3xl font-black text-[var(--db-text)]">{data?.stats.totalLinks || 0}</p>
                </div>
                <Link2 className="h-10 w-10 text-[var(--db-primary)] opacity-20" />
            </div>
            <div className="bg-[var(--db-surface)] border-4 border-[var(--db-border)] p-6 shadow-[6px_6px_0px_0px_var(--db-border)] flex items-center justify-between">
                <div>
                    <p className="text-xs font-black uppercase text-[var(--db-text-muted)]">Pending Reports</p>
                    <p className="text-3xl font-black text-red-600">{data?.stats.pendingReports || 0}</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-red-600 opacity-20" />
            </div>
        </div>

        <div className="bg-[var(--db-surface)] border-4 border-[var(--db-border)] shadow-[12px_12px_0px_0px_var(--db-border)] min-h-[500px] flex flex-col">
            
            <div className="flex border-b-4 border-[var(--db-border)]">
                <button 
                    onClick={() => setActiveTab("reports")}
                    className={`flex-1 py-4 font-black uppercase text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === "reports" ? "bg-red-50 text-red-600" : "hover:bg-[var(--db-bg)]"}`}
                >
                    <AlertTriangle className="h-4 w-4"/> Abuse Reports ({data?.reports.length || 0})
                </button>
                <div className="w-[4px] bg-[var(--db-border)]"></div>
                <button 
                    onClick={() => setActiveTab("public")}
                    className={`flex-1 py-4 font-black uppercase text-sm flex items-center justify-center gap-2 transition-colors ${activeTab === "public" ? "bg-blue-50 text-blue-600" : "hover:bg-[var(--db-bg)]"}`}
                >
                    <Link2 className="h-4 w-4"/> Public Links ({data?.publicLinks.length || 0})
                </button>
                <div className="w-[4px] bg-[var(--db-border)]"></div>
                <button 
                    onClick={fetchData} 
                    className="px-6 hover:bg-[var(--db-bg)] border-l-0" 
                    title="Refresh Data"
                >
                    <RefreshCw className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
                </button>
            </div>

            <div className="p-0 flex-1 overflow-auto bg-[var(--db-bg)]/50">
                {loading && !data ? (
                    <div className="h-full flex items-center justify-center p-10">
                        <Loader2 className="h-10 w-10 animate-spin text-[var(--db-text-muted)]"/>
                    </div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[var(--db-text)] text-[var(--db-bg)] sticky top-0">
                            <tr>
                                <th className="p-4 text-xs font-black uppercase">Slug</th>
                                <th className="p-4 text-xs font-black uppercase w-1/2">Target URL</th>
                                {activeTab === "reports" && <th className="p-4 text-xs font-black uppercase">Reason</th>}
                                <th className="p-4 text-xs font-black uppercase text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y-2 divide-[var(--db-border)] bg-[var(--db-surface)]">
                            {activeTab === "reports" ? (
                                data?.reports.map((report) => (
                                    <tr key={report.id} className="hover:bg-red-50 transition-colors">
                                        <td className="p-4 font-bold font-mono text-sm">
                                            {report.shortLink ? `/${report.shortLink.slug}` : <span className="text-red-400 italic">Deleted</span>}
                                        </td>
                                        <td className="p-4 text-xs font-medium truncate max-w-[200px]" title={report.shortLink?.targetUrl}>
                                            {report.shortLink?.targetUrl || "-"}
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-red-100 text-red-800 text-[10px] font-black px-2 py-1 uppercase border border-red-200">
                                                {report.reason}
                                            </span>
                                            <p className="text-[10px] mt-1 text-[var(--db-text-muted)] truncate max-w-[150px]">{report.details}</p>
                                        </td>
                                        <td className="p-4 text-right">
                                            {report.shortLink && (
                                                <button 
                                                    onClick={() => confirmDelete(report.shortLink.slug)} // Panggil Modal
                                                    className="bg-red-600 text-white p-2 border-2 border-black hover:shadow-[2px_2px_0px_0px_black] hover:-translate-y-0.5 transition-all"
                                                    title="Delete Link"
                                                >
                                                    <Trash2 className="h-4 w-4"/>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                data?.publicLinks.map((link) => (
                                    <tr key={link.id} className="hover:bg-blue-50 transition-colors">
                                        <td className="p-4 font-bold font-mono text-sm">/{link.slug}</td>
                                        <td className="p-4 text-xs font-medium truncate max-w-[300px]">
                                            <a href={link.targetUrl} target="_blank" className="hover:underline flex items-center gap-1">
                                                {link.targetUrl} <ExternalLink className="h-3 w-3 opacity-50"/>
                                            </a>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button 
                                                onClick={() => confirmDelete(link.slug)} // Panggil Modal
                                                className="bg-[var(--db-surface)] text-red-600 p-2 border-2 border-[var(--db-border)] hover:bg-red-600 hover:text-white transition-all"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4"/>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            
                            {(activeTab === "reports" && data?.reports.length === 0) && (
                                <tr><td colSpan={4} className="p-8 text-center font-bold text-[var(--db-text-muted)]">No reports found. Good job!</td></tr>
                            )}
                            {(activeTab === "public" && data?.publicLinks.length === 0) && (
                                <tr><td colSpan={3} className="p-8 text-center font-bold text-[var(--db-text-muted)]">No public links yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </div>

      </div>

      {deleteModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in">
           <div className="w-full max-w-sm bg-[var(--db-surface)] border-4 border-[var(--db-border)] p-6 shadow-[12px_12px_0px_0px_red] relative animate-in zoom-in-95">
              
              <div className="text-center mb-6">
                 <div className="inline-block p-3 bg-red-600 border-4 border-[var(--db-border)] rounded-full mb-3 text-white shadow-[4px_4px_0px_0px_var(--db-border)]">
                    <Trash2 className="h-8 w-8" />
                 </div>
                 <h2 className="text-2xl font-black uppercase leading-none text-[var(--db-text)] mb-2">DESTROY LINK?</h2>
                 <p className="font-bold text-[var(--db-text-muted)] text-sm">
                    Are you sure you want to delete <span className="text-red-600 bg-red-100 px-1">/{deleteModal.slug}</span>? 
                    This action cannot be undone.
                 </p>
              </div>

              <div className="flex gap-3">
                 <button 
                    onClick={() => setDeleteModal({ show: false, slug: null })}
                    className="flex-1 py-3 font-black border-4 border-[var(--db-border)] text-[var(--db-text)] hover:bg-[var(--db-bg)] uppercase text-xs shadow-[4px_4px_0px_0px_var(--db-border)] hover:-translate-y-0.5 transition-all"
                 >
                    CANCEL
                 </button>
                 <button 
                    onClick={executeDelete}
                    disabled={isDeleting}
                    className="flex-1 py-3 font-black bg-red-600 text-white border-4 border-[var(--db-border)] shadow-[4px_4px_0px_0px_var(--db-border)] hover:-translate-y-0.5 transition-all uppercase flex justify-center items-center gap-2 text-xs"
                 >
                    {isDeleting ? <Loader2 className="animate-spin h-4 w-4"/> : "YES, DESTROY"}
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
