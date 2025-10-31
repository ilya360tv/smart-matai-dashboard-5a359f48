import { useState, useEffect } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AddLockingProductModal } from "@/components/AddLockingProductModal";

interface LockingProduct {
  id: string;
  item_type: string;
  quantity: number;
}

const LockingProductsInventory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [items, setItems] = useState<LockingProduct[]>([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const { data, error } = await supabase
      .from("locking_products_inventory")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("שגיאה בטעינת המלאי");
      console.error("Error fetching locking products:", error);
      return;
    }

    setItems(data || []);
  };

  const handleAddItem = async (item: Omit<LockingProduct, "id">) => {
    const { error } = await supabase
      .from("locking_products_inventory")
      .insert([item]);

    if (error) {
      toast.error("שגיאה בהוספת פריט");
      console.error("Error adding locking product:", error);
      return;
    }

    toast.success("הפריט נוסף בהצלחה");
    fetchItems();
    setIsAddModalOpen(false);
  };

  const handleDeleteItem = async (id: string) => {
    const { error } = await supabase
      .from("locking_products_inventory")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("שגיאה במחיקת הפריט");
      console.error("Error deleting locking product:", error);
      return;
    }

    toast.success("הפריט נמחק בהצלחה");
    fetchItems();
  };

  const filteredItems = items.filter((item) =>
    item.item_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      
      <div className="flex-1 p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">מלאי מוצרי נעילה</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="חיפוש לפי סוג פריט..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="ml-2 h-4 w-4" />
                הוסף פריט
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">סוג פריט</TableHead>
                    <TableHead className="text-right">כמות</TableHead>
                    <TableHead className="text-right">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.item_type}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <AddLockingProductModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAdd={handleAddItem}
      />
    </div>
  );
};

export default LockingProductsInventory;
