import { useState } from "react";
import { Search, Plus, AlertCircle, Eye, CreditCard } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AddPaymentModal } from "@/components/AddPaymentModal";

interface Payment {
  id: number;
  name: string;
  totalAmount: number;
  openDebt: number;
  lastPaymentDate: Date;
  status: "שולם" | "באיחור" | "בהמתנה";
  type: "לקוח" | "ספק";
}

const Payments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"לקוח" | "ספק">("לקוח");
  const [activeTab, setActiveTab] = useState("customers");
  const [payments] = useState<Payment[]>([
    {
      id: 1,
      name: "קבלן דוד כהן",
      totalAmount: 45000,
      openDebt: 15000,
      lastPaymentDate: new Date(2025, 0, 10),
      status: "באיחור",
      type: "לקוח",
    },
    {
      id: 2,
      name: "קבלן משה לוי",
      totalAmount: 28000,
      openDebt: 0,
      lastPaymentDate: new Date(2025, 0, 15),
      status: "שולם",
      type: "לקוח",
    },
    {
      id: 3,
      name: "קבלן יוסי אברהם",
      totalAmount: 32000,
      openDebt: 8000,
      lastPaymentDate: new Date(2025, 0, 20),
      status: "בהמתנה",
      type: "לקוח",
    },
    {
      id: 4,
      name: "ספק ראשי בע״מ",
      totalAmount: 67000,
      openDebt: 22000,
      lastPaymentDate: new Date(2025, 0, 8),
      status: "באיחור",
      type: "ספק",
    },
    {
      id: 5,
      name: "ספק משני בע״מ",
      totalAmount: 41000,
      openDebt: 0,
      lastPaymentDate: new Date(2025, 0, 18),
      status: "שולם",
      type: "ספק",
    },
  ]);

  const handleOpenModal = (type: "לקוח" | "ספק") => {
    setModalType(type);
    setIsAddModalOpen(true);
  };

  const handleAddPayment = (payment: {
    partner: string;
    date: Date;
    amount: number;
    notes: string;
  }) => {
    console.log("Adding payment:", payment);
    // Add payment logic here
  };

  const customers = payments.filter((p) => p.type === "לקוח");
  const suppliers = payments.filter((p) => p.type === "ספק");

  const filteredCustomers = customers.filter((payment) =>
    payment.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSuppliers = suppliers.filter((payment) =>
    payment.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusVariant = (status: Payment["status"]) => {
    switch (status) {
      case "שולם":
        return "bg-success/10 text-success border-success/20";
      case "בהמתנה":
        return "bg-warning/10 text-warning border-warning/20";
      case "באיחור":
        return "bg-destructive/10 text-destructive border-destructive/20";
    }
  };

  const overduePayments = payments.filter((p) => p.status === "באיחור");
  const upcomingPayments = payments.filter((p) => p.status === "בהמתנה");

  const partnerNames = {
    customers: customers.map((c) => c.name),
    suppliers: suppliers.map((s) => s.name),
  };

  const renderTable = (filteredPayments: Payment[]) => (
    <>
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
            {filteredPayments.length === 0 ? (
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
                  <TableCell className="font-medium">{payment.name}</TableCell>
                  <TableCell className="font-semibold">
                    ₪{payment.totalAmount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        payment.openDebt > 0
                          ? "font-semibold text-destructive"
                          : "font-semibold text-success"
                      }
                    >
                      ₪{payment.openDebt.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {payment.lastPaymentDate.toLocaleDateString("he-IL")}
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
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-success/10 hover:text-success"
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
        {filteredPayments.length === 0 ? (
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
                  <h3 className="font-semibold text-base mb-1">{payment.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {payment.lastPaymentDate.toLocaleDateString("he-IL")}
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
                    ₪{payment.totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">חוב פתוח:</span>
                  <span
                    className={
                      payment.openDebt > 0
                        ? "font-semibold text-destructive"
                        : "font-semibold text-success"
                    }
                  >
                    ₪{payment.openDebt.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="lg" variant="outline" className="flex-1 gap-2">
                  <Eye className="h-4 w-4" />
                  צפה
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 gap-2 hover:bg-success/10 hover:text-success hover:border-success"
                >
                  <CreditCard className="h-4 w-4" />
                  עדכן
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-2 border-b bg-card px-3 lg:h-[60px] lg:px-6 sticky top-0 z-10 shadow-sm">
          <h1 className="text-lg lg:text-2xl font-bold">ניהול כספים ותשלומים</h1>
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

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="customers" className="text-base">
                  לקוחות
                </TabsTrigger>
                <TabsTrigger value="suppliers" className="text-base">
                  ספקים
                </TabsTrigger>
              </TabsList>

              <TabsContent value="customers" className="space-y-4">
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
                        onClick={() => handleOpenModal("לקוח")}
                        className="gap-2 h-11 sm:w-auto w-full"
                        size="lg"
                      >
                        <Plus className="h-5 w-5" />
                        הוסף תשלום חדש
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Customers Table */}
                <Card className="shadow-sm">
                  <CardContent className="p-0">
                    {renderTable(filteredCustomers)}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="suppliers" className="space-y-4">
                {/* Toolbar */}
                <Card className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="חיפוש ספק..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pr-10 h-11"
                        />
                      </div>
                      <Button
                        onClick={() => handleOpenModal("ספק")}
                        className="gap-2 h-11 sm:w-auto w-full"
                        size="lg"
                      >
                        <Plus className="h-5 w-5" />
                        הוסף תשלום חדש
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Suppliers Table */}
                <Card className="shadow-sm">
                  <CardContent className="p-0">
                    {renderTable(filteredSuppliers)}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>

      {/* Add Payment Modal */}
      <AddPaymentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddPayment}
        type={modalType}
        partners={
          modalType === "לקוח" ? partnerNames.customers : partnerNames.suppliers
        }
      />
    </div>
  );
};

export default Payments;
