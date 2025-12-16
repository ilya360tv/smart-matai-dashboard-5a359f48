import { useState, useEffect } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Trash2, Edit } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { AddStockOrderModal } from "@/components/AddStockOrderModal";
import doorColorRight from "@/assets/diagrams/door_color_right.png";
import doorColorLeft from "@/assets/diagrams/door_color_left.png";
import constructionFrame from "@/assets/diagrams/construction_frame.png";
import coverFrame from "@/assets/diagrams/cover_frame.png";

interface StockOrder {
  id: string;
  row_number: number;
  wing_width: number | null;
  direction: string | null;
  wing_height: number | null;
  drilling: string | null;
  door_color: string | null;
  construction_frame: string | null;
  frame_height: number | null;
  cover_frame: string | null;
  quantity: number;
  price: number;
  installer_price: number;
  partner_type: string;
  partner_name: string;
  status: string;
  notes: string | null;
  created_at: string;
}

const StockOrders = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const { data: stockOrders = [], isLoading } = useQuery({
    queryKey: ['stock-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stock_orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as StockOrder[];
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('stock_orders')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-orders'] });
      toast.success('ההזמנה נמחקה בהצלחה');
    },
    onError: () => {
      toast.error('שגיאה במחיקת ההזמנה');
    }
  });

  const filteredOrders = stockOrders.filter(order =>
    order.door_color?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.drilling?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.row_number.toString().includes(searchQuery)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'פעיל': return 'bg-green-100 text-green-800';
      case 'בוטל': return 'bg-red-100 text-red-800';
      case 'הושלם': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background" dir="rtl">
      <DashboardSidebar />
      
      <main className="flex-1 p-4 lg:p-6 overflow-auto">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">הזמנת מלאי</h1>
            <p className="text-muted-foreground">הזמנות ללקוחות/משווקים</p>
          </div>
          <div className="text-lg font-medium text-muted-foreground">
            {format(currentTime, 'HH:mm:ss')}
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row gap-4 justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="חיפוש לפי צבע, ניקוב, מספר שורה..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <Plus className="h-4 w-4 ml-2" />
                הזמנה חדשה
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">טוען...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">#</TableHead>
                      <TableHead className="text-right">רוחב כנף</TableHead>
                      <TableHead className="text-right">
                        <div>כיוון</div>
                        <div className="text-xs text-muted-foreground font-normal">R / L</div>
                      </TableHead>
                      <TableHead className="text-right">גובה כנף</TableHead>
                      <TableHead className="text-right">
                        <div>ניקוב</div>
                        <div className="text-xs text-muted-foreground font-normal">+100 -100</div>
                      </TableHead>
                      <TableHead className="text-center min-w-[150px]">
                        <div>צבע</div>
                        <div className="flex justify-center gap-3 mt-2">
                          <img src={doorColorRight} alt="R" className="h-12 w-auto" />
                          <img src={doorColorLeft} alt="L" className="h-12 w-auto" />
                        </div>
                      </TableHead>
                      <TableHead className="text-center min-w-[120px]">
                        <div>משקוף בנייה</div>
                        <div className="flex justify-center mt-2">
                          <img src={constructionFrame} alt="משקוף בנייה" className="h-14 w-auto" />
                        </div>
                      </TableHead>
                      <TableHead className="text-right">גובה משקוף</TableHead>
                      <TableHead className="text-center min-w-[120px]">
                        <div>משקוף כיסוי</div>
                        <div className="flex justify-center mt-2">
                          <img src={coverFrame} alt="משקוף כיסוי" className="h-14 w-auto" />
                        </div>
                      </TableHead>
                      <TableHead className="text-right">כמות</TableHead>
                      <TableHead className="text-right">מחיר</TableHead>
                      <TableHead className="text-right">מחיר מתקין</TableHead>
                      <TableHead className="text-right">סטטוס</TableHead>
                      <TableHead className="text-right">פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={14} className="text-center py-8 text-muted-foreground">
                          לא נמצאו הזמנות
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.row_number}</TableCell>
                          <TableCell>{order.wing_width || '-'}</TableCell>
                          <TableCell>{order.direction || '-'}</TableCell>
                          <TableCell>{order.wing_height || '-'}</TableCell>
                          <TableCell>{order.drilling || '-'}</TableCell>
                          <TableCell className="min-w-[150px] text-center">{order.door_color || '-'}</TableCell>
                          <TableCell>{order.construction_frame || '-'}</TableCell>
                          <TableCell>{order.frame_height || '-'}</TableCell>
                          <TableCell>{order.cover_frame || '-'}</TableCell>
                          <TableCell>{order.quantity}</TableCell>
                          <TableCell>₪{order.price.toLocaleString()}</TableCell>
                          <TableCell>₪{order.installer_price.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteMutation.mutate(order.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <AddStockOrderModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['stock-orders'] });
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
};

export default StockOrders;
