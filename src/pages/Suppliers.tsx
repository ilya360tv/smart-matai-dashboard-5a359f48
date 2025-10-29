import { useState } from "react";
import { Search, Plus, Pencil, Trash2 } from "lucide-react";
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
import { AddPartnerModal } from "@/components/AddPartnerModal";

interface Partner {
  id: number;
  name: string;
  phone: string;
  email: string;
  city: string;
  status: "ספק" | "לקוח";
  active: "פעיל" | "לא פעיל";
}

const Suppliers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"ספק" | "לקוח">("ספק");
  const [partners, setPartners] = useState<Partner[]>([]);
  const [activeTab, setActiveTab] = useState("suppliers");

  const handleAddPartner = (newPartner: Omit<Partner, "id" | "active">) => {
    const partner: Partner = {
      id: partners.length > 0 ? Math.max(...partners.map(p => p.id)) + 1 : 1,
      ...newPartner,
      active: "פעיל",
    };
    setPartners([partner, ...partners]);
  };

  const handleDeletePartner = (id: number) => {
    setPartners(partners.filter(p => p.id !== id));
  };

  const handleOpenModal = (type: "ספק" | "לקוח") => {
    setModalType(type);
    setIsAddModalOpen(true);
  };

  const suppliers = partners.filter(p => p.status === "ספק");
  const customers = partners.filter(p => p.status === "לקוח");

  const filteredSuppliers = suppliers.filter(partner =>
    partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCustomers = customers.filter(partner =>
    partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusVariant = (status: Partner["active"]) => {
    return status === "פעיל" 
      ? "bg-success/10 text-success border-success/20"
      : "bg-muted/10 text-muted-foreground border-muted/20";
  };

  const renderTable = (filteredPartners: Partner[]) => (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-right font-bold">שם</TableHead>
              <TableHead className="text-right font-bold">טלפון</TableHead>
              <TableHead className="text-right font-bold">אימייל</TableHead>
              <TableHead className="text-right font-bold">עיר</TableHead>
              <TableHead className="text-right font-bold">סטטוס</TableHead>
              <TableHead className="text-right font-bold">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPartners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  לא נמצאו רשומות
                </TableCell>
              </TableRow>
            ) : (
              filteredPartners.map((partner) => (
                <TableRow 
                  key={partner.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium">{partner.name}</TableCell>
                  <TableCell className="text-muted-foreground">{partner.phone}</TableCell>
                  <TableCell className="text-muted-foreground">{partner.email}</TableCell>
                  <TableCell className="text-muted-foreground">{partner.city}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusVariant(partner.active)}>
                      {partner.active}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-primary/10"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDeletePartner(partner.id)}
                      >
                        <Trash2 className="h-4 w-4" />
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
        {filteredPartners.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            לא נמצאו רשומות
          </div>
        ) : (
          filteredPartners.map((partner) => (
            <div
              key={partner.id}
              className="p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-base mb-1">{partner.name}</h3>
                  <p className="text-sm text-muted-foreground">{partner.city}</p>
                </div>
                <Badge variant="outline" className={getStatusVariant(partner.active)}>
                  {partner.active}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">טלפון:</span>
                  <span className="font-medium">{partner.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">אימייל:</span>
                  <span className="font-medium truncate mr-2">{partner.email}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  ערוך
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1 gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                  onClick={() => handleDeletePartner(partner.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  מחק
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
          <h1 className="text-lg lg:text-2xl font-bold">ניהול ספקים ולקוחות</h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-3 lg:p-6">
          <div className="mx-auto max-w-7xl space-y-4 lg:space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="suppliers" className="text-base">ספקים</TabsTrigger>
                <TabsTrigger value="customers" className="text-base">לקוחות</TabsTrigger>
              </TabsList>

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
                        הוסף ספק חדש
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
                        הוסף לקוח חדש
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
            </Tabs>
          </div>
        </main>
      </div>

      {/* Add Partner Modal */}
      <AddPartnerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddPartner}
        type={modalType}
      />
    </div>
  );
};

export default Suppliers;
