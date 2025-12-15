import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { PerformanceCard, PerformanceMetric } from "@/components/PerformanceCard";
import { Loader2, Wallet, TrendingUp, Activity, DollarSign, Percent, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Trade {
  id: string;
  pair: string;
  type: "long" | "short";
  entry: number;
  current: number;
  pnl: number;
  status: "open" | "closed";
  time: string;
}

export default function Home() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const iconMap: Record<string, any> = { Wallet, Activity, DollarSign, Percent };

  useEffect(() => {
    let mounted = true;
    
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/dashboard";

    const transformMetrics = (rawMetrics: any[]): PerformanceMetric[] => {
      if (!Array.isArray(rawMetrics)) return [];
      return rawMetrics.map((m: any, idx: number) => {
        const value = typeof m.value === "number"
            ? m.label && /capital/i.test(m.label) ? `${m.value.toFixed(2)} €` : `${m.value}`
            : m.value ?? "";

        const iconComponent = typeof m.icon === "string" ? (iconMap[m.icon] ?? Wallet) : m.icon ?? Wallet;

        return {
          id: m.id ?? String(idx),
          label: m.label ?? `Metric ${idx + 1}`,
          value,
          trend: m.trend ?? "neutral",
          trendValue: m.trendValue ?? "",
          subtext: m.subtext ?? "",
          icon: iconComponent
        };
      });
    };

    const transformTrades = (rawTrades: any[]): Trade[] => {
      if (!Array.isArray(rawTrades)) return [];
      return rawTrades.map((t: any, idx: number) => ({
        id: t.id ?? `t${idx}`,
        pair: t.pair ?? t.symbol ?? "UNKNOWN",
        type: (t.type ?? t.side ?? "long").toLowerCase() === "short" ? "short" : "long",
        entry: Number(t.entry ?? t.entry_price ?? 0),
        current: Number(t.current ?? t.current_price ?? 0),
        pnl: Number(t.pnl ?? 0),
        status: (t.status ?? "open").toLowerCase() === "closed" ? "closed" : "open",
        time: t.time ?? t.timestamp ?? ""
      }));
    };

    const fetchTradingData = async () => {
      try {
        const res = await fetch(API_URL, { cache: "no-cache" });
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
        const data = await res.json();
        if (!mounted) return;
        setMetrics(transformMetrics(data.metrics ?? []));
        setTrades(transformTrades(data.trades ?? []));
        setLastUpdate(new Date().toLocaleTimeString());
      } catch (err) {
        console.error("Erreur connexion backend:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchTradingData();
    const intervalId = setInterval(fetchTradingData, 5000);
    return () => { mounted = false; clearInterval(intervalId); };
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans pb-12">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">Performance en Direct</h1>
            <p className="text-muted-foreground mt-1">Suivi temps réel du bot de trading algorithmique.</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Dernière mise à jour: {lastUpdate || "En attente..."}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map((metric) => <PerformanceCard key={metric.id} metric={metric} />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 border-border/50 shadow-sm">
                <CardHeader><CardTitle className="text-lg font-medium">Évolution du Capital (30j)</CardTitle></CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center bg-secondary/20 rounded-md border border-dashed border-border m-6 mt-0 relative">
                  <TrendingUp className="w-24 h-24 text-muted-foreground opacity-30" />
                  <p className="absolute text-sm text-muted-foreground">Graphique non disponible</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 shadow-sm">
                <CardHeader><CardTitle className="text-lg font-medium">Positions Récentes</CardTitle></CardHeader>
                <CardContent className="px-0">
                  <div className="space-y-0 divide-y divide-border/50">
                    {trades.length === 0 ? (
                      <div className="p-4 text-sm text-muted-foreground">Aucune position récente</div>
                    ) : (
                      trades.map((trade) => (
                        <div key={trade.id} className="p-4 hover:bg-secondary/30 transition-colors flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-1 h-8 rounded-full", trade.type === 'long' ? "bg-emerald-500" : "bg-rose-500")} />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold font-heading text-sm">{trade.pair}</span>
                                <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-5 border-0 font-mono uppercase", trade.type === 'long' ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700")}>{trade.type}</Badge>
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5 font-mono">Entry: {trade.entry}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={cn("font-bold font-mono text-sm flex items-center justify-end gap-1", trade.pnl >= 0 ? "text-emerald-600" : "text-rose-600")}>
                              {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                              {trade.pnl >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">{trade.time}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}