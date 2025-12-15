import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export type Status = "operational" | "degraded" | "down" | "maintenance";

export interface ServiceData {
  id: string;
  name: string;
  status: Status;
  uptime: string;
  lastUpdated: string;
}

const statusConfig = {
  operational: {
    icon: CheckCircle2,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    badge: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
    label: "Operational"
  },
  degraded: {
    icon: AlertCircle,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    badge: "bg-amber-100 text-amber-700 hover:bg-amber-200",
    label: "Degraded"
  },
  down: {
    icon: XCircle,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    badge: "bg-rose-100 text-rose-700 hover:bg-rose-200",
    label: "Outage"
  },
  maintenance: {
    icon: Clock,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    badge: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    label: "Maintenance"
  }
};

interface StatusCardProps {
  service: ServiceData;
}

export function StatusCard({ service }: StatusCardProps) {
  const config = statusConfig[service.status];
  const Icon = config.icon;

  return (
    <Card className="hover:shadow-md transition-shadow duration-300 border-border/50 bg-card overflow-hidden group">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-medium font-heading tracking-tight">
          {service.name}
        </CardTitle>
        <div className={cn("p-2 rounded-full transition-colors", config.bg)}>
          <Icon className={cn("h-5 w-5", config.color)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className={cn("border-0 font-medium", config.badge)}>
            {config.label}
          </Badge>
          <span className="text-sm text-muted-foreground font-mono">
            {service.uptime}
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Response Time</span>
            <span className="font-medium text-foreground">
              {Math.floor(Math.random() * 50 + 20)}ms
            </span>
          </div>
          <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
            <div 
              className={cn("h-full rounded-full transition-all duration-1000", config.color.replace('text-', 'bg-'))} 
              style={{ width: `${service.status === 'operational' ? 99 : service.status === 'degraded' ? 70 : 10}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground pt-2 text-right">
            Last updated: <span className="font-mono">{service.lastUpdated}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
