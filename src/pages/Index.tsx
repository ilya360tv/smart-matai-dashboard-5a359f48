import { useState } from "react";
import { Package, Building2, Users, AlertTriangle, TrendingDown, Upload, Plus, Calendar, User } from "lucide-react";
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
  const recentUpdates = [
    { id: 1, productName: "מוצר A", quantity: 150, supplier: "ספק 1", status: "פעיל", date: "2024-03-15", user: "אדמין" },
    { id: 2, productName: "מוצר B", quantity: 75, supplier: "ספק 2", status: "פעיל", date: "2024-03-14", user: "מנהל" },
    { id: 3, productName: "מוצר C", quantity: 200, supplier: "ספק 3", status: "פעיל", date: "2024-03-14", user: "אדמין" },
    { id: 4, productName: "מוצר D", quantity: 50, supplier: "ספק 1", status: "ממתין", date: "2024-03-13", user: "מנהל" },
    { id: 5, productName: "מוצר E", quantity: 120, supplier: "ספק 4", status: "פעיל", date: "2024-03-13", user: "אדמין" },
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
            {/* Welcome Section */}
            <div className="animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl lg:text-4xl font-bold bg-gradient-to-l from-primary to-accent-foreground bg-clip-text text-transparent mb-2">
                    ברוך הבא למערכת ניהול המלאי!
                  </h2>
                  <p className="text-sm lg:text-base text-muted-foreground">
                    ניהול חכם ויעיל של המלאי העסקי שלך
                  </p>
                </div>
                <Button size="lg" className="gap-2 shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">
                  <Plus className="h-5 w-5" />
                  הוסף מוצר חדש
                </Button>
              </div>
            </div>
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

            {/* Recent Updates Table */}
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg lg:text-2xl">
                  <Calendar className="h-5 w-5 text-primary" />
                  עדכוני מלאי אחרונים
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  פעולות והוספות אחרונות במערכת
                </p>
              </CardHeader>
              <CardContent>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="text-right p-3 font-semibold text-sm">שם מוצר</th>
                        <th className="text-right p-3 font-semibold text-sm">כמות</th>
                        <th className="text-right p-3 font-semibold text-sm">ספק</th>
                        <th className="text-right p-3 font-semibold text-sm">סטטוס</th>
                        <th className="text-right p-3 font-semibold text-sm">תאריך</th>
                        <th className="text-right p-3 font-semibold text-sm">משתמש</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUpdates.map((update) => (
                        <tr key={update.id} className="border-b hover:bg-accent/50 transition-colors">
                          <td className="p-3 font-medium">{update.productName}</td>
                          <td className="p-3">{update.quantity}</td>
                          <td className="p-3 text-muted-foreground">{update.supplier}</td>
                          <td className="p-3">
                            <Badge 
                              variant="outline" 
                              className={
                                update.status === "פעיל" 
                                  ? "bg-success/10 text-success border-success/20" 
                                  : "bg-warning/10 text-warning border-warning/20"
                              }
                            >
                              {update.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-sm text-muted-foreground">{update.date}</td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{update.user}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {recentUpdates.map((update) => (
                    <div key={update.id} className="border rounded-lg p-4 space-y-2 hover:bg-accent/50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-base">{update.productName}</h4>
                          <p className="text-sm text-muted-foreground">{update.supplier}</p>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={
                            update.status === "פעיל" 
                              ? "bg-success/10 text-success border-success/20" 
                              : "bg-warning/10 text-warning border-warning/20"
                          }
                        >
                          {update.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">כמות: {update.quantity}</span>
                        <span className="text-muted-foreground">{update.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{update.user}</span>
                      </div>
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
