import { useState } from "react";
import { Package, Building2, Users, AlertTriangle, TrendingDown, Upload } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  "כמות מינימלית"?: number;
}

const Index = () => {
  const [uploadedData, setUploadedData] = useState<ExcelProduct[]>([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [manualProduct, setManualProduct] = useState({
    "שם מוצר": "",
    "מק״ט": "",
    "כמות במלאי": 0,
    "כמות מינימלית": 0,
    "ספק": "",
  });
  const lowStockItems = [
    { id: 1, name: "מוצר A", currentStock: 5, minStock: 20 },
    { id: 2, name: "מוצר B", currentStock: 3, minStock: 15 },
    { id: 3, name: "מוצר C", currentStock: 8, minStock: 25 },
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

  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manualProduct["שם מוצר"] || !manualProduct["מק״ט"] || !manualProduct["ספק"]) {
      toast({
        title: "שגיאה",
        description: "אנא מלא את כל השדות הנדרשים",
        variant: "destructive",
      });
      return;
    }

    const newData = [...uploadedData, manualProduct].sort((a, b) => 
      a["שם מוצר"].localeCompare(b["שם מוצר"], "he")
    );
    
    setUploadedData(newData);
    
    toast({
      title: "המוצר נוסף בהצלחה למלאי!",
    });

    // Reset form
    setManualProduct({
      "שם מוצר": "",
      "מק״ט": "",
      "כמות במלאי": 0,
      "כמות מינימלית": 0,
      "ספק": "",
    });
  };

  return (
    <div className="flex min-h-screen w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="flex h-14 items-center gap-2 border-b bg-card px-3 lg:h-[60px] lg:px-6 sticky top-0 z-10">
          <h1 className="text-base lg:text-xl font-bold truncate">מערכת ניהול מלאי חכמה</h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-3 lg:p-6">
          <div className="mx-auto max-w-7xl space-y-4 lg:space-y-6">
            {/* Excel Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg lg:text-2xl">
                  <Upload className="h-5 w-5 text-primary" />
                  ייבוא מלאי מאקסל
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  העלה קובץ Excel עם רשימת המוצרים שלך
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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
                    className="gap-2 w-full sm:w-auto"
                  >
                    <Upload className="h-4 w-4" />
                    בחר קובץ
                  </Button>
                  {isFileUploaded && (
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-center py-2">
                      הקובץ נטען בהצלחה!
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Manual Product Entry */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg lg:text-2xl">הוספת מוצר ידנית</CardTitle>
                <p className="text-sm text-muted-foreground">
                  הוסף מוצר חדש למלאי באופן ידני
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleManualAdd} className="space-y-3 lg:space-y-4">
                  <div className="grid gap-3 lg:gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="product-name" className="text-sm font-medium">
                        שם מוצר
                      </label>
                      <Input
                        id="product-name"
                        value={manualProduct["שם מוצר"]}
                        onChange={(e) =>
                          setManualProduct({ ...manualProduct, "שם מוצר": e.target.value })
                        }
                        placeholder="הכנס שם מוצר"
                        className="h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="sku" className="text-sm font-medium">
                        מק״ט
                      </label>
                      <Input
                        id="sku"
                        value={manualProduct["מק״ט"]}
                        onChange={(e) =>
                          setManualProduct({ ...manualProduct, "מק״ט": e.target.value })
                        }
                        placeholder="הכנס מק״ט"
                        className="h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="quantity" className="text-sm font-medium">
                        כמות במלאי
                      </label>
                      <Input
                        id="quantity"
                        type="number"
                        min="0"
                        value={manualProduct["כמות במלאי"]}
                        onChange={(e) =>
                          setManualProduct({ ...manualProduct, "כמות במלאי": parseInt(e.target.value) || 0 })
                        }
                        placeholder="0"
                        className="h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="min-stock" className="text-sm font-medium">
                        כמות מינימלית
                      </label>
                      <Input
                        id="min-stock"
                        type="number"
                        min="0"
                        value={manualProduct["כמות מינימלית"]}
                        onChange={(e) =>
                          setManualProduct({ ...manualProduct, "כמות מינימלית": parseInt(e.target.value) || 0 })
                        }
                        placeholder="0"
                        className="h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="supplier" className="text-sm font-medium">
                        שם ספק
                      </label>
                      <Input
                        id="supplier"
                        value={manualProduct["ספק"]}
                        onChange={(e) =>
                          setManualProduct({ ...manualProduct, "ספק": e.target.value })
                        }
                        placeholder="הכנס שם ספק"
                        className="h-11"
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" size="lg" className="w-full">
                    הוסף למלאי
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Metrics Grid */}
            <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
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
                <CardTitle className="flex items-center gap-2 text-lg lg:text-2xl">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  התראות מלאי נמוך
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 lg:space-y-3">
                  {lowStockItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-lg border p-3 lg:p-4 transition-colors hover:bg-accent"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <TrendingDown className="h-5 w-5 text-warning flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-sm lg:text-base">{item.name}</p>
                          <p className="text-xs lg:text-sm text-muted-foreground">
                            נוכחי: {item.currentStock} | מינימום: {item.minStock}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-xs whitespace-nowrap">
                        דורש תשומת לב
                      </Badge>
                    </div>
                  ))}
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
