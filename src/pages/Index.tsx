import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, Building2, Users, AlertTriangle, Calendar, User, Clock } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { MetricCard } from "@/components/MetricCard";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const recentUpdates: Array<{ id: number; productName: string; quantity: number; supplier: string; status: string; date: string; user: string }> = [];

  return (
    <div className="flex min-h-screen w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="flex h-14 items-center gap-2 border-b bg-card px-3 lg:h-[60px] lg:px-6 sticky top-0 z-10">
          <h1 className="text-base lg:text-xl font-bold truncate flex-1">מערכת ניהול מלאי חכמה</h1>
          <div className="flex items-center gap-1.5 lg:gap-2 text-muted-foreground">
            <Clock className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
            <div className="flex flex-col items-end">
              <span className="font-medium text-xs lg:text-base">{format(currentTime, "HH:mm:ss")}</span>
              <span className="text-[10px] lg:text-xs hidden sm:block">{format(currentTime, "d MMMM yyyy", { locale: he })}</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-3 lg:p-6">
          <div className="mx-auto max-w-7xl space-y-4 lg:space-y-6">
            {/* Welcome Section */}
            <div className="animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl lg:text-4xl font-bold bg-gradient-to-l from-primary to-accent-foreground bg-clip-text text-transparent mb-2">
                    ברוך הבא למערכת ניהול המלאי!
                  </h2>
                  <p className="text-sm lg:text-base text-muted-foreground">
                    ניהול חכם ויעיל של המלאי העסקי שלך
                  </p>
                </div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="סה״כ פריטים במלאי"
                value="0"
                icon={Package}
                iconColor="text-primary"
                onClick={() => navigate("/inventory")}
              />
              <MetricCard
                title="ספקים פעילים"
                value="0"
                icon={Building2}
                iconColor="text-accent-foreground"
                onClick={() => navigate("/suppliers")}
              />
              <MetricCard
                title="לקוחות פעילים"
                value="0"
                icon={Users}
                iconColor="text-success"
                onClick={() => navigate("/customers")}
              />
              <MetricCard
                title="התראות פתוחות"
                value="0"
                icon={AlertTriangle}
                iconColor="text-warning"
                onClick={() => navigate("/stock-movements")}
              />
            </div>

            {/* Recent Updates Table */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg lg:text-2xl">
                  <Calendar className="h-5 w-5 text-primary" />
                  עדכוני מלאי אחרונים
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  פעולות והוספות אחרונות במערכת
                </p>
              </CardHeader>
              <CardContent>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-right p-3 font-semibold text-sm">שם מוצר</th>
                        <th className="text-right p-3 font-semibold text-sm">כמות</th>
                        <th className="text-right p-3 font-semibold text-sm">ספק</th>
                        <th className="text-right p-3 font-semibold text-sm">סטטוס</th>
                        <th className="text-right p-3 font-semibold text-sm">תאריך</th>
                        <th className="text-right p-3 font-semibold text-sm">משתמש</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUpdates.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-muted-foreground">
                            אין עדכונים אחרונים להצגה
                          </td>
                        </tr>
                      ) : (
                        recentUpdates.map((update) => (
                          <tr key={update.id} className="border-b hover:bg-accent/50 transition-colors">
                            <td className="p-3 font-medium">{update.productName}</td>
                            <td className="p-3">{update.quantity}</td>
                            <td className="p-3 text-muted-foreground">{update.supplier}</td>
                            <td className="p-3">
                              <Badge 
                                variant="outline" 
                                className={
                                  update.status === "פעיל" 
                                    ? "bg-success/10 text-success border-success/20" 
                                    : "bg-warning/10 text-warning border-warning/20"
                                }
                              >
                                {update.status}
                              </Badge>
                            </td>
                            <td className="p-3 text-sm text-muted-foreground">{update.date}</td>
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{update.user}</span>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {recentUpdates.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                      אין עדכונים אחרונים להצגה
                    </div>
                  ) : (
                    recentUpdates.map((update) => (
                      <div key={update.id} className="border rounded-lg p-4 space-y-2 hover:bg-accent/50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-base">{update.productName}</h4>
                            <p className="text-sm text-muted-foreground">{update.supplier}</p>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={
                              update.status === "פעיל" 
                                ? "bg-success/10 text-success border-success/20" 
                                : "bg-warning/10 text-warning border-warning/20"
                            }
                          >
                            {update.status}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">כמות: {update.quantity}</span>
                          <span className="text-muted-foreground">{update.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{update.user}</span>
                        </div>
                      </div>
                    ))
                  )}
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
