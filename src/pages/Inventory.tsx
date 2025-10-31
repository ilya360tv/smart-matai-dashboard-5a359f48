import { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, Upload, Clock, Download } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AddProductModal } from "@/components/AddProductModal";
import { InventoryAssistant } from "@/components/InventoryAssistant";
import { toast } from "@/hooks/use-toast";
import * as XLSX from "xlsx";

interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  customerPrice: number;
  supplier: string;
  side: "ימין" | "שמאל" | "הזזה" | "לא רלוונטי";
  status: "זמין" | "אזל מהמלאי" | "מלאי נמוך";
}

const Inventory = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [replaceExisting, setReplaceExisting] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log("📁 File selected:", file?.name);
    
    if (!file) {
      console.log("❌ No file selected");
      return;
    }

    try {
      console.log("📖 Reading file...");
      const arrayBuffer = await file.arrayBuffer();
      console.log("✅ File read successfully, parsing...");
      
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        console.error("❌ No sheets found in workbook");
        toast({
          title: "שגיאה בקריאת הקובץ",
          description: "לא נמצא גיליון בקובץ",
          variant: "destructive",
        });
        event.target.value = "";
        return;
      }

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json<any>(worksheet, { defval: "" });
      console.log("📊 Parsed raw data:", jsonData);

      // Helper function to normalize row keys (trim + lowercase)
      const normalizeRow = (row: any) => {
        const normalized: any = {};
        Object.keys(row).forEach(key => {
          normalized[key.trim().toLowerCase()] = row[key];
        });
        return normalized;
      };

      // Helper function to get value from multiple possible keys
      const get = (row: any, keys: string[]): any => {
        for (const key of keys) {
          if (row[key] !== undefined && row[key] !== null && row[key] !== "") {
            return row[key];
          }
        }
        return "";
      };

      // Convert Excel data to Product format with flexible column matching
      const newProducts: Product[] = jsonData
        .map((rawRow, index) => {
          const row = normalizeRow(rawRow);
          
          const name = get(row, ["שם מוצר", "שם", "name", "product"]);
          
          // Skip rows without a product name
          if (!name || name.toString().trim() === "") {
            return null;
          }

          const quantity = Number(get(row, ["כמות", "quantity", "qty"]) || 0);
          const basePrice = Number(get(row, ["מחיר", "price", "מחיר בסיסי"]) || 0);
          const customerPriceFromExcel = Number(get(row, ["מחיר ללקוח", "מחיר לקוח", "customerprice", "customer price"]) || 0);
          
          const maxId = replaceExisting ? 0 : (products.length > 0 ? Math.max(...products.map(p => p.id)) : 0);
          
          return {
            id: maxId + index + 1,
            name: name.toString().trim(),
            category: get(row, ["קטגוריה", "category", "cat"]).toString().trim() || "",
            quantity,
            price: basePrice,
            customerPrice: customerPriceFromExcel > 0 ? customerPriceFromExcel : basePrice * 1.1,
            supplier: get(row, ["ספק", "supplier"]).toString().trim() || "",
            side: (get(row, ["צד", "side"]) || "לא רלוונטי") as Product["side"],
            status: (quantity === 0 ? "אזל מהמלאי" : 
                     quantity < 10 ? "מלאי נמוך" : "זמין") as Product["status"],
          };
        })
        .filter((p): p is Product => p !== null);

      console.log("✨ New products created:", newProducts);

      if (newProducts.length === 0) {
        console.warn("⚠️ No valid products found");
        toast({
          title: "לא נמצאו מוצרים",
          description: "אנא ודא ששורת הכותרות כוללת את העמודה 'שם מוצר' או 'name'",
          variant: "destructive",
        });
        event.target.value = "";
        return;
      }

      // Replace or append based on switch
      if (replaceExisting) {
        setProducts(newProducts);
        console.log("🔄 Replaced existing products");
      } else {
        setProducts([...products, ...newProducts]);
        console.log("➕ Appended to existing products");
      }
      
      setIsFileUploaded(true);

      toast({
        title: "הקובץ נטען בהצלחה!",
        description: `${newProducts.length} מוצרים נטענו מהקובץ${replaceExisting ? "" : " והתווספו למלאי הקיים"}`,
      });

      // Reset input value to allow uploading the same file again
      event.target.value = "";
      
    } catch (error) {
      console.error("❌ Error parsing file:", error);
      toast({
        title: "שגיאה בטעינת הקובץ",
        description: "אנא ודא שהקובץ בפורמט Excel תקין",
        variant: "destructive",
      });
      event.target.value = "";
    }
  };

  const handleDownloadTemplate = () => {
    const template = [
      {
        "שם מוצר": "דוגמה למוצר",
        "קטגוריה": "אביזרים",
        "צד": "ימין",
        "כמות": 50,
        "מחיר": 100,
        "מחיר ללקוח": 120,
        "ספק": "ספק לדוגמה"
      }
    ];
    
    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "מלאי");
    XLSX.writeFile(workbook, "תבנית_מלאי.xlsx");
    
    toast({
      title: "התבנית הורדה בהצלחה",
      description: "מלא את הקובץ והעלה אותו חזרה",
    });
  };

  const handleAddProduct = (newProduct: Omit<Product, "id" | "status">) => {
    const status: Product["status"] = 
      newProduct.quantity === 0 ? "אזל מהמלאי" : 
      newProduct.quantity < 10 ? "מלאי נמוך" : "זמין";
    
    const product: Product = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      ...newProduct,
      status,
    };
    setProducts([product, ...products]);
  };

  const handleDeleteProduct = (id: number) => {
    console.log("Deleting product with id:", id);
    console.log("Current products:", products);
    const updatedProducts = products.filter(p => p.id !== id);
    console.log("Updated products after delete:", updatedProducts);
    setProducts(updatedProducts);
    toast({
      title: "המוצר נמחק בהצלחה",
      description: "המוצר הוסר מהמלאי",
    });
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusVariant = (status: Product["status"]) => {
    switch (status) {
      case "זמין":
        return "bg-success/10 text-success border-success/20";
      case "מלאי נמוך":
        return "bg-warning/10 text-warning border-warning/20";
      case "אזל מהמלאי":
        return "bg-destructive/10 text-destructive border-destructive/20";
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-2 border-b bg-card px-3 lg:h-[60px] lg:px-6 sticky top-0 z-10 shadow-sm">
          <h1 className="text-lg lg:text-2xl font-bold flex-1">ניהול מלאי</h1>
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
            {/* Smart Assistant */}
            <InventoryAssistant products={products} />

            {/* Excel Upload Section */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg lg:text-2xl">
                  <Upload className="h-5 w-5 text-primary" />
                  ייבוא מלאי מאקסל
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  העלה קובץ Excel עם רשימת המוצרים שלך
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Switch
                    id="replace-mode"
                    checked={replaceExisting}
                    onCheckedChange={setReplaceExisting}
                  />
                  <Label htmlFor="replace-mode" className="cursor-pointer text-sm font-medium">
                    להחליף מלאי קיים (אם לא מסומן, המוצרים יתווספו למלאי הקיים)
                  </Label>
                </div>
                
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
                    variant="outline"
                    className="gap-2 w-full sm:w-auto"
                  >
                    <Upload className="h-4 w-4" />
                    בחר קובץ Excel
                  </Button>
                  <Button
                    onClick={handleDownloadTemplate}
                    size="lg"
                    variant="secondary"
                    className="gap-2 w-full sm:w-auto"
                  >
                    <Download className="h-4 w-4" />
                    הורד תבנית אקסל
                  </Button>
                  {isFileUploaded && (
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-center py-2">
                      הקובץ נטען בהצלחה!
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Toolbar */}
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="חיפוש מוצר..."
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
                    הוסף מוצר חדש
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Products Table */}
            <Card className="shadow-sm">
              <CardContent className="p-0">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="text-right font-bold">שם מוצר</TableHead>
                        <TableHead className="text-right font-bold">קטגוריה</TableHead>
                        <TableHead className="text-right font-bold">צד</TableHead>
                        <TableHead className="text-right font-bold">כמות במלאי</TableHead>
                        <TableHead className="text-right font-bold">מחיר בסיסי</TableHead>
                        <TableHead className="text-right font-bold">מחיר ללקוח</TableHead>
                        <TableHead className="text-right font-bold">ספק</TableHead>
                        <TableHead className="text-right font-bold">סטטוס</TableHead>
                        <TableHead className="text-right font-bold">פעולות</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                            לא נמצאו מוצרים
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredProducts.map((product) => (
                          <TableRow 
                            key={product.id}
                            className="hover:bg-muted/30 transition-colors"
                          >
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell className="text-muted-foreground">{product.category}</TableCell>
                            <TableCell>
                              <Badge variant="secondary" className="font-medium">
                                {product.side}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-semibold">{product.quantity}</TableCell>
                            <TableCell className="font-medium text-muted-foreground">₪{product.price.toFixed(2)}</TableCell>
                            <TableCell className="font-bold text-primary">₪{product.customerPrice.toFixed(2)}</TableCell>
                            <TableCell className="text-muted-foreground">{product.supplier}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusVariant(product.status)}>
                                {product.status}
                              </Badge>
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
                                  onClick={() => handleDeleteProduct(product.id)}
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
                <div className="md:hidden p-3 space-y-3">
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      לא נמצאו מוצרים
                    </div>
                  ) : (
                    filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="p-4 rounded-lg border bg-card shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-base mb-1">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                          </div>
                          <Badge variant="outline" className={getStatusVariant(product.status)}>
                            {product.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm mb-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">צד:</span>
                            <Badge variant="secondary" className="font-medium">
                              {product.side}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">כמות:</span>
                            <span className="font-semibold">{product.quantity}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">מחיר בסיסי:</span>
                            <span className="font-medium text-muted-foreground">₪{product.price.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="text-muted-foreground font-medium">מחיר ללקוח:</span>
                            <span className="font-bold text-primary text-base">₪{product.customerPrice.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">ספק:</span>
                            <span className="font-medium">{product.supplier}</span>
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
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            מחק
                          </Button>
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

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProduct}
      />
    </div>
  );
};

export default Inventory;
