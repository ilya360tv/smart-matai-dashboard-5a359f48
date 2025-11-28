import { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, Clock, ChevronDown, ChevronRight, PackagePlus } from "lucide-react";
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

interface OrderGroup {
  id: string;
  group_number: string;
  status: string;
  created_at: string;
}

interface SubOrder {
  id: string;
  order_group_id: string;
  full_order_number: string;
  partner_type: string;
  partner_name: string;
  product_category: string;
  active_door_type: string | null;
  fixed_door_type: string | null;
  active_louvre_type: string | null;
  fixed_louvre_type: string | null;
  door_width: number | null;
  active_door_direction: string | null;
  fixed_door_direction: string | null;
  door_height: number | null;
  quantity: number;
  price: number;
  installer_price: number;
  notes: string | null;
  created_at: string;
}

interface GroupedOrder extends OrderGroup {
  subOrders: SubOrder[];
}

const Orders = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [groupedOrders, setGroupedOrders] = useState<GroupedOrder[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [activeGroup, setActiveGroup] = useState<OrderGroup | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchGroupedOrders();
  }, []);

  const fetchGroupedOrders = async () => {
    try {
      setLoading(true);
      
      // Fetch all order groups
      const { data: groups, error: groupsError } = await supabase
        .from("order_groups")
        .select("*")
        .order("created_at", { ascending: false });

      if (groupsError) throw groupsError;

      // Fetch all sub-orders
      const { data: subOrders, error: subOrdersError } = await supabase
        .from("sub_orders")
        .select("*")
        .order("sub_number", { ascending: true });

      if (subOrdersError) throw subOrdersError;

      // Find active group
      const active = groups?.find(g => g.status === "פעיל") || null;
      setActiveGroup(active);

      // Group sub-orders by order_group_id
      const grouped: GroupedOrder[] = (groups || []).map((group) => ({
        ...group,
        subOrders: (subOrders || []).filter((sub) => sub.order_group_id === group.id),
      }));

      setGroupedOrders(grouped);
      
      // Auto-expand active group
      if (active) {
        setExpandedGroups(new Set([active.id]));
      }
    } catch (error) {
      console.error("Error fetching grouped orders:", error);
      toast({
        title: "שגיאה בטעינת ההזמנות",
        description: "לא הצלחנו לטעון את ההזמנות",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewGroup = async () => {
    try {
      // Close current active group
      if (activeGroup) {
        const { error: updateError } = await supabase
          .from("order_groups")
          .update({ status: "סגור" })
          .eq("id", activeGroup.id);

        if (updateError) throw updateError;
      }

      // Get the next group number
      const currentNumber = activeGroup?.group_number || "C47";
      const match = currentNumber.match(/C(\d+)/);
      const nextNum = match ? parseInt(match[1]) + 1 : 48;
      const newGroupNumber = `C${nextNum}`;

      // Create new group
      const { error: insertError } = await supabase
        .from("order_groups")
        .insert({
          group_number: newGroupNumber,
          status: "פעיל",
        });

      if (insertError) throw insertError;

      toast({
        title: "הזמנה חדשה נוצרה!",
        description: `הקבוצה ${newGroupNumber} נפתחה בהצלחה`,
      });

      fetchGroupedOrders();
    } catch (error) {
      console.error("Error creating new group:", error);
      toast({
        title: "שגיאה ביצירת הזמנה חדשה",
        description: "לא הצלחנו ליצור קבוצת הזמנות חדשה",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubOrder = async (id: string, groupId: string) => {
    try {
      const { error } = await supabase.from("sub_orders").delete().eq("id", id);

      if (error) throw error;

      // Update local state
      setGroupedOrders(
        groupedOrders.map((group) =>
          group.id === groupId
            ? { ...group, subOrders: group.subOrders.filter((o) => o.id !== id) }
            : group
        )
      );

      toast({
        title: "תת-ההזמנה נמחקה בהצלחה",
        description: "תת-ההזמנה הוסרה מהמערכת",
      });
    } catch (error) {
      console.error("Error deleting sub-order:", error);
      toast({
        title: "שגיאה במחיקת תת-ההזמנה",
        description: "לא הצלחנו למחוק את תת-ההזמנה",
        variant: "destructive",
      });
    }
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const filteredGroupedOrders = groupedOrders.map((group) => ({
    ...group,
    subOrders: group.subOrders.filter(
      (order) =>
        order.partner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.full_order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.product_category.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

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
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setIsAddModalOpen(true)}
                      className="gap-2 h-11 flex-1 sm:flex-initial"
                      size="lg"
                      variant="default"
                    >
                      <Plus className="h-5 w-5" />
                      תת-הזמנה חדשה
                    </Button>
                    <Button
                      onClick={handleCreateNewGroup}
                      className="gap-2 h-11 flex-1 sm:flex-initial"
                      size="lg"
                      variant="outline"
                    >
                      <PackagePlus className="h-5 w-5" />
                      הזמנה חדשה
                    </Button>
                  </div>
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
                    {/* Desktop Grouped View */}
                    <div className="hidden lg:block">
                      {filteredGroupedOrders.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          לא נמצאו הזמנות
                        </div>
                      ) : (
                        filteredGroupedOrders.map((group) => (
                          <div key={group.id} className="border-b last:border-b-0">
                            {/* Group Header */}
                            <div
                              className="flex items-center justify-between p-4 hover:bg-muted/30 cursor-pointer transition-colors"
                              onClick={() => toggleGroup(group.id)}
                            >
                              <div className="flex items-center gap-3">
                                {expandedGroups.has(group.id) ? (
                                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                )}
                                <div>
                                  <h3 className="font-bold text-xl flex items-center gap-2">
                                    {group.group_number}
                                    {group.status === "פעיל" && (
                                      <Badge variant="default" className="text-xs">פעיל</Badge>
                                    )}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {group.subOrders.length} תת-הזמנות
                                  </p>
                                </div>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {format(new Date(group.created_at), "dd/MM/yyyy")}
                              </div>
                            </div>

                            {/* Sub-orders Table */}
                            {expandedGroups.has(group.id) && (
                              <div className="bg-muted/10">
                                {group.subOrders.length === 0 ? (
                                  <div className="text-center py-6 text-muted-foreground text-sm">
                                    אין תת-הזמנות בקבוצה זו
                                  </div>
                                ) : (
                                  <Table>
                                    <TableHeader>
                                      <TableRow className="bg-muted/30">
                                        <TableHead className="text-right font-bold">מספר</TableHead>
                                        <TableHead className="text-right font-bold">שותף</TableHead>
                                        <TableHead className="text-right font-bold">מוצר</TableHead>
                                        <TableHead className="text-right font-bold">R/L</TableHead>
                                        <TableHead className="text-right font-bold">כמות</TableHead>
                                        <TableHead className="text-right font-bold">מחיר</TableHead>
                                        <TableHead className="text-right font-bold">מתקין</TableHead>
                                        <TableHead className="text-right font-bold">תאריך</TableHead>
                                        <TableHead className="text-right font-bold">פעולות</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {group.subOrders.map((order) => (
                                        <TableRow key={order.id} className="hover:bg-muted/20">
                                          <TableCell className="font-bold text-primary">
                                            {order.full_order_number}
                                          </TableCell>
                                          <TableCell className="font-medium">
                                            {order.partner_name}
                                          </TableCell>
                                          <TableCell className="text-muted-foreground text-sm">
                                            {order.product_category}
                                            {order.door_width && ` - ${order.door_width}מ"מ`}
                                          </TableCell>
                                          <TableCell>
                                            <Badge variant="secondary" className="text-xs">
                                              {order.active_door_direction || "-"}
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
                                          <TableCell className="text-muted-foreground text-xs">
                                            {format(new Date(order.created_at), "dd/MM HH:mm")}
                                          </TableCell>
                                          <TableCell>
                                            <div className="flex gap-1">
                                              <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 hover:bg-primary/10"
                                              >
                                                <Pencil className="h-3.5 w-3.5" />
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                                                onClick={() => handleDeleteSubOrder(order.id, group.id)}
                                              >
                                                <Trash2 className="h-3.5 w-3.5" />
                                              </Button>
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    {/* Mobile Grouped Cards */}
                    <div className="lg:hidden p-3 space-y-4">
                      {filteredGroupedOrders.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          לא נמצאו הזמנות
                        </div>
                      ) : (
                        filteredGroupedOrders.map((group) => (
                          <div key={group.id} className="border rounded-lg overflow-hidden">
                            {/* Group Header */}
                            <div
                              className="p-4 bg-muted/30 cursor-pointer"
                              onClick={() => toggleGroup(group.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {expandedGroups.has(group.id) ? (
                                    <ChevronDown className="h-5 w-5" />
                                  ) : (
                                    <ChevronRight className="h-5 w-5" />
                                  )}
                                  <div>
                                    <h3 className="font-bold text-lg flex items-center gap-2">
                                      {group.group_number}
                                      {group.status === "פעיל" && (
                                        <Badge variant="default" className="text-xs">פעיל</Badge>
                                      )}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                      {group.subOrders.length} תת-הזמנות
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Sub-orders */}
                            {expandedGroups.has(group.id) && (
                              <div className="p-3 space-y-3 bg-background">
                                {group.subOrders.length === 0 ? (
                                  <div className="text-center py-4 text-muted-foreground text-sm">
                                    אין תת-הזמנות
                                  </div>
                                ) : (
                                  group.subOrders.map((order) => (
                                    <div
                                      key={order.id}
                                      className="p-3 rounded border bg-card"
                                    >
                                      <div className="flex items-start justify-between mb-2">
                                        <div className="flex-1">
                                          <h4 className="font-bold text-primary">
                                            {order.full_order_number}
                                          </h4>
                                          <p className="text-sm font-medium">{order.partner_name}</p>
                                          <p className="text-xs text-muted-foreground">
                                            {order.product_category}
                                          </p>
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                          {order.active_door_direction || "-"}
                                        </Badge>
                                      </div>

                                      <div className="space-y-1 text-xs mb-2">
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">כמות:</span>
                                          <span className="font-semibold">{order.quantity}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-muted-foreground">מחיר:</span>
                                          <span className="font-medium">₪{order.price.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between border-t pt-1">
                                          <span className="text-muted-foreground">מתקין:</span>
                                          <span className="font-bold text-primary">
                                            ₪{order.installer_price.toFixed(2)}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="flex gap-2">
                                        <Button size="sm" variant="outline" className="flex-1 h-8 text-xs">
                                          <Pencil className="h-3 w-3 ml-1" />
                                          ערוך
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="flex-1 h-8 text-xs hover:bg-destructive/10 hover:text-destructive"
                                          onClick={() => handleDeleteSubOrder(order.id, group.id)}
                                        >
                                          <Trash2 className="h-3 w-3 ml-1" />
                                          מחק
                                        </Button>
                                      </div>
                                    </div>
                                  ))
                                )}
                              </div>
                            )}
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

      {/* Add Sub-Order Modal */}
      <AddOrderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchGroupedOrders}
      />
    </div>
  );
};

export default Orders;
