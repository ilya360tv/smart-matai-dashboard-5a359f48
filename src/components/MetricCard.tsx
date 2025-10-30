import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  onClick?: () => void;
}

export const MetricCard = ({ title, value, icon: Icon, iconColor = "text-primary", onClick }: MetricCardProps) => {
  return (
    <Card 
      className={`transition-all hover:shadow-lg ${onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 lg:p-6">
        <CardTitle className="text-xs lg:text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={`h-4 w-4 lg:h-5 lg:w-5 ${iconColor} flex-shrink-0`} />
      </CardHeader>
      <CardContent className="p-4 pt-0 lg:p-6 lg:pt-0">
        <div className="text-xl lg:text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};
