//componets/AnalyticsModal.tsx

"use client";

import { useEffect, useState } from "react";
import { X, Loader2, BarChart3, Globe, Monitor, Smartphone } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface AnalyticsModalProps {
  slug: string;
  onClose: () => void;
}

interface StatsData {
  total: number;
  chartData: { date: string; count: number }[];
  topBrowsers: { name: string; value: number }[];
  topOS: { name: string; value: number }[];
  topCountries: { name: string; value: number }[];
}

export default function AnalyticsModal({ slug, onClose }: AnalyticsModalProps) {
  const [data, setData] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/links/${slug}/stats`)
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto db-card db-card-pop p-6 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-(--db-accent)" />
              Analytics: <span className="font-mono text-(--db-text)">/{slug}</span>
            </h2>
            <p className="db-muted text-xs mt-1">
              Statistik performa link dalam 7 hari terakhir.
            </p>
          </div>
          <button onClick={onClose} className="db-btn-icon">
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="h-60 flex items-center justify-center text-db-muted">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : !data ? (
          <div className="h-40 flex items-center justify-center text-db-muted">
            Gagal memuat data.
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            
            {/* Total Clicks Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-(--db-border-soft) bg-(--db-surface-muted)">
                <p className="text-xs db-muted mb-1">Total Clicks</p>
                <p className="text-2xl font-bold">{data.total}</p>
              </div>
              <div className="p-4 rounded-xl border border-(--db-border-soft) bg-(--db-surface-muted)">
                <p className="text-xs db-muted mb-1">Top Country</p>
                <div className="flex items-center gap-2">
                   <Globe className="h-4 w-4 opacity-50"/>
                   <span className="font-semibold">{data.topCountries[0]?.name || "-"}</span>
                </div>
              </div>
              <div className="p-4 rounded-xl border border-(--db-border-soft) bg-(--db-surface-muted)">
                <p className="text-xs db-muted mb-1">Top Device/OS</p>
                 <div className="flex items-center gap-2">
                   <Monitor className="h-4 w-4 opacity-50"/>
                   <span className="font-semibold">{data.topOS[0]?.name || "-"}</span>
                </div>
              </div>
            </div>

            {/* CHART AREA */}
            <div className="h-64 w-full p-2 border border-(--db-border-soft) rounded-xl">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.chartData}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--db-border)" />
                  <XAxis 
                    dataKey="date" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(str) => str.slice(5)} // Show MM-DD only
                  />
                  <YAxis fontSize={10} tickLine={false} axisLine={false} allowDecimals={false}/>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    labelStyle={{ color: '#666' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* DETAIL LISTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Top Browsers */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Top Browsers</h3>
                <div className="space-y-2">
                  {data.topBrowsers.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-2 rounded bg-(--db-surface-muted)">
                      <span>{item.name}</span>
                      <span className="font-mono font-bold">{item.value}</span>
                    </div>
                  ))}
                  {data.topBrowsers.length === 0 && <p className="text-xs db-muted">Belum ada data</p>}
                </div>
              </div>

              {/* Top Countries */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Top Locations</h3>
                <div className="space-y-2">
                  {data.topCountries.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-2 rounded bg-(--db-surface-muted)">
                      <span>{item.name || "Unknown"}</span>
                      <span className="font-mono font-bold">{item.value}</span>
                    </div>
                  ))}
                  {data.topCountries.length === 0 && <p className="text-xs db-muted">Belum ada data</p>}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
