import { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, Clock, ChevronDown, ChevronRight, PackagePlus, Lock, X } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AddOrderModal } from "@/components/AddOrderModal";
import { EditSubOrderModal } from "@/components/EditSubOrderModal";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface OrderGroup {
  id: string;
  group_number: string;
  status: string;
  created_at: string;
  updated_at: string;
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
  active_door_width: number | null;
  active_door_height: number | null;
  active_door_direction: string | null;
  fixed_door_width: number | null;
  fixed_door_height: number | null;
  fixed_door_direction: string | null;
  quantity: number;
  price: number;
  installer_price: number;
  notes: string | null;
  status: string;
  created_at: string;
}

interface GroupedOrder extends OrderGroup {
  subOrders: SubOrder[];
}

const Orders = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubOrder, setEditingSubOrder] = useState<SubOrder | null>(null);
  const [groupedOrders, setGroupedOrders] = useState<GroupedOrder[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [activeGroup, setActiveGroup] = useState<OrderGroup | null>(null);
  
  // Alert dialogs state
  const [deleteGroupDialog, setDeleteGroupDialog] = useState<{ open: boolean; groupId: string | null }>({ open: false, groupId: null });
  const [closeGroupDialog, setCloseGroupDialog] = useState<{ open: boolean; groupId: string | null }>({ open: false, groupId: null });
  const [cancelSubOrderDialog, setCancelSubOrderDialog] = useState<{ open: boolean; subOrderId: string | null; groupId: string | null }>({ open: false, subOrderId: null, groupId: null });

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
      
      const { data: groups, error: groupsError } = await supabase
        .from("order_groups")
        .select("*")
        .order("created_at", { ascending: false });

      if (groupsError) throw groupsError;

      const { data: subOrders, error: subOrdersError } = await supabase
        .from("sub_orders")
        .select("*")
        .order("sub_number", { ascending: true });

      if (subOrdersError) throw subOrdersError;

      const active = groups?.find(g => g.status === "פעיל") || null;
      setActiveGroup(active);

      const grouped: GroupedOrder[] = (groups || []).map((group) => ({
        ...group,
        subOrders: (subOrders || []).filter((sub) => sub.order_group_id === group.id),
      }));

      setGroupedOrders(grouped);
      
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
      if (activeGroup) {
        const { error: updateError } = await supabase
          .from("order_groups")
          .update({ status: "סגור" })
          .eq("id", activeGroup.id);

        if (updateError) throw updateError;
      }

      const currentNumber = activeGroup?.group_number || "C47";
      const match = currentNumber.match(/C(\d+)/);
      const nextNum = match ? parseInt(match[1]) + 1 : 48;
      const newGroupNumber = `C${nextNum}`;

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

  const handleDeleteGroup = async (groupId: string) => {
    try {
      // Delete all sub-orders first
      const { error: subOrdersError } = await supabase
        .from("sub_orders")
        .delete()
        .eq("order_group_id", groupId);

      if (subOrdersError) throw subOrdersError;

      // Then delete the group
      const { error: groupError } = await supabase
        .from("order_groups")
        .delete()
        .eq("id", groupId);

      if (groupError) throw groupError;

      toast({
        title: "הקבוצה נמחקה בהצלחה",
        description: "הקבוצה וכל התת-הזמנות שלה הוסרו מהמערכת",
      });

      fetchGroupedOrders();
    } catch (error) {
      console.error("Error deleting group:", error);
      toast({
        title: "שגיאה במחיקת הקבוצה",
        description: "לא הצלחנו למחוק את הקבוצה",
        variant: "destructive",
      });
    }
  };

  const handleCloseGroup = async (groupId: string) => {
    try {
      const { error } = await supabase
        .from("order_groups")
        .update({ status: "סגור" })
        .eq("id", groupId);

      if (error) throw error;

      toast({
        title: "ההזמנה נסגרה בהצלחה",
        description: "סטטוס ההזמנה שונה ל'סגור'",
      });

      fetchGroupedOrders();
    } catch (error) {
      console.error("Error closing group:", error);
      toast({
        title: "שגיאה בסגירת ההזמנה",
        description: "לא הצלחנו לסגור את ההזמנה",
        variant: "destructive",
      });
    }
  };

  const handleCancelSubOrder = async (subOrderId: string, groupId: string) => {
    try {
      const { error } = await supabase
        .from("sub_orders")
        .update({ status: "בוטל" })
        .eq("id", subOrderId);

      if (error) throw error;

      setGroupedOrders(
        groupedOrders.map((group) =>
          group.id === groupId
            ? {
                ...group,
                subOrders: group.subOrders.map((o) =>
                  o.id === subOrderId ? { ...o, status: "בוטל" } : o
                ),
              }
            : group
        )
      );

      toast({
        title: "תת-ההזמנה בוטלה",
        description: "תת-ההזמנה סומנה כבוטלה במערכת",
      });
    } catch (error) {
      console.error("Error cancelling sub-order:", error);
      toast({
        title: "שגיאה בביטול תת-ההזמנה",
        description: "לא הצלחנו לבטל את תת-ההזמנה",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSubOrder = async (id: string, groupId: string) => {
    try {
      const { error } = await supabase.from("sub_orders").delete().eq("id", id);

      if (error) throw error;

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

  const handleEditSubOrder = (subOrder: SubOrder) => {
    setEditingSubOrder(subOrder);
    setIsEditModalOpen(true);
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
                            <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                              <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleGroup(group.id)}>
                                {expandedGroups.has(group.id) ? (
                                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                                ) : (
                                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                )}
                                <div>
                                  <h3 className="font-bold text-xl flex items-center gap-2">
                                    {group.group_number}
                                    <Badge 
                                      variant={group.status === "פעיל" ? "default" : "destructive"}
                                      className={group.status === "פעיל" ? "bg-blue-500 hover:bg-blue-600" : "bg-red-500 hover:bg-red-600"}
                                    >
                                      {group.status}
                                    </Badge>
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {group.subOrders.length} תת-הזמנות | נוצר: {format(new Date(group.created_at), "dd/MM/yyyy HH:mm")}
                                    {group.status === "סגור" && ` | סגור: ${format(new Date(group.updated_at), "dd/MM/yyyy HH:mm")}`}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                {group.status === "פעיל" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-2"
                                    onClick={() => setCloseGroupDialog({ open: true, groupId: group.id })}
                                  >
                                    <Lock className="h-4 w-4" />
                                    סגור
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
                                  onClick={() => setDeleteGroupDialog({ open: true, groupId: group.id })}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  מחק
                                </Button>
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
                                        <TableHead className="text-right font-bold">סטטוס</TableHead>
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
                                        <TableRow 
                                          key={order.id} 
                                          className={`hover:bg-muted/20 ${order.status === "בוטל" ? "opacity-50" : ""}`}
                                        >
                                          <TableCell className={`font-bold ${order.status === "בוטל" ? "line-through text-muted-foreground" : "text-primary"}`}>
                                            {order.full_order_number}
                                          </TableCell>
                                          <TableCell>
                                            <Badge 
                                              variant={order.status === "פעיל" ? "default" : "secondary"}
                                              className={order.status === "בוטל" ? "bg-gray-400" : ""}
                                            >
                                              {order.status}
                                            </Badge>
                                          </TableCell>
                                          <TableCell className={`font-medium ${order.status === "בוטל" ? "line-through" : ""}`}>
                                            {order.partner_name}
                                          </TableCell>
                                          <TableCell className={`text-muted-foreground text-sm ${order.status === "בוטל" ? "line-through" : ""}`}>
                                            {order.product_category}
                                            {order.active_door_width && ` - ${order.active_door_width}מ"מ`}
                                          </TableCell>
                                          <TableCell>
                                            <Badge variant="secondary" className="text-xs">
                                              {order.active_door_direction || "-"}
                                            </Badge>
                                          </TableCell>
                                          <TableCell className={`font-semibold ${order.status === "בוטל" ? "line-through" : ""}`}>
                                            {order.quantity}
                                          </TableCell>
                                          <TableCell className={`font-medium ${order.status === "בוטל" ? "line-through" : ""}`}>
                                            ₪{order.price.toFixed(2)}
                                          </TableCell>
                                          <TableCell className={`font-bold ${order.status === "בוטל" ? "line-through text-muted-foreground" : "text-primary"}`}>
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
                                                onClick={() => handleEditSubOrder(order)}
                                                disabled={order.status === "בוטל"}
                                              >
                                                <Pencil className="h-3.5 w-3.5" />
                                              </Button>
                                              {order.status === "פעיל" && (
                                                <Button
                                                  size="sm"
                                                  variant="ghost"
                                                  className="h-8 w-8 p-0 hover:bg-orange-500/10 hover:text-orange-600"
                                                  onClick={() => setCancelSubOrderDialog({ open: true, subOrderId: order.id, groupId: group.id })}
                                                >
                                                  <X className="h-3.5 w-3.5" />
                                                </Button>
                                              )}
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
                            <div className="bg-muted/30 p-3">
                              <div className="flex items-center justify-between mb-2" onClick={() => toggleGroup(group.id)}>
                                <div className="flex items-center gap-2">
                                  {expandedGroups.has(group.id) ? (
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                  )}
                                  <h3 className="font-bold text-lg">{group.group_number}</h3>
                                  <Badge 
                                    variant={group.status === "פעיל" ? "default" : "destructive"}
                                    className={`text-xs ${group.status === "פעיל" ? "bg-blue-500" : "bg-red-500"}`}
                                  >
                                    {group.status}
                                  </Badge>
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                {group.subOrders.length} תת-הזמנות | {format(new Date(group.created_at), "dd/MM/yyyy")}
                              </p>
                              <div className="flex gap-2">
                                {group.status === "פעיל" && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="gap-1 text-xs"
                                    onClick={() => setCloseGroupDialog({ open: true, groupId: group.id })}
                                  >
                                    <Lock className="h-3 w-3" />
                                    סגור
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1 text-xs hover:bg-destructive/10 hover:text-destructive"
                                  onClick={() => setDeleteGroupDialog({ open: true, groupId: group.id })}
                                >
                                  <Trash2 className="h-3 w-3" />
                                  מחק
                                </Button>
                              </div>
                            </div>

                            {/* Sub-orders Mobile Cards */}
                            {expandedGroups.has(group.id) && (
                              <div className="p-2 space-y-2">
                                {group.subOrders.length === 0 ? (
                                  <div className="text-center py-4 text-muted-foreground text-sm">
                                    אין תת-הזמנות בקבוצה זו
                                  </div>
                                ) : (
                                  group.subOrders.map((order) => (
                                    <div 
                                      key={order.id} 
                                      className={`border rounded-lg p-3 space-y-2 ${order.status === "בוטל" ? "opacity-50 bg-muted/20" : ""}`}
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1">
                                            <span className={`font-bold text-sm ${order.status === "בוטל" ? "line-through text-muted-foreground" : "text-primary"}`}>
                                              {order.full_order_number}
                                            </span>
                                            <Badge 
                                              variant={order.status === "פעיל" ? "default" : "secondary"}
                                              className={`text-xs ${order.status === "בוטל" ? "bg-gray-400" : ""}`}
                                            >
                                              {order.status}
                                            </Badge>
                                          </div>
                                          <p className={`text-sm font-medium ${order.status === "בוטל" ? "line-through" : ""}`}>{order.partner_name}</p>
                                          <p className={`text-xs text-muted-foreground ${order.status === "בוטל" ? "line-through" : ""}`}>
                                            {order.product_category}
                                            {order.active_door_width && ` - ${order.active_door_width}מ"מ`}
                                          </p>
                                        </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div>
                                          <span className="text-muted-foreground">כיוון: </span>
                                          <Badge variant="secondary" className="text-xs">
                                            {order.active_door_direction || "-"}
                                          </Badge>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">כמות: </span>
                                          <span className={`font-semibold ${order.status === "בוטל" ? "line-through" : ""}`}>{order.quantity}</span>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">מחיר: </span>
                                          <span className={`font-medium ${order.status === "בוטל" ? "line-through" : ""}`}>₪{order.price.toFixed(2)}</span>
                                        </div>
                                        <div>
                                          <span className="text-muted-foreground">מתקין: </span>
                                          <span className={`font-bold ${order.status === "בוטל" ? "line-through text-muted-foreground" : "text-primary"}`}>
                                            ₪{order.installer_price.toFixed(2)}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="flex gap-1 pt-2 border-t">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="flex-1 gap-1 text-xs h-8"
                                          onClick={() => handleEditSubOrder(order)}
                                          disabled={order.status === "בוטל"}
                                        >
                                          <Pencil className="h-3 w-3" />
                                          ערוך
                                        </Button>
                                        {order.status === "פעיל" && (
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            className="flex-1 gap-1 text-xs h-8 hover:bg-orange-500/10 hover:text-orange-600"
                                            onClick={() => setCancelSubOrderDialog({ open: true, subOrderId: order.id, groupId: group.id })}
                                          >
                                            <X className="h-3 w-3" />
                                            בטל
                                          </Button>
                                        )}
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="flex-1 gap-1 text-xs h-8 hover:bg-destructive/10 hover:text-destructive"
                                          onClick={() => handleDeleteSubOrder(order.id, group.id)}
                                        >
                                          <Trash2 className="h-3 w-3" />
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

      <AddOrderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchGroupedOrders}
      />

      <EditSubOrderModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingSubOrder(null);
        }}
        onSuccess={fetchGroupedOrders}
        subOrder={editingSubOrder}
      />

      {/* Delete Group Confirmation */}
      <AlertDialog open={deleteGroupDialog.open} onOpenChange={(open) => setDeleteGroupDialog({ open, groupId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו תמחק את הקבוצה וכל התת-הזמנות שלה לצמיתות. לא ניתן לבטל פעולה זו.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteGroupDialog.groupId) {
                  handleDeleteGroup(deleteGroupDialog.groupId);
                  setDeleteGroupDialog({ open: false, groupId: null });
                }
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              מחק
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Close Group Confirmation */}
      <AlertDialog open={closeGroupDialog.open} onOpenChange={(open) => setCloseGroupDialog({ open, groupId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>סגירת הזמנה</AlertDialogTitle>
            <AlertDialogDescription>
              האם אתה בטוח שברצונך לסגור הזמנה זו? ניתן יהיה לפתוח אותה מחדש במידת הצורך.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (closeGroupDialog.groupId) {
                  handleCloseGroup(closeGroupDialog.groupId);
                  setCloseGroupDialog({ open: false, groupId: null });
                }
              }}
            >
              סגור הזמנה
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Sub-Order Confirmation */}
      <AlertDialog open={cancelSubOrderDialog.open} onOpenChange={(open) => setCancelSubOrderDialog({ open, subOrderId: null, groupId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ביטול תת-הזמנה</AlertDialogTitle>
            <AlertDialogDescription>
              האם אתה בטוח שברצונך לבטל תת-הזמנה זו? היא תסומן כבוטלה אך תישאר במערכת.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (cancelSubOrderDialog.subOrderId && cancelSubOrderDialog.groupId) {
                  handleCancelSubOrder(cancelSubOrderDialog.subOrderId, cancelSubOrderDialog.groupId);
                  setCancelSubOrderDialog({ open: false, subOrderId: null, groupId: null });
                }
              }}
              className="bg-orange-500 hover:bg-orange-600"
            >
              בטל תת-הזמנה
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Orders;
