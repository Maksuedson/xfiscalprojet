import { LucideIcon } from "lucide-react";
import { useCountUp } from "@/hooks/useScrollReveal";

interface StatCardProps {
  title: string;
  value: number | string;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color?: "primary" | "accent" | "destructive" | "warning";
}

const colorMap = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  destructive: "bg-destructive/10 text-destructive",
  warning: "bg-[hsl(45,93%,47%)]/10 text-[hsl(45,93%,47%)]",
};

const StatCard = ({ title, value, prefix = "", suffix = "", icon: Icon, trend, color = "primary" }: StatCardProps) => {
  const numValue = typeof value === "number" ? value : 0;
  const count = useCountUp(numValue, 1500, false, true);

  return (
    <div className="bg-card border border-border rounded-xl p-5 shadow-card hover:shadow-card-hover transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg ${colorMap[color]} flex items-center justify-center`}>
          <Icon size={20} />
        </div>
        {trend && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend.value >= 0 ? "bg-accent/10 text-accent" : "bg-destructive/10 text-destructive"}`}>
            {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-foreground">
        {prefix}{typeof value === "number" && value > 100 ? count.toLocaleString("pt-BR") : value}{suffix}
      </p>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
    </div>
  );
};

export default StatCard;
