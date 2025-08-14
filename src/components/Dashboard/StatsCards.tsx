import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, DollarSign, AlertTriangle, TrendingUp } from "lucide-react";

interface StatsCardsProps {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  monthlyRevenue: number;
}

export const StatsCards = ({
  totalProducts,
  totalValue,
  lowStockItems,
  monthlyRevenue,
}: StatsCardsProps) => {
  const stats = [
    {
      title: "Total Products",
      value: totalProducts.toString(),
      icon: Package,
      color: "bg-primary",
    },
    {
      title: "Inventory Value",
      value: `$${totalValue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-accent",
    },
    {
      title: "Low Stock Alert",
      value: lowStockItems.toString(),
      icon: AlertTriangle,
      color: "bg-warning",
    },
    {
      title: "Monthly Revenue",
      value: `$${monthlyRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-success",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              {stat.title === "Low Stock Alert" && lowStockItems > 0 && (
                <Badge variant="destructive" className="mt-2">
                  Needs attention
                </Badge>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};