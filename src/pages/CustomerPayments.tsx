import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Plus, AlertCircle, Eye, CreditCard, Clock } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AddPaymentModal } from "@/components/AddPaymentModal";
import { toast } from "sonner";

interface CustomerPayment {
  id: string;
  customer_name: string;
  total_amount: number;
  paid_amount: number;
  open_debt: number;
  payment_date: string | null;
  due_date: string | null;
  status: string;
  notes: string | null;
}

const CustomerPayments = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["customer-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customer_payments")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as CustomerPayment[];
    },
  });

  const addPaymentMutation = useMutation({
    mutationFn: async (payment: {
      partner: string;
      date: Date;
      amount: number;
      notes: string;
    }) => {
      const { error } = await supabase.from("customer_payments").insert({
        customer_name: payment.partner,
        total_amount: payment.amount,
        paid_amount: 0,
        payment_date: payment.date.toISOString(),
        due_date: payment.date.toISOString(),
        status: "בהמתנה",
        notes: payment.notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-payments"] });
      toast.success("התשלום נוסף בהצלחה");
    },
    onError: () => {
      toast.error("שגיאה בהוספת התשלום");
    },
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAddPayment = (payment: {
    partner: string;
    date: Date;
    amount: number;
    notes: string;
  }) => {
    addPaymentMutation.mutate(payment);
  };

  const handleViewDetails = (payment: CustomerPayment) => {
    alert(`פרטי תשלום: ${payment.customer_name}\nסכום כולל: ₪${payment.total_amount.toLocaleString()}\nחוב פתוח: ₪${payment.open_debt.toLocaleString()}`);
  };

  const handleUpdatePayment = async (payment: CustomerPayment) => {
    const newPaidAmount = prompt("הזן סכום תשלום חדש:", "0");
    if (newPaidAmount === null) return;
    
    const amount = parseFloat(newPaidAmount);
    if (isNaN(amount) || amount < 0) {
      toast.error("סכום לא תקין");
      return;
    }

    const totalPaid = payment.paid_amount + amount;
    const newStatus = totalPaid >= payment.total_amount ? "שולם" : "בהמתנה";

    const { error } = await supabase
      .from("customer_payments")
      .update({
        paid_amount: totalPaid,
        status: newStatus,
        payment_date: new Date().toISOString(),
      })
      .eq("id", payment.id);

    if (error) {
      toast.error("שגיאה בעדכון התשלום");
    } else {
      queryClient.invalidateQueries({ queryKey: ["customer-payments"] });
      toast.success("התשלום עודכן בהצלחה");
    }
  };

  const filteredPayments = payments.filter((payment) =>
    payment.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "שולם":
        return "bg-success/10 text-success border-success/20";
      case "בהמתנה":
        return "bg-warning/10 text-warning border-warning/20";
      case "באיחור":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted/10 text-muted-foreground border-muted/20";
    }
  };

  const overduePayments = payments.filter((p) => p.status === "באיחור");
  const upcomingPayments = payments.filter((p) => p.status === "בהמתנה");
  const uniqueCustomers = [...new Set(payments.map((p) => p.customer_name))];

  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-2 border-b bg-card px-3 lg:h-[60px] lg:px-6 sticky top-0 z-10 shadow-sm">
          <h1 className="text-lg lg:text-2xl font-bold flex-1">תשלומי לקוחות</h1>
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
            {/* Alerts */}
            {overduePayments.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>תשלומים באיחור</AlertTitle>
                <AlertDescription>
                  יש {overduePayments.length} תשלומים באיחור הדורשים טיפול מיידי
                </AlertDescription>
              </Alert>
            )}

            {upcomingPayments.length > 0 && (
              <Alert className="bg-warning/10 border-warning/20 text-warning">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>תשלומים קרובים למועד</AlertTitle>
                <AlertDescription>
                  יש {upcomingPayments.length} תשלומים ממתינים לביצוע
                </AlertDescription>
              </Alert>
            )}

            {/* Toolbar */}
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="חיפוש לקוח..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10 h-11"
                    />
                  </div>
                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="gap-2 h-11 sm:w-auto w-full"
                    size="lg"
                  >
                    <Plus className="h-5 w-5" />
                    הוסף תשלום חדש
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Payments Table */}
            <Card className="shadow-sm">
              <CardContent className="p-0">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-right font-bold">שם</TableHead>
                        <TableHead className="text-right font-bold">סכום כולל</TableHead>
                        <TableHead className="text-right font-bold">חוב פתוח</TableHead>
                        <TableHead className="text-right font-bold">
                          תאריך אחרון לתשלום
                        </TableHead>
                        <TableHead className="text-right font-bold">סטטוס תשלום</TableHead>
                        <TableHead className="text-right font-bold">פעולות</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            טוען נתונים...
                          </TableCell>
                        </TableRow>
                      ) : filteredPayments.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-muted-foreground"
                          >
                            לא נמצאו רשומות
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredPayments.map((payment) => (
                          <TableRow
                            key={payment.id}
                            className="hover:bg-muted/30 transition-colors"
                          >
                            <TableCell className="font-medium">{payment.customer_name}</TableCell>
                            <TableCell className="font-semibold">
                              ₪{payment.total_amount.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <span
                                className={
                                  payment.open_debt > 0
                                    ? "font-semibold text-destructive"
                                    : "font-semibold text-success"
                                }
                              >
                                ₪{payment.open_debt.toLocaleString()}
                              </span>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {payment.due_date
                                ? new Date(payment.due_date).toLocaleDateString("he-IL")
                                : "-"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={getStatusVariant(payment.status)}
                              >
                                {payment.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 hover:bg-primary/10"
                                  onClick={() => handleViewDetails(payment)}
                                  title="צפה בפרטים"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 hover:bg-success/10 hover:text-success"
                                  onClick={() => handleUpdatePayment(payment)}
                                  title="עדכן תשלום"
                                >
                                  <CreditCard className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden p-3 space-y-3">
                  {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      טוען נתונים...
                    </div>
                  ) : filteredPayments.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      לא נמצאו רשומות
                    </div>
                  ) : (
                    filteredPayments.map((payment) => (
                      <div
                        key={payment.id}
                        className="p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-base mb-1">{payment.customer_name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {payment.due_date
                                ? new Date(payment.due_date).toLocaleDateString("he-IL")
                                : "-"}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={getStatusVariant(payment.status)}
                          >
                            {payment.status}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm mb-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">סכום כולל:</span>
                            <span className="font-semibold">
                              ₪{payment.total_amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">חוב פתוח:</span>
                            <span
                              className={
                                payment.open_debt > 0
                                  ? "font-semibold text-destructive"
                                  : "font-semibold text-success"
                              }
                            >
                              ₪{payment.open_debt.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="lg" 
                            variant="outline" 
                            className="flex-1 gap-2"
                            onClick={() => handleViewDetails(payment)}
                          >
                            <Eye className="h-4 w-4" />
                            צפה
                          </Button>
                          <Button
                            size="lg"
                            variant="outline"
                            className="flex-1 gap-2 hover:bg-success/10 hover:text-success hover:border-success"
                            onClick={() => handleUpdatePayment(payment)}
                          >
                            <CreditCard className="h-4 w-4" />
                            עדכן
                          </Button>
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

      {/* Add Payment Modal */}
      <AddPaymentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddPayment}
        type="לקוח"
        partners={uniqueCustomers}
      />
    </div>
  );
};

export default CustomerPayments;
