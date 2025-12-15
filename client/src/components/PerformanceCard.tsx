import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PerformanceMetric {
  id: string;
  label: string;
  value: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  subtext?: string;
  icon?: React.ElementType;
}

interface PerformanceCardProps {
  metric: PerformanceMetric;
}

export function PerformanceCard({ metric }: PerformanceCardProps) {
  const Icon = metric.icon;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-border/50 bg-card overflow-hidden group">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground font-sans">
          {metric.label}
        </CardTitle>
        {Icon && (
          <div className="p-2 bg-secondary/50 rounded-full text-muted-foreground group-hover:text-primary transition-colors">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <span className="text-2xl font-bold font-mono tracking-tight text-foreground">
            {metric.value}
          </span>
          
          <div className="flex items-center text-xs font-medium mt-1">
            {metric.trend === "up" && (
              <span className="text-emerald-600 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                {metric.trendValue}
              </span>
            )}
            {metric.trend === "down" && (
              <span className="text-rose-600 flex items-center bg-rose-50 px-1.5 py-0.5 rounded">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                {metric.trendValue}
              </span>
            )}
            {metric.trend === "neutral" && (
              <span className="text-muted-foreground flex items-center bg-secondary px-1.5 py-0.5 rounded">
                <Minus className="h-3 w-3 mr-1" />
                {metric.trendValue}
              </span>
            )}
            {metric.subtext && (
              <span className="text-muted-foreground ml-2">
                {metric.subtext}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
