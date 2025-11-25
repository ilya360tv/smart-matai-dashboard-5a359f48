import { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, Clock } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
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
import { AddPartnerModal } from "@/components/AddPartnerModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Supplier {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  active: "פעיל" | "לא פעיל";
}

const Suppliers = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (data) setSuppliers(data as Supplier[]);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      toast({
        title: "שגיאה",
        description: "לא הצלחנו לטעון את רשימת הספקים",
        variant: "destructive",
      });
    }
  };

  const handleAddSupplier = async (newSupplier: Omit<Supplier, "id" | "active">) => {
    try {
      const { error } = await supabase.from("suppliers").insert({
        name: newSupplier.name,
        phone: newSupplier.phone,
        email: newSupplier.email || null,
        city: newSupplier.city,
        active: "פעיל",
      });

      if (error) throw error;

      toast({
        title: "הספק נוסף בהצלחה!",
        description: `${newSupplier.name} נוסף לרשימת הספקים`,
      });

      fetchSuppliers();
    } catch (error) {
      console.error("Error adding supplier:", error);
      toast({
        title: "שגיאה",
        description: "לא הצלחנו להוסיף את הספק",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    try {
      const { error } = await supabase.from("suppliers").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "הספק נמחק בהצלחה!",
      });

      fetchSuppliers();
    } catch (error) {
      console.error("Error deleting supplier:", error);
      toast({
        title: "שגיאה",
        description: "לא הצלחנו למחוק את הספק",
        variant: "destructive",
      });
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (supplier.email && supplier.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getStatusVariant = (status: Supplier["active"]) => {
    return status === "פעיל" 
      ? "bg-success/10 text-success border-success/20"
      : "bg-muted/10 text-muted-foreground border-muted/20";
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-2 border-b bg-card px-3 lg:h-[60px] lg:px-6 sticky top-0 z-10 shadow-sm">
          <h1 className="text-lg lg:text-2xl font-bold flex-1">ניהול ספקים</h1>
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
                    onClick={() => setIsAddModalOpen(true)}
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
                      {filteredSuppliers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            לא נמצאו רשומות
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredSuppliers.map((supplier) => (
                          <TableRow 
                            key={supplier.id}
                            className="hover:bg-muted/30 transition-colors"
                          >
                            <TableCell className="font-medium">{supplier.name}</TableCell>
                            <TableCell className="text-muted-foreground">{supplier.phone}</TableCell>
                            <TableCell className="text-muted-foreground">{supplier.email || "-"}</TableCell>
                            <TableCell className="text-muted-foreground">{supplier.city}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusVariant(supplier.active)}>
                                {supplier.active}
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
                                  onClick={() => handleDeleteSupplier(supplier.id)}
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
                  {filteredSuppliers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      לא נמצאו רשומות
                    </div>
                  ) : (
                    filteredSuppliers.map((supplier) => (
                      <div
                        key={supplier.id}
                        className="p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-base mb-1">{supplier.name}</h3>
                            <p className="text-sm text-muted-foreground">{supplier.city}</p>
                          </div>
                          <Badge variant="outline" className={getStatusVariant(supplier.active)}>
                            {supplier.active}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm mb-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">טלפון:</span>
                            <span className="font-medium">{supplier.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">אימייל:</span>
                            <span className="font-medium truncate mr-2">{supplier.email || "-"}</span>
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
                            onClick={() => handleDeleteSupplier(supplier.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            מחק
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

      {/* Add Supplier Modal */}
      <AddPartnerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddSupplier}
        type="ספק"
      />
    </div>
  );
};

export default Suppliers;
