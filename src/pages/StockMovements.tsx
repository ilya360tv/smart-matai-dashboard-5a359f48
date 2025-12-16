import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Download, ArrowUp, ArrowDown, Calendar as CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import * as XLSX from "xlsx";

interface StockMovement {
  id: string;
  movement_date: string;
  product_name: string;
  product_type: string;
  movement_type: string;
  quantity: number;
  partner_name: string | null;
  notes: string | null;
}

const StockMovements = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [movementType, setMovementType] = useState<"הכל" | "כניסה" | "יציאה">("הכל");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const { data: movements = [], isLoading } = useQuery({
    queryKey: ["stock-movements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stock_movements")
        .select("*")
        .order("movement_date", { ascending: false });
      
      if (error) throw error;
      return data as StockMovement[];
    },
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleExportToExcel = () => {
    const exportData = filteredMovements.map((m) => ({
      תאריך: format(new Date(m.movement_date), "dd/MM/yyyy"),
      "שם מוצר": m.product_name,
      "סוג תנועה": m.movement_type,
      כמות: m.quantity,
      "ספק / לקוח": m.partner_name || "-",
      הערות: m.notes || "-",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "תנועות מלאי");
    XLSX.writeFile(wb, `stock_movements_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  };

  const filteredMovements = movements.filter((movement) => {
    const matchesSearch =
      movement.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (movement.partner_name?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    const matchesType = movementType === "הכל" || movement.movement_type === movementType;

    const movementDate = new Date(movement.movement_date);
    const matchesDateFrom = !dateFrom || movementDate >= dateFrom;
    const matchesDateTo = !dateTo || movementDate <= dateTo;

    return matchesSearch && matchesType && matchesDateFrom && matchesDateTo;
  });

  const getMovementBadge = (type: string) => {
    return type === "כניסה"
      ? "bg-success/10 text-success border-success/20"
      : "bg-destructive/10 text-destructive border-destructive/20";
  };

  const getMovementIcon = (type: string) => {
    return type === "כניסה" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-2 border-b bg-card px-3 lg:h-[60px] lg:px-6 sticky top-0 z-10 shadow-sm">
          <h1 className="text-lg lg:text-2xl font-bold flex-1">היסטוריית תנועות מלאי</h1>
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
            {/* Filters */}
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Date From */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">מתאריך</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-11 justify-start text-right font-normal",
                              !dateFrom && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="ml-2 h-4 w-4" />
                            {dateFrom ? format(dateFrom, "dd/MM/yyyy") : "בחר תאריך"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateFrom}
                            onSelect={setDateFrom}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Date To */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">עד תאריך</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full h-11 justify-start text-right font-normal",
                              !dateTo && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="ml-2 h-4 w-4" />
                            {dateTo ? format(dateTo, "dd/MM/yyyy") : "בחר תאריך"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateTo}
                            onSelect={setDateTo}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Movement Type */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">סוג תנועה</label>
                      <Select
                        value={movementType}
                        onValueChange={(value: "הכל" | "כניסה" | "יציאה") =>
                          setMovementType(value)
                        }
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="בחר סוג תנועה" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="הכל">הכל</SelectItem>
                          <SelectItem value="כניסה">כניסה</SelectItem>
                          <SelectItem value="יציאה">יציאה</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Search */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">חיפוש</label>
                      <div className="relative">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="חפש מוצר או ספק..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pr-10 h-11"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Export Button */}
                  <div className="flex justify-start">
                    <Button
                      onClick={handleExportToExcel}
                      variant="outline"
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      ייצא לקובץ Excel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Movements Table */}
            <Card className="shadow-sm">
              <CardContent className="p-0">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-right font-bold">תאריך</TableHead>
                        <TableHead className="text-right font-bold">שם מוצר</TableHead>
                        <TableHead className="text-right font-bold">סוג תנועה</TableHead>
                        <TableHead className="text-right font-bold">כמות</TableHead>
                        <TableHead className="text-right font-bold">ספק / לקוח</TableHead>
                        <TableHead className="text-right font-bold">הערות</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            טוען נתונים...
                          </TableCell>
                        </TableRow>
                      ) : filteredMovements.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-muted-foreground"
                          >
                            לא נמצאו תנועות מלאי
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredMovements.map((movement) => (
                          <TableRow
                            key={movement.id}
                            className="hover:bg-muted/30 transition-colors"
                          >
                            <TableCell className="font-medium">
                              {format(new Date(movement.movement_date), "dd/MM/yyyy")}
                            </TableCell>
                            <TableCell className="font-medium">
                              {movement.product_name}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "gap-1",
                                  getMovementBadge(movement.movement_type)
                                )}
                              >
                                {getMovementIcon(movement.movement_type)}
                                {movement.movement_type}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-semibold">
                              {movement.quantity}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {movement.partner_name || "-"}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {movement.notes || "-"}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden p-3 space-y-3">
                  {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                      טוען נתונים...
                    </div>
                  ) : filteredMovements.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      לא נמצאו תנועות מלאי
                    </div>
                  ) : (
                    filteredMovements.map((movement) => (
                      <div
                        key={movement.id}
                        className="p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-base mb-1">
                              {movement.product_name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(movement.movement_date), "dd/MM/yyyy")}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={cn("gap-1", getMovementBadge(movement.movement_type))}
                          >
                            {getMovementIcon(movement.movement_type)}
                            {movement.movement_type}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">כמות:</span>
                            <span className="font-semibold">{movement.quantity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              {movement.movement_type === "כניסה" ? "ספק:" : "לקוח:"}
                            </span>
                            <span className="font-medium">{movement.partner_name || "-"}</span>
                          </div>
                          {movement.notes && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">הערות:</span>
                              <span className="font-medium">{movement.notes}</span>
                            </div>
                          )}
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
    </div>
  );
};

export default StockMovements;
