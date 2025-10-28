import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  Building2,
  Phone,
  Mail,
  MapPin,
  Edit,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
} from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  description: string;
  type: "רכישה" | "מכירה";
  amount: number;
  status: "שולם" | "באיחור";
}

interface Payment {
  id: string;
  date: string;
  amount: number;
  method: string;
  notes: string;
}

const PartnerProfile = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Mock data - would come from API/state in real app
  const partner = {
    id: id || "1",
    name: "ספק דוגמה בע״מ",
    status: "ספק" as "ספק" | "לקוח" | "שניהם",
    phone: "050-1234567",
    email: "supplier@example.com",
    address: "רחוב הדקל 15, תל אביב",
    notes: "ספק מוצרי אלקטרוניקה איכותיים. תנאי תשלום: שוטף + 30",
    currentBalance: 15000,
    totalPurchases: 250000,
    totalPayments: 235000,
    openTransactions: 3,
  };

  const transactions: Transaction[] = [
    {
      id: "1",
      date: "2025-01-20",
      description: "רכישת מוצרי אלקטרוניקה - חשבונית 1245",
      type: "רכישה",
      amount: 8000,
      status: "באיחור",
    },
    {
      id: "2",
      date: "2025-01-15",
      description: "רכישת כבלים ואביזרים",
      type: "רכישה",
      amount: 3500,
      status: "שולם",
    },
    {
      id: "3",
      date: "2025-01-10",
      description: "רכישת מחשבים ניידים",
      type: "רכישה",
      amount: 45000,
      status: "שולם",
    },
    {
      id: "4",
      date: "2025-01-05",
      description: "רכישת ציוד משרדי",
      type: "רכישה",
      amount: 2200,
      status: "באיחור",
    },
  ];

  const payments: Payment[] = [
    {
      id: "1",
      date: "2025-01-18",
      amount: 45000,
      method: "העברה בנקאית",
      notes: "תשלום עבור חשבונית 1243",
    },
    {
      id: "2",
      date: "2025-01-12",
      amount: 3500,
      method: "המחאה",
      notes: "תשלום מלא",
    },
    {
      id: "3",
      date: "2024-12-28",
      amount: 12000,
      method: "העברה בנקאית",
      notes: "תשלום חלקי",
    },
  ];

  const alerts = [
    {
      id: "1",
      type: "warning",
      message: "תשלום באיחור של 15 ימים - חשבונית 1245",
      date: "2025-01-20",
    },
    {
      id: "2",
      type: "warning",
      message: "תשלום באיחור של 20 ימים - חשבונית 1240",
      date: "2025-01-05",
    },
    {
      id: "3",
      type: "info",
      message: "תזכורת: תשלום צפוי תוך 5 ימים",
      date: "2025-01-25",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ספק":
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">ספק</Badge>;
      case "לקוח":
        return <Badge variant="outline" className="bg-success/10 text-success border-success/20">לקוח</Badge>;
      case "שניהם":
        return <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-accent/20">שניהם</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="flex h-screen w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/suppliers")}
            className="gap-2"
          >
            <ArrowRight className="h-4 w-4" />
            חזרה לרשימה
          </Button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Header Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold flex items-center gap-3">
                    <Building2 className="h-8 w-8 text-primary" />
                    {partner.name}
                  </h1>
                  <div className="mt-2">{getStatusBadge(partner.status)}</div>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">חוב נוכחי</p>
                      <p className="text-2xl font-bold text-warning">
                        ₪{partner.currentBalance.toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">סה״כ רכישות</p>
                      <p className="text-2xl font-bold">
                        ₪{partner.totalPurchases.toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">סה״כ תשלומים</p>
                      <p className="text-2xl font-bold text-success">
                        ₪{partner.totalPayments.toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">עסקאות פתוחות</p>
                      <p className="text-2xl font-bold">{partner.openTransactions}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Business Details Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>פרטי עסק</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
                    <Edit className="h-4 w-4 ml-2" />
                    ערוך פרטים
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">שם עסק</p>
                        <p className="font-medium">{partner.name}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">טלפון</p>
                        <p className="font-medium">{partner.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">אימייל</p>
                        <p className="font-medium">{partner.email}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">כתובת</p>
                        <p className="font-medium">{partner.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Edit className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">הערות</p>
                        <p className="font-medium text-sm">{partner.notes}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alerts Section */}
            {alerts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    התראות פעילות
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`flex items-start gap-3 p-3 rounded-lg border ${
                          alert.type === "warning"
                            ? "bg-warning/5 border-warning/20"
                            : "bg-primary/5 border-primary/20"
                        }`}
                      >
                        <AlertTriangle
                          className={`h-5 w-5 mt-0.5 ${
                            alert.type === "warning" ? "text-warning" : "text-primary"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="font-medium">{alert.message}</p>
                          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {alert.date}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Transaction History Section */}
            <Card>
              <CardHeader>
                <CardTitle>היסטוריית עסקאות</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">תאריך</TableHead>
                        <TableHead className="text-right">תיאור עסקה</TableHead>
                        <TableHead className="text-right">סוג עסקה</TableHead>
                        <TableHead className="text-right">סכום</TableHead>
                        <TableHead className="text-right">סטטוס</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow
                          key={transaction.id}
                          className={transaction.status === "באיחור" ? "bg-destructive/5" : ""}
                        >
                          <TableCell className="font-medium">{transaction.date}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                transaction.type === "רכישה"
                                  ? "bg-primary/10 text-primary border-primary/20"
                                  : "bg-success/10 text-success border-success/20"
                              }
                            >
                              <span className="flex items-center gap-1">
                                {transaction.type === "רכישה" ? (
                                  <TrendingDown className="h-3 w-3" />
                                ) : (
                                  <TrendingUp className="h-3 w-3" />
                                )}
                                {transaction.type}
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold">
                            ₪{transaction.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                transaction.status === "שולם"
                                  ? "bg-success/10 text-success border-success/20"
                                  : "bg-warning/10 text-warning border-warning/20"
                              }
                            >
                              {transaction.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Payment History Section */}
            <Card>
              <CardHeader>
                <CardTitle>היסטוריית תשלומים</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">תאריך תשלום</TableHead>
                        <TableHead className="text-right">סכום</TableHead>
                        <TableHead className="text-right">אמצעי תשלום</TableHead>
                        <TableHead className="text-right">הערות</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            {payment.date}
                          </TableCell>
                          <TableCell className="font-semibold text-success">
                            ₪{payment.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-muted-foreground" />
                              {payment.method}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {payment.notes}
                          </TableCell>
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

      {/* Edit Details Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="bg-background max-w-2xl">
          <DialogHeader>
            <DialogTitle>ערוך פרטי עסק</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">שם עסק</label>
                <Input defaultValue={partner.name} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">טלפון</label>
                <Input defaultValue={partner.phone} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">אימייל</label>
                <Input type="email" defaultValue={partner.email} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">כתובת</label>
                <Input defaultValue={partner.address} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium">הערות</label>
                <Textarea defaultValue={partner.notes} rows={3} />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                ביטול
              </Button>
              <Button onClick={() => setIsEditOpen(false)}>
                שמור שינויים
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartnerProfile;
