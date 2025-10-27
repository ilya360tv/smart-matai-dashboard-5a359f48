import { Package, Building2, Users, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const lowStockItems = [
    { id: 1, name: "מוצר A", currentStock: 5, minStock: 20 },
    { id: 2, name: "מוצר B", currentStock: 3, minStock: 15 },
    { id: 3, name: "מוצר C", currentStock: 8, minStock: 25 },
  ];

  const recentMovements = [
    { id: 1, date: "2025-01-15", product: "מוצר X", type: "כניסה", quantity: 50 },
    { id: 2, date: "2025-01-15", product: "מוצר Y", type: "יציאה", quantity: 30 },
    { id: 3, date: "2025-01-14", product: "מוצר Z", type: "כניסה", quantity: 100 },
    { id: 4, date: "2025-01-14", product: "מוצר A", type: "יציאה", quantity: 15 },
    { id: 5, date: "2025-01-13", product: "מוצר B", type: "כניסה", quantity: 25 },
  ];

  return (
    <div className="flex h-screen w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <h1 className="text-xl font-bold">מערכת ניהול מלאי חכמה</h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="סה״כ פריטים במלאי"
                value="1,234"
                icon={Package}
                iconColor="text-primary"
              />
              <MetricCard
                title="ספקים פעילים"
                value="45"
                icon={Building2}
                iconColor="text-accent-foreground"
              />
              <MetricCard
                title="לקוחות פעילים"
                value="89"
                icon={Users}
                iconColor="text-success"
              />
              <MetricCard
                title="התראות פתוחות"
                value="3"
                icon={AlertTriangle}
                iconColor="text-warning"
              />
            </div>

            {/* Low Stock Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  התראות מלאי נמוך
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowStockItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
                    >
                      <div className="flex items-center gap-3">
                        <TrendingDown className="h-5 w-5 text-warning" />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            מלאי נוכחי: {item.currentStock} | מינימום נדרש: {item.minStock}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                        דורש תשומת לב
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Movements Table */}
            <Card>
              <CardHeader>
                <CardTitle>תנועות אחרונות במלאי</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">תאריך</TableHead>
                        <TableHead className="text-right">שם המוצר</TableHead>
                        <TableHead className="text-right">סוג תנועה</TableHead>
                        <TableHead className="text-right">כמות</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentMovements.map((movement) => (
                        <TableRow key={movement.id}>
                          <TableCell className="font-medium">{movement.date}</TableCell>
                          <TableCell>{movement.product}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                movement.type === "כניסה"
                                  ? "bg-success/10 text-success border-success/20"
                                  : "bg-primary/10 text-primary border-primary/20"
                              }
                            >
                              <span className="flex items-center gap-1">
                                {movement.type === "כניסה" ? (
                                  <TrendingUp className="h-3 w-3" />
                                ) : (
                                  <TrendingDown className="h-3 w-3" />
                                )}
                                {movement.type}
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold">{movement.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
