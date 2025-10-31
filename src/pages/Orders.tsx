import { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, Clock } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AddOrderModal } from "@/components/AddOrderModal";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  product_type: string;
  product_width: number | null;
  side: string | null;
  drilling: string | null;
  katif_blocker: string | null;
  door_color: string | null;
  construction_frame: string | null;
  frame_height: number | null;
  cover_frame: string | null;
  electric_lock: boolean;
  handle_hole: boolean;
  clamp_holes: string | null;
  quantity: number;
  price: number;
  installer_price: number;
  created_at: string;
}

const Orders = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "שגיאה בטעינת ההזמנות",
        description: "לא הצלחנו לטעון את ההזמנות",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    try {
      const { error } = await supabase.from("orders").delete().eq("id", id);

      if (error) throw error;

      setOrders(orders.filter((o) => o.id !== id));
      toast({
        title: "ההזמנה נמחקה בהצלחה",
        description: "ההזמנה הוסרה מהמערכת",
      });
    } catch (error) {
      console.error("Error deleting order:", error);
      toast({
        title: "שגיאה במחיקת ההזמנה",
        description: "לא הצלחנו למחוק את ההזמנה",
        variant: "destructive",
      });
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-2 border-b bg-card px-3 lg:h-[60px] lg:px-6 sticky top-0 z-10 shadow-sm">
          <h1 className="text-lg lg:text-2xl font-bold flex-1">ניהול הזמנות</h1>
          <div className="flex items-center gap-1.5 lg:gap-2 text-muted-foreground">
            <Clock className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
            <div className="flex flex-col items-end">
              <span className="font-medium text-xs lg:text-base">
                {format(currentTime, "HH:mm:ss")}
              </span>
              <span className="text-[10px] lg:text-xs hidden sm:block">
                {format(currentTime, "d MMMM yyyy", { locale: he })}
              </span>
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
                      placeholder="חיפוש הזמנה..."
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
                    פתיחת הזמנה חדשה
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Orders Table */}
            <Card className="shadow-sm">
              <CardContent className="p-0">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    טוען הזמנות...
                  </div>
                ) : (
                  <>
                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="text-right font-bold">
                              מספר הזמנה
                            </TableHead>
                            <TableHead className="text-right font-bold">
                              שם לקוח
                            </TableHead>
                            <TableHead className="text-right font-bold">
                              סוג מוצר
                            </TableHead>
                            <TableHead className="text-right font-bold">
                              R/L
                            </TableHead>
                            <TableHead className="text-right font-bold">
                              כמות
                            </TableHead>
                            <TableHead className="text-right font-bold">
                              מחיר
                            </TableHead>
                            <TableHead className="text-right font-bold">
                              מחיר מתקין
                            </TableHead>
                            <TableHead className="text-right font-bold">
                              תאריך
                            </TableHead>
                            <TableHead className="text-right font-bold">
                              פעולות
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredOrders.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={9}
                                className="text-center py-8 text-muted-foreground"
                              >
                                לא נמצאו הזמנות
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredOrders.map((order) => (
                              <TableRow
                                key={order.id}
                                className="hover:bg-muted/30 transition-colors"
                              >
                                <TableCell className="font-bold text-primary">
                                  {order.order_number}
                                </TableCell>
                                <TableCell className="font-medium">
                                  {order.customer_name}
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                  {order.product_type}
                                  {order.product_width && ` - ${order.product_width}ס״מ`}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary">
                                    {order.side || "-"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="font-semibold">
                                  {order.quantity}
                                </TableCell>
                                <TableCell className="font-medium">
                                  ₪{order.price.toFixed(2)}
                                </TableCell>
                                <TableCell className="font-bold text-primary">
                                  ₪{order.installer_price.toFixed(2)}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                  {format(
                                    new Date(order.created_at),
                                    "dd/MM/yyyy HH:mm"
                                  )}
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
                                      onClick={() => handleDeleteOrder(order.id)}
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
                    <div className="lg:hidden p-3 space-y-3">
                      {filteredOrders.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          לא נמצאו הזמנות
                        </div>
                      ) : (
                        filteredOrders.map((order) => (
                          <div
                            key={order.id}
                            className="p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="font-bold text-primary text-lg mb-1">
                                  {order.order_number}
                                </h3>
                                <p className="font-medium">{order.customer_name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {order.product_type}
                                </p>
                              </div>
                              <Badge variant="secondary">{order.side || "-"}</Badge>
                            </div>

                            <div className="space-y-2 text-sm mb-3">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">כמות:</span>
                                <span className="font-semibold">{order.quantity}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">מחיר:</span>
                                <span className="font-medium">
                                  ₪{order.price.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex justify-between border-t pt-2">
                                <span className="text-muted-foreground font-medium">
                                  מחיר מתקין:
                                </span>
                                <span className="font-bold text-primary text-base">
                                  ₪{order.installer_price.toFixed(2)}
                                </span>
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
                                onClick={() => handleDeleteOrder(order.id)}
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
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Add Order Modal */}
      <AddOrderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchOrders}
      />
    </div>
  );
};

export default Orders;
