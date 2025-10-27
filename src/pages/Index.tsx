import { useState } from "react";
import { Package, Building2, Users, AlertTriangle, TrendingDown, TrendingUp, Upload } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

interface ExcelProduct {
  "שם מוצר": string;
  "מק״ט": string;
  "כמות במלאי": number;
  "ספק": string;
}

const Index = () => {
  const [uploadedData, setUploadedData] = useState<ExcelProduct[]>([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const lowStockItems = [
    { id: 1, name: "מוצר A", currentStock: 5, minStock: 20 },
    { id: 2, name: "מוצר B", currentStock: 3, minStock: 15 },
    { id: 3, name: "מוצר C", currentStock: 8, minStock: 25 },
  ];

  const recentMovements = [
    { id: 1, date: "2025-01-15", product: "מוצר X", type: "כניסה", quantity: 50 },
    { id: 2, date: "2025-01-15", product: "מוצר Y", type: "יציאה", quantity: 30 },
    { id: 3, date: "2025-01-14", product: "מוצר Z", type: "כניסה", quantity: 100 },
    { id: 4, date: "2025-01-14", product: "מוצר A", type: "יציאה", quantity: 15 },
    { id: 5, date: "2025-01-13", product: "מוצר B", type: "כניסה", quantity: 25 },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<ExcelProduct>(worksheet);
        
        // Sort alphabetically by product name
        const sortedData = jsonData.sort((a, b) => 
          a["שם מוצר"].localeCompare(b["שם מוצר"], "he")
        );
        
        setUploadedData(sortedData);
        setIsFileUploaded(true);
        
        toast({
          title: "הקובץ נטען בהצלחה!",
          description: `${sortedData.length} מוצרים נטענו מהקובץ`,
        });
      } catch (error) {
        toast({
          title: "שגיאה בטעינת הקובץ",
          description: "אנא ודא שהקובץ בפורמט Excel תקין",
          variant: "destructive",
        });
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="flex h-screen w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <h1 className="text-xl font-bold">מערכת ניהול מלאי חכמה</h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Excel Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  ייבוא מלאי מאקסל
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  העלה קובץ Excel עם רשימת המוצרים שלך, והמערכת תעדכן את המלאי בהתאם.
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Input
                    id="excel-upload"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => document.getElementById("excel-upload")?.click()}
                    size="lg"
                    className="gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    בחר קובץ
                  </Button>
                  {isFileUploaded && (
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      הקובץ נטען בהצלחה!
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="סה״כ פריטים במלאי"
                value="1,234"
                icon={Package}
                iconColor="text-primary"
              />
              <MetricCard
                title="ספקים פעילים"
                value="45"
                icon={Building2}
                iconColor="text-accent-foreground"
              />
              <MetricCard
                title="לקוחות פעילים"
                value="89"
                icon={Users}
                iconColor="text-success"
              />
              <MetricCard
                title="התראות פתוחות"
                value="3"
                icon={AlertTriangle}
                iconColor="text-warning"
              />
            </div>

            {/* Low Stock Alerts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  התראות מלאי נמוך
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lowStockItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent"
                    >
                      <div className="flex items-center gap-3">
                        <TrendingDown className="h-5 w-5 text-warning" />
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            מלאי נוכחי: {item.currentStock} | מינימום נדרש: {item.minStock}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                        דורש תשומת לב
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Uploaded Excel Data Table */}
            {uploadedData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>מוצרים שנטענו מהקובץ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-right">שם מוצר</TableHead>
                          <TableHead className="text-right">מק״ט</TableHead>
                          <TableHead className="text-right">כמות במלאי</TableHead>
                          <TableHead className="text-right">ספק</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {uploadedData.map((product, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{product["שם מוצר"]}</TableCell>
                            <TableCell>{product["מק״ט"]}</TableCell>
                            <TableCell className="font-semibold">{product["כמות במלאי"]}</TableCell>
                            <TableCell>{product["ספק"]}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recent Movements Table */}
            <Card>
              <CardHeader>
                <CardTitle>תנועות אחרונות במלאי</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">תאריך</TableHead>
                        <TableHead className="text-right">שם המוצר</TableHead>
                        <TableHead className="text-right">סוג תנועה</TableHead>
                        <TableHead className="text-right">כמות</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentMovements.map((movement) => (
                        <TableRow key={movement.id}>
                          <TableCell className="font-medium">{movement.date}</TableCell>
                          <TableCell>{movement.product}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                movement.type === "כניסה"
                                  ? "bg-success/10 text-success border-success/20"
                                  : "bg-primary/10 text-primary border-primary/20"
                              }
                            >
                              <span className="flex items-center gap-1">
                                {movement.type === "כניסה" ? (
                                  <TrendingUp className="h-3 w-3" />
                                ) : (
                                  <TrendingDown className="h-3 w-3" />
                                )}
                                {movement.type}
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold">{movement.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
