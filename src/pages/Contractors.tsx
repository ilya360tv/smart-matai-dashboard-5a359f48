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
import { AddPartnerModal } from "@/components/AddPartnerModal";

interface Contractor {
  id: number;
  name: string;
  phone: string;
  email: string;
  city: string;
  active: "פעיל" | "לא פעיל";
}

const Contractors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [contractors, setContractors] = useState<Contractor[]>([]);

  const handleAddContractor = (newContractor: { name: string; phone: string; email: string; city: string; status: "ספק" | "קבלן" }) => {
    const contractor: Contractor = {
      id: contractors.length > 0 ? Math.max(...contractors.map(c => c.id)) + 1 : 1,
      name: newContractor.name,
      phone: newContractor.phone,
      email: newContractor.email,
      city: newContractor.city,
      active: "פעיל",
    };
    setContractors([contractor, ...contractors]);
  };

  const handleDeleteContractor = (id: number) => {
    setContractors(contractors.filter(c => c.id !== id));
  };

  const filteredContractors = contractors.filter(contractor =>
    contractor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contractor.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contractor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusVariant = (status: Contractor["active"]) => {
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
          <h1 className="text-lg lg:text-2xl font-bold">ניהול קבלנים</h1>
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
                      placeholder="חיפוש קבלן..."
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
                    הוסף קבלן חדש
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contractors Table */}
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
                      {filteredContractors.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            לא נמצאו רשומות
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredContractors.map((contractor) => (
                          <TableRow 
                            key={contractor.id}
                            className="hover:bg-muted/30 transition-colors"
                          >
                            <TableCell className="font-medium">{contractor.name}</TableCell>
                            <TableCell className="text-muted-foreground">{contractor.phone}</TableCell>
                            <TableCell className="text-muted-foreground">{contractor.email}</TableCell>
                            <TableCell className="text-muted-foreground">{contractor.city}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusVariant(contractor.active)}>
                                {contractor.active}
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
                                  onClick={() => handleDeleteContractor(contractor.id)}
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
                  {filteredContractors.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      לא נמצאו רשומות
                    </div>
                  ) : (
                    filteredContractors.map((contractor) => (
                      <div
                        key={contractor.id}
                        className="p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-base mb-1">{contractor.name}</h3>
                            <p className="text-sm text-muted-foreground">{contractor.city}</p>
                          </div>
                          <Badge variant="outline" className={getStatusVariant(contractor.active)}>
                            {contractor.active}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm mb-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">טלפון:</span>
                            <span className="font-medium">{contractor.phone}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">אימייל:</span>
                            <span className="font-medium truncate mr-2">{contractor.email}</span>
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
                            onClick={() => handleDeleteContractor(contractor.id)}
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

      {/* Add Contractor Modal */}
      <AddPartnerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddContractor}
        type="קבלן"
      />
    </div>
  );
};

export default Contractors;