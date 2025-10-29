import { useState } from "react";
import { Search, Download, ArrowUp, ArrowDown, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
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

interface StockMovement {
  id: number;
  date: Date;
  productName: string;
  type: "כניסה" | "יציאה";
  quantity: number;
  partner: string;
  notes: string;
}

const StockMovements = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [movementType, setMovementType] = useState<"הכל" | "כניסה" | "יציאה">("הכל");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [movements] = useState<StockMovement[]>([
    {
      id: 1,
      date: new Date(2025, 0, 15),
      productName: "דלת כניסה מעוצבת",
      type: "כניסה",
      quantity: 10,
      partner: "ספק ראשי בע״מ",
      notes: "משלוח שבועי",
    },
    {
      id: 2,
      date: new Date(2025, 0, 14),
      productName: "ידית אלומיניום",
      type: "יציאה",
      quantity: 25,
      partner: "קבלן דוד כהן",
      notes: "פרויקט רמת אביב",
    },
    {
      id: 3,
      date: new Date(2025, 0, 13),
      productName: "צירים מתכווננים",
      type: "כניסה",
      quantity: 50,
      partner: "ספק משני בע״מ",
      notes: "",
    },
    {
      id: 4,
      date: new Date(2025, 0, 12),
      productName: "מנעול חכם",
      type: "יציאה",
      quantity: 15,
      partner: "קבלן משה לוי",
      notes: "דחוף",
    },
  ]);

  const handleExportToExcel = () => {
    // Basic export functionality - can be enhanced with xlsx library
    console.log("Exporting to Excel...");
  };

  const filteredMovements = movements.filter((movement) => {
    const matchesSearch =
      movement.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      movement.partner.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = movementType === "הכל" || movement.type === movementType;

    const matchesDateFrom = !dateFrom || movement.date >= dateFrom;
    const matchesDateTo = !dateTo || movement.date <= dateTo;

    return matchesSearch && matchesType && matchesDateFrom && matchesDateTo;
  });

  const getMovementBadge = (type: StockMovement["type"]) => {
    return type === "כניסה"
      ? "bg-success/10 text-success border-success/20"
      : "bg-destructive/10 text-destructive border-destructive/20";
  };

  const getMovementIcon = (type: StockMovement["type"]) => {
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
          <h1 className="text-lg lg:text-2xl font-bold">היסטוריית תנועות מלאי</h1>
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
                      {filteredMovements.length === 0 ? (
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
                              {format(movement.date, "dd/MM/yyyy")}
                            </TableCell>
                            <TableCell className="font-medium">
                              {movement.productName}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "gap-1",
                                  getMovementBadge(movement.type)
                                )}
                              >
                                {getMovementIcon(movement.type)}
                                {movement.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-semibold">
                              {movement.quantity}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {movement.partner}
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
                  {filteredMovements.length === 0 ? (
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
                              {movement.productName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {format(movement.date, "dd/MM/yyyy")}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className={cn("gap-1", getMovementBadge(movement.type))}
                          >
                            {getMovementIcon(movement.type)}
                            {movement.type}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">כמות:</span>
                            <span className="font-semibold">{movement.quantity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              {movement.type === "כניסה" ? "ספק:" : "לקוח:"}
                            </span>
                            <span className="font-medium">{movement.partner}</span>
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
