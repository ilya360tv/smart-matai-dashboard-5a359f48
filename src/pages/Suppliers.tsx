import { useState } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Building2, Mail, Phone, Edit, Eye, Bell } from "lucide-react";

interface BusinessPartner {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: "ספק" | "לקוח" | "שניהם";
  balance: number;
  notes: string;
}

const Suppliers = () => {
  const [partners, setPartners] = useState<BusinessPartner[]>([
    {
      id: "1",
      name: "ספק דוגמה בע״מ",
      phone: "050-1234567",
      email: "supplier@example.com",
      status: "ספק",
      balance: 5000,
      notes: "ספק מוצרי אלקטרוניקה",
    },
    {
      id: "2",
      name: "לקוח מרכזי בע״מ",
      phone: "052-9876543",
      email: "client@example.com",
      status: "לקוח",
      balance: -3000,
      notes: "לקוח VIP",
    },
  ]);

  const [newPartner, setNewPartner] = useState({
    name: "",
    phone: "",
    email: "",
    status: "ספק" as "ספק" | "לקוח" | "שניהם",
    balance: 0,
    notes: "",
  });

  const [selectedPartner, setSelectedPartner] = useState<BusinessPartner | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [editingPartner, setEditingPartner] = useState<BusinessPartner | null>(null);

  const handleAddPartner = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPartner.name || !newPartner.phone || !newPartner.email) {
      toast({
        title: "שגיאה",
        description: "אנא מלא את כל השדות הנדרשים",
        variant: "destructive",
      });
      return;
    }

    const partner: BusinessPartner = {
      id: Date.now().toString(),
      ...newPartner,
    };

    setPartners([...partners, partner]);

    toast({
      title: "העסק נוסף בהצלחה!",
    });

    // Reset form
    setNewPartner({
      name: "",
      phone: "",
      email: "",
      status: "ספק",
      balance: 0,
      notes: "",
    });
  };

  const handleViewDetails = (partner: BusinessPartner) => {
    setSelectedPartner(partner);
    setIsDetailsOpen(true);
  };

  const handleEdit = (partner: BusinessPartner) => {
    setEditingPartner(partner);
    setNewPartner({
      name: partner.name,
      phone: partner.phone,
      email: partner.email,
      status: partner.status,
      balance: partner.balance,
      notes: partner.notes,
    });
    toast({
      title: "מצב עריכה",
      description: "ערוך את הפרטים והוסף עסק חדש לשמירה",
    });
  };

  const handlePaymentReminder = (partner: BusinessPartner) => {
    toast({
      title: "תזכורת נשלחה",
      description: `תזכורת תשלום נשלחה ל-${partner.name}`,
    });
  };

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
          <h1 className="text-xl font-bold">ניהול ספקים / לקוחות עסקיים</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Add New Business Partner Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  הוספת עסק / ספק חדש
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddPartner} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="business-name" className="text-sm font-medium">
                        שם עסק / ספק
                      </label>
                      <Input
                        id="business-name"
                        value={newPartner.name}
                        onChange={(e) =>
                          setNewPartner({ ...newPartner, name: e.target.value })
                        }
                        placeholder="הכנס שם עסק"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        טלפון
                      </label>
                      <Input
                        id="phone"
                        value={newPartner.phone}
                        onChange={(e) =>
                          setNewPartner({ ...newPartner, phone: e.target.value })
                        }
                        placeholder="050-1234567"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        אימייל
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={newPartner.email}
                        onChange={(e) =>
                          setNewPartner({ ...newPartner, email: e.target.value })
                        }
                        placeholder="email@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="status" className="text-sm font-medium">
                        סטטוס
                      </label>
                      <Select
                        value={newPartner.status}
                        onValueChange={(value: "ספק" | "לקוח" | "שניהם") =>
                          setNewPartner({ ...newPartner, status: value })
                        }
                      >
                        <SelectTrigger id="status" className="bg-background">
                          <SelectValue placeholder="בחר סטטוס" />
                        </SelectTrigger>
                        <SelectContent className="bg-background z-50">
                          <SelectItem value="ספק">ספק</SelectItem>
                          <SelectItem value="לקוח">לקוח</SelectItem>
                          <SelectItem value="שניהם">שניהם</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="balance" className="text-sm font-medium">
                        חוב נוכחי (₪)
                      </label>
                      <Input
                        id="balance"
                        type="number"
                        value={newPartner.balance}
                        onChange={(e) =>
                          setNewPartner({ ...newPartner, balance: parseFloat(e.target.value) || 0 })
                        }
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="notes" className="text-sm font-medium">
                        הערות
                      </label>
                      <Textarea
                        id="notes"
                        value={newPartner.notes}
                        onChange={(e) =>
                          setNewPartner({ ...newPartner, notes: e.target.value })
                        }
                        placeholder="הערות נוספות..."
                        rows={3}
                      />
                    </div>
                  </div>
                  <Button type="submit" size="lg" className="w-full md:w-auto">
                    הוסף עסק חדש
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Business Partners Table */}
            <Card>
              <CardHeader>
                <CardTitle>רשימת עסקים</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">שם עסק</TableHead>
                        <TableHead className="text-right">טלפון</TableHead>
                        <TableHead className="text-right">אימייל</TableHead>
                        <TableHead className="text-right">סטטוס</TableHead>
                        <TableHead className="text-right">חוב נוכחי</TableHead>
                        <TableHead className="text-right">פעולות</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {partners.map((partner) => (
                        <TableRow key={partner.id}>
                          <TableCell className="font-medium">{partner.name}</TableCell>
                          <TableCell>
                            <span className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              {partner.phone}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              {partner.email}
                            </span>
                          </TableCell>
                          <TableCell>{getStatusBadge(partner.status)}</TableCell>
                          <TableCell>
                            <span className={partner.balance > 0 ? "text-warning font-semibold" : "text-success font-semibold"}>
                              ₪{partner.balance.toLocaleString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(partner)}
                                title="ערוך"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(partner)}
                                title="פרטי עסק"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handlePaymentReminder(partner)}
                                title="תזכורת תשלום"
                              >
                                <Bell className="h-4 w-4" />
                              </Button>
                            </div>
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

      {/* Business Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="bg-background max-w-2xl">
          <DialogHeader>
            <DialogTitle>פרטי עסק</DialogTitle>
          </DialogHeader>
          {selectedPartner && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">שם עסק</h4>
                  <p className="font-semibold">{selectedPartner.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">סטטוס</h4>
                  {getStatusBadge(selectedPartner.status)}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">טלפון</h4>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {selectedPartner.phone}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">אימייל</h4>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {selectedPartner.email}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">חוב נוכחי</h4>
                  <p className={selectedPartner.balance > 0 ? "text-warning font-semibold text-lg" : "text-success font-semibold text-lg"}>
                    ₪{selectedPartner.balance.toLocaleString()}
                  </p>
                </div>
              </div>
              {selectedPartner.notes && (
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">הערות</h4>
                  <p className="text-sm bg-muted p-3 rounded-md">{selectedPartner.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Suppliers;
