import { useState, useEffect, useRef } from "react";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Trash2, Check, X, Download, Upload } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { AddStockOrderModal } from "@/components/AddStockOrderModal";
import * as XLSX from "xlsx";
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportToExcel = async () => {
    try {
      const { data: stockOrders } = await supabase.from("stock_orders").select("*").order("row_number", { ascending: true });
      
      const wb = XLSX.utils.book_new();
      
      // Create template format data
      const templateData: any[][] = [
        ["order number :", ""],
        ["", "רוחב כנף", "R/L", "גובה כנף", "ניקוב 100+ 100-", "HOSEM KATIF RESHAFIM", "צבע", "הדלת", "משקוף בנייה", "גובה משקוף", "משקוף כיסוי", "כמות", "מחיר", "מחיר מתקין"]
      ];

      stockOrders?.forEach((order) => {
        templateData.push([
          order.row_number,
          order.wing_width || "",
          order.direction || "",
          order.wing_height || "",
          order.drilling || "",
          order.notes || "",
          order.door_color || "",
          "", // הדלת column
          order.construction_frame || "",
          order.frame_height || "",
          order.cover_frame || "",
          order.quantity || 1,
          order.price || 0,
          order.installer_price || 0
        ]);
      });

      const ws = XLSX.utils.aoa_to_sheet(templateData);
      ws['!cols'] = [
        { wch: 5 }, { wch: 10 }, { wch: 5 }, { wch: 10 }, { wch: 15 }, { wch: 20 }, 
        { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 8 }, { wch: 10 }, { wch: 12 }
      ];
      XLSX.utils.book_append_sheet(wb, ws, "הזמנות מלאי");
      
      XLSX.writeFile(wb, `הזמנות_מלאי_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
      toast.success("הייצוא הושלם בהצלחה");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("שגיאה בייצוא");
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);
      const sheet = wb.Sheets[wb.SheetNames[0]];
      
      // Read as array of arrays to handle the specific format
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
      
      if (rows.length < 3) {
        toast.error("קובץ ריק או לא תקין");
        return;
      }

      // Column mapping: A=#, B=רוחב כנף, C=R/L, D=גובה כנף, E=ניקוב, F=HOSEM, G=צבע, H=הדלת, I=משקוף בנייה, J=גובה משקוף, K=משקוף כיסוי, L=כמות, M=מחיר, N=מחיר מתקין
      let importedCount = 0;
      
      for (let i = 2; i < rows.length; i++) {
        const row = rows[i];
        const rowNum = row[0];
        
        // Skip empty rows
        if (!rowNum && !row[1]) continue;
        
        const stockOrder = {
          row_number: rowNum || (i - 1),
          partner_type: "משווק",
          partner_name: "ייבוא מאקסל",
          wing_width: row[1] ? Number(row[1]) : null,
          direction: row[2]?.toString()?.trim() || null,
          wing_height: row[3] ? Number(row[3]) : null,
          drilling: row[4]?.toString()?.trim() || null,
          notes: row[5]?.toString()?.trim() || null,
          door_color: row[6]?.toString()?.trim() || null,
          construction_frame: row[8]?.toString()?.trim() || null,
          frame_height: row[9] ? Number(row[9]) : null,
          cover_frame: row[10]?.toString()?.trim() || null,
          quantity: row[11] ? Number(row[11]) : 1,
          price: row[12] ? Number(row[12]) : 0,
          installer_price: row[13] ? Number(row[13]) : 0,
          status: "בהזמנה"
        };

        const { error } = await supabase.from("stock_orders").insert(stockOrder);
        if (!error) importedCount++;
      }
      
      toast.success(`יובאו ${importedCount} הזמנות בהצלחה`);
      queryClient.invalidateQueries({ queryKey: ['stock-orders'] });
    } catch (error) {
      console.error("Import error:", error);
      toast.error("שגיאה בייבוא");
    }
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

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

  const confirmReceiptMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('stock_orders')
        .update({ status: 'התקבל' })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-orders'] });
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
      toast.success('ההזמנה אושרה והמוצרים נכנסו למלאי');
    },
    onError: () => {
      toast.error('שגיאה באישור קבלת ההזמנה');
    }
  });

  const cancelOrderMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('stock_orders')
        .update({ status: 'מבוטל' })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock-orders'] });
      queryClient.invalidateQueries({ queryKey: ['stock-movements'] });
      toast.success('ההזמנה בוטלה');
    },
    onError: () => {
      toast.error('שגיאה בביטול ההזמנה');
    }
  });

  const filteredOrders = stockOrders.filter(order =>
    order.door_color?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.drilling?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.row_number.toString().includes(searchQuery)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'בהזמנה': return 'bg-yellow-100 text-yellow-800';
      case 'התקבל': return 'bg-green-100 text-green-800';
      case 'מבוטל': return 'bg-red-100 text-red-800';
      case 'פעיל': return 'bg-blue-100 text-blue-800';
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
              <div className="flex gap-2 flex-wrap">
                <Button onClick={() => setIsAddModalOpen(true)}>
                  <Plus className="h-4 w-4 ml-2" />
                  הזמנה חדשה
                </Button>
                <Button variant="outline" onClick={exportToExcel}>
                  <Download className="h-4 w-4 ml-2" />
                  ייצוא
                </Button>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <Upload className="h-4 w-4 ml-2" />
                  ייבוא
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImport}
                  accept=".xlsx,.xls"
                  className="hidden"
                />
              </div>
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
                      <TableHead className="text-right border-l">#</TableHead>
                      <TableHead className="text-right border-l">רוחב כנף</TableHead>
                      <TableHead className="text-right border-l">
                        <div>כיוון</div>
                        <div className="text-xs text-muted-foreground font-normal">R / L</div>
                      </TableHead>
                      <TableHead className="text-right border-l">גובה כנף</TableHead>
                      <TableHead className="text-right border-l">
                        <div>ניקוב</div>
                        <div className="text-xs text-muted-foreground font-normal">+100 -100</div>
                      </TableHead>
                      <TableHead className="text-center min-w-[150px] border-l">
                        <div>צבע</div>
                        <div className="flex justify-center gap-3 mt-2">
                          <img src={doorColorRight} alt="R" className="h-8 w-auto" />
                          <img src={doorColorLeft} alt="L" className="h-8 w-auto" />
                        </div>
                      </TableHead>
                      <TableHead className="text-center min-w-[120px] border-l">
                        <div>משקוף בנייה</div>
                        <div className="flex justify-center mt-2">
                          <img src={constructionFrame} alt="משקוף בנייה" className="h-14 w-auto" />
                        </div>
                      </TableHead>
                      <TableHead className="text-right border-l">גובה משקוף</TableHead>
                      <TableHead className="text-center min-w-[120px] border-l">
                        <div>משקוף כיסוי</div>
                        <div className="flex justify-center mt-2">
                          <img src={coverFrame} alt="משקוף כיסוי" className="h-14 w-auto" />
                        </div>
                      </TableHead>
                      <TableHead className="text-right border-l">כמות</TableHead>
                      <TableHead className="text-right border-l">מחיר</TableHead>
                      <TableHead className="text-right border-l">מחיר מתקין</TableHead>
                      <TableHead className="text-right border-l">סטטוס</TableHead>
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
                          <TableCell className="border-l">{order.row_number}</TableCell>
                          <TableCell className="border-l">{order.wing_width || '-'}</TableCell>
                          <TableCell className="border-l">{order.direction || '-'}</TableCell>
                          <TableCell className="border-l">{order.wing_height || '-'}</TableCell>
                          <TableCell className="border-l">{order.drilling || '-'}</TableCell>
                          <TableCell className="min-w-[150px] text-center border-l">{order.door_color || '-'}</TableCell>
                          <TableCell className="border-l">{order.construction_frame || '-'}</TableCell>
                          <TableCell className="border-l">{order.frame_height || '-'}</TableCell>
                          <TableCell className="border-l">{order.cover_frame || '-'}</TableCell>
                          <TableCell className="border-l">{order.quantity}</TableCell>
                          <TableCell className="border-l">₪{order.price.toLocaleString()}</TableCell>
                          <TableCell className="border-l">₪{order.installer_price.toLocaleString()}</TableCell>
                          <TableCell className="border-l">
                            <Badge className={getStatusColor(order.status)}>
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              {order.status === 'בהזמנה' && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => confirmReceiptMutation.mutate(order.id)}
                                    title="אישור קבלה"
                                  >
                                    <Check className="h-4 w-4 text-green-600" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => cancelOrderMutation.mutate(order.id)}
                                    title="ביטול"
                                  >
                                    <X className="h-4 w-4 text-red-600" />
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteMutation.mutate(order.id)}
                                title="מחיקה"
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
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
