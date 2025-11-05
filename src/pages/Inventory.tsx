import { useState, useEffect } from "react";
import { Search, Plus, Pencil, Trash2, Upload, Clock, Download, ArrowUpDown, Filter } from "lucide-react";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { AddPullHandleModal } from "@/components/AddPullHandleModal";
import { AddLockingProductModal } from "@/components/AddLockingProductModal";
import { AddHardwareModal } from "@/components/AddHardwareModal";
import { AddDoorModal } from "@/components/AddDoorModal";
import { EditProductModal } from "@/components/EditProductModal";
import { EditInventoryItemModal } from "@/components/EditInventoryItemModal";
import { InventoryAssistant } from "@/components/InventoryAssistant";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { toast as sonnerToast } from "sonner";
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

interface PullHandle {
  id: string;
  handle_type: string;
  color: string;
  quantity: number;
  supplier_price?: number;
  reseller_price?: number;
}

interface LockingProduct {
  id: string;
  item_type: string;
  quantity: number;
  supplier_price?: number;
  reseller_price?: number;
}

interface Hardware {
  id: string;
  hardware_type: string;
  color: string;
  quantity: number;
  supplier_price?: number;
  reseller_price?: number;
}

interface DoorInventory {
  id: string;
  size: string;
  direction: string;
  type_9016t: number;
  type_9001t: number;
  type_7126d: number;
  type_0096d: number;
  type_mr09: number;
  total: number;
  table_name: string;
  supplier_price?: number;
  reseller_price?: number;
  hardware_addition?: number;
}

type ProductCategory = "all" | "pull-handles" | "locking-products" | "hardware" | "doors";

const Inventory = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [replaceExisting, setReplaceExisting] = useState(true);
  const [sortField, setSortField] = useState<keyof Product | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // Edit modals
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Pull Handles state
  const [pullHandles, setPullHandles] = useState<PullHandle[]>([]);
  const [isAddPullHandleModalOpen, setIsAddPullHandleModalOpen] = useState(false);
  const [isEditPullHandleModalOpen, setIsEditPullHandleModalOpen] = useState(false);
  const [editingPullHandle, setEditingPullHandle] = useState<PullHandle | null>(null);
  
  // Locking Products state
  const [lockingProducts, setLockingProducts] = useState<LockingProduct[]>([]);
  const [isAddLockingProductModalOpen, setIsAddLockingProductModalOpen] = useState(false);
  const [isEditLockingProductModalOpen, setIsEditLockingProductModalOpen] = useState(false);
  const [editingLockingProduct, setEditingLockingProduct] = useState<LockingProduct | null>(null);
  
  // Hardware state
  const [hardware, setHardware] = useState<Hardware[]>([]);
  const [isAddHardwareModalOpen, setIsAddHardwareModalOpen] = useState(false);
  const [isEditHardwareModalOpen, setIsEditHardwareModalOpen] = useState(false);
  const [editingHardware, setEditingHardware] = useState<Hardware | null>(null);

  // Doors state
  const [doors, setDoors] = useState<DoorInventory[]>([]);
  const [isAddDoorModalOpen, setIsAddDoorModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchPullHandles();
    fetchLockingProducts();
    fetchHardware();
    fetchDoors();
  }, []);

  const fetchPullHandles = async () => {
    const { data, error } = await supabase
      .from("pull_handles_inventory")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      sonnerToast.error("שגיאה בטעינת המלאי");
      console.error("Error fetching pull handles:", error);
      return;
    }

    setPullHandles(data || []);
  };

  const fetchLockingProducts = async () => {
    const { data, error } = await supabase
      .from("locking_products_inventory")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      sonnerToast.error("שגיאה בטעינת המלאי");
      console.error("Error fetching locking products:", error);
      return;
    }

    setLockingProducts(data || []);
  };

  const fetchHardware = async () => {
    const { data, error } = await supabase
      .from("hardware_inventory")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      sonnerToast.error("שגיאה בטעינת המלאי");
      console.error("Error fetching hardware:", error);
      return;
    }

    setHardware(data || []);
  };

  const fetchDoors = async () => {
    const tables = ['doors_d100', 'doors_d82', 'doors_d80', 'doors_d88', 'doors_d_rhk', 'doors_d6', 'doors_d7'];
    const allDoors: DoorInventory[] = [];

    for (const tableName of tables) {
      const { data, error } = await supabase
        .from(tableName as any)
        .select("*")
        .order("size", { ascending: true });

      if (error) {
        console.error(`Error fetching from ${tableName}:`, error);
        continue;
      }

      const doorsWithTable = (data || []).map((door: any) => ({
        ...door,
        table_name: tableName
      }));
      allDoors.push(...doorsWithTable);
    }

    setDoors(allDoors);
  };

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

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditProductModalOpen(true);
  };

  const handleSaveProduct = (updatedProduct: Product) => {
    const updatedProducts = products.map(p => 
      p.id === updatedProduct.id ? {
        ...updatedProduct,
        status: updatedProduct.quantity === 0 ? "אזל מהמלאי" : 
                updatedProduct.quantity < 10 ? "מלאי נמוך" : "זמין" as Product["status"]
      } : p
    );
    setProducts(updatedProducts);
    sonnerToast.success("המוצר עודכן בהצלחה");
  };

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Pull Handles handlers
  const handleAddPullHandle = async (item: Omit<PullHandle, "id">) => {
    const { error } = await supabase
      .from("pull_handles_inventory")
      .insert([item]);

    if (error) {
      sonnerToast.error("שגיאה בהוספת פריט");
      console.error("Error adding pull handle:", error);
      return;
    }

    sonnerToast.success("הפריט נוסף בהצלחה");
    fetchPullHandles();
    setIsAddPullHandleModalOpen(false);
  };

  const handleDeletePullHandle = async (id: string) => {
    const { error } = await supabase
      .from("pull_handles_inventory")
      .delete()
      .eq("id", id);

    if (error) {
      sonnerToast.error("שגיאה במחיקת הפריט");
      console.error("Error deleting pull handle:", error);
      return;
    }

    sonnerToast.success("הפריט נמחק בהצלחה");
    fetchPullHandles();
  };

  // Locking Products handlers
  const handleAddLockingProduct = async (item: Omit<LockingProduct, "id">) => {
    const { error } = await supabase
      .from("locking_products_inventory")
      .insert([item]);

    if (error) {
      sonnerToast.error("שגיאה בהוספת פריט");
      console.error("Error adding locking product:", error);
      return;
    }

    sonnerToast.success("הפריט נוסף בהצלחה");
    fetchLockingProducts();
    setIsAddLockingProductModalOpen(false);
  };

  const handleDeleteLockingProduct = async (id: string) => {
    const { error } = await supabase
      .from("locking_products_inventory")
      .delete()
      .eq("id", id);

    if (error) {
      sonnerToast.error("שגיאה במחיקת הפריט");
      console.error("Error deleting locking product:", error);
      return;
    }

    sonnerToast.success("הפריט נמחק בהצלחה");
    fetchLockingProducts();
  };

  // Hardware handlers
  const handleAddHardware = async (item: Omit<Hardware, "id">) => {
    const { error } = await supabase
      .from("hardware_inventory")
      .insert([item]);

    if (error) {
      sonnerToast.error("שגיאה בהוספת פריט");
      console.error("Error adding hardware:", error);
      return;
    }

    sonnerToast.success("הפריט נוסף בהצלחה");
    fetchHardware();
    setIsAddHardwareModalOpen(false);
  };

  const handleDeleteHardware = async (id: string) => {
    const { error } = await supabase
      .from("hardware_inventory")
      .delete()
      .eq("id", id);

    if (error) {
      sonnerToast.error("שגיאה במחיקת הפריט");
      console.error("Error deleting hardware:", error);
      return;
    }

    sonnerToast.success("הפריט נמחק בהצלחה");
    fetchHardware();
  };

  const handleEditPullHandle = (item: PullHandle) => {
    setEditingPullHandle(item);
    setIsEditPullHandleModalOpen(true);
  };

  const handleSavePullHandle = async (id: string, quantity: number) => {
    const { error } = await supabase
      .from("pull_handles_inventory")
      .update({ quantity })
      .eq("id", id);

    if (error) {
      sonnerToast.error("שגיאה בעדכון הפריט");
      console.error("Error updating pull handle:", error);
      return;
    }

    sonnerToast.success("הפריט עודכן בהצלחה");
    fetchPullHandles();
  };

  const handleEditLockingProduct = (item: LockingProduct) => {
    setEditingLockingProduct(item);
    setIsEditLockingProductModalOpen(true);
  };

  const handleSaveLockingProduct = async (id: string, quantity: number) => {
    const { error } = await supabase
      .from("locking_products_inventory")
      .update({ quantity })
      .eq("id", id);

    if (error) {
      sonnerToast.error("שגיאה בעדכון הפריט");
      console.error("Error updating locking product:", error);
      return;
    }

    sonnerToast.success("הפריט עודכן בהצלחה");
    fetchLockingProducts();
  };

  const handleEditHardware = (item: Hardware) => {
    setEditingHardware(item);
    setIsEditHardwareModalOpen(true);
  };

  const handleSaveHardware = async (id: string, quantity: number) => {
    const { error } = await supabase
      .from("hardware_inventory")
      .update({ quantity })
      .eq("id", id);

    if (error) {
      sonnerToast.error("שגיאה בעדכון הפריט");
      console.error("Error updating hardware:", error);
      return;
    }

    sonnerToast.success("הפריט עודכן בהצלחה");
    fetchHardware();
  };

  // Doors handlers
  const handleAddDoor = async (item: Omit<DoorInventory, "id" | "total">) => {
    const { table_name, ...doorData } = item;
    const total = doorData.type_9016t + doorData.type_9001t + doorData.type_7126d + 
                  doorData.type_0096d + doorData.type_mr09;
    
    const { error } = await supabase
      .from(table_name as any)
      .insert([{ ...doorData, total }]);

    if (error) {
      sonnerToast.error("שגיאה בהוספת דלת");
      console.error("Error adding door:", error);
      return;
    }

    sonnerToast.success("הדלת נוספה בהצלחה");
    fetchDoors();
    setIsAddDoorModalOpen(false);
  };

  const handleDeleteDoor = async (id: string, tableName: string) => {
    const { error } = await supabase
      .from(tableName as any)
      .delete()
      .eq("id", id);

    if (error) {
      sonnerToast.error("שגיאה במחיקת הדלת");
      console.error("Error deleting door:", error);
      return;
    }

    sonnerToast.success("הדלת נמחקה בהצלחה");
    fetchDoors();
  };

  // Filter and combine all inventory items
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.supplier.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPullHandles = pullHandles.filter(item =>
    item.handle_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.color.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLockingProducts = lockingProducts.filter(item =>
    item.item_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredHardware = hardware.filter(item =>
    item.hardware_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.color.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDoors = doors.filter(item =>
    item.size.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.direction.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Apply category filter
  const getFilteredItems = () => {
    switch (categoryFilter) {
      case "pull-handles":
        return filteredPullHandles;
      case "locking-products":
        return filteredLockingProducts;
      case "hardware":
        return filteredHardware;
      case "doors":
        return filteredDoors;
      case "all":
      default:
        return [
          ...filteredPullHandles,
          ...filteredLockingProducts,
          ...filteredHardware,
          ...filteredDoors
        ];
    }
  };

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a[sortField];
    const bValue = b[sortField];
    const modifier = sortDirection === "asc" ? 1 : -1;
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return aValue.localeCompare(bValue, "he") * modifier;
    }
    if (typeof aValue === "number" && typeof bValue === "number") {
      return (aValue - bValue) * modifier;
    }
    return 0;
  });

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
            {/* Unified Products Table */}
            <Card className="shadow-sm">
              <CardContent className="p-4 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="חיפוש..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10 h-11"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as ProductCategory)}>
                      <SelectTrigger className="w-[200px] h-11 bg-background">
                        <Filter className="ml-2 h-4 w-4" />
                        <SelectValue placeholder="סנן לפי סוג" />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        <SelectItem value="all">כל המוצרים</SelectItem>
                        <SelectItem value="pull-handles">ידיות משיכה</SelectItem>
                        <SelectItem value="locking-products">מוצרי נעילה</SelectItem>
                        <SelectItem value="hardware">פירזולים</SelectItem>
                        <SelectItem value="doors">דלתות</SelectItem>
                      </SelectContent>
                    </Select>
                    {categoryFilter === "all" ? (
                      <Select onValueChange={(value) => {
                        if (value === "pull-handles") setIsAddPullHandleModalOpen(true);
                        else if (value === "locking-products") setIsAddLockingProductModalOpen(true);
                        else if (value === "hardware") setIsAddHardwareModalOpen(true);
                        else if (value === "doors") setIsAddDoorModalOpen(true);
                      }}>
                        <SelectTrigger className="w-[150px] h-11 bg-primary text-primary-foreground">
                          <Plus className="ml-2 h-5 w-5" />
                          <SelectValue placeholder="הוסף פריט" />
                        </SelectTrigger>
                        <SelectContent className="bg-background z-50">
                          <SelectItem value="pull-handles">ידית משיכה</SelectItem>
                          <SelectItem value="locking-products">מוצר נעילה</SelectItem>
                          <SelectItem value="hardware">פירזול</SelectItem>
                          <SelectItem value="doors">דלת</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Button 
                        onClick={() => {
                          if (categoryFilter === "pull-handles") setIsAddPullHandleModalOpen(true);
                          else if (categoryFilter === "locking-products") setIsAddLockingProductModalOpen(true);
                          else if (categoryFilter === "hardware") setIsAddHardwareModalOpen(true);
                          else if (categoryFilter === "doors") setIsAddDoorModalOpen(true);
                        }}
                        className="gap-2 h-11 sm:w-auto w-full"
                        size="lg"
                      >
                        <Plus className="h-5 w-5" />
                        הוסף פריט
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pull Handles Table */}
            {(categoryFilter === "all" || categoryFilter === "pull-handles") && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>ידיות משיכה</CardTitle>
                </CardHeader>
                  <CardContent className="p-0">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right">סוג ידית</TableHead>
                            <TableHead className="text-right">צבע</TableHead>
                            <TableHead className="text-right">כמות</TableHead>
                            <TableHead className="text-right">מחיר ספק</TableHead>
                            <TableHead className="text-right">מחיר מפיץ</TableHead>
                            <TableHead className="text-right">פעולות</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPullHandles.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                לא נמצאו פריטים
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredPullHandles.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.handle_type}</TableCell>
                                <TableCell>{item.color}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.supplier_price ? `₪${item.supplier_price.toFixed(2)}` : '-'}</TableCell>
                                <TableCell>{item.reseller_price ? `₪${item.reseller_price.toFixed(2)}` : '-'}</TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleEditPullHandle(item)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDeletePullHandle(item.id)}
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
                  </CardContent>
                </Card>
            )}

            {/* Locking Products Table */}
            {(categoryFilter === "all" || categoryFilter === "locking-products") && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>מוצרי נעילה</CardTitle>
                </CardHeader>
                  <CardContent className="p-0">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right">סוג פריט</TableHead>
                            <TableHead className="text-right">כמות</TableHead>
                            <TableHead className="text-right">מחיר ספק</TableHead>
                            <TableHead className="text-right">מחיר מפיץ</TableHead>
                            <TableHead className="text-right">פעולות</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredLockingProducts.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                לא נמצאו פריטים
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredLockingProducts.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.item_type}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.supplier_price ? `₪${item.supplier_price.toFixed(2)}` : '-'}</TableCell>
                                <TableCell>{item.reseller_price ? `₪${item.reseller_price.toFixed(2)}` : '-'}</TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleEditLockingProduct(item)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDeleteLockingProduct(item.id)}
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
                  </CardContent>
                </Card>
            )}

            {/* Hardware Table */}
            {(categoryFilter === "all" || categoryFilter === "hardware") && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>פירזולים</CardTitle>
                </CardHeader>
                  <CardContent className="p-0">
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-right">סוג פירזול</TableHead>
                            <TableHead className="text-right">צבע</TableHead>
                            <TableHead className="text-right">כמות</TableHead>
                            <TableHead className="text-right">מחיר ספק</TableHead>
                            <TableHead className="text-right">מחיר מפיץ</TableHead>
                            <TableHead className="text-right">פעולות</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredHardware.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                לא נמצאו פריטים
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredHardware.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.hardware_type}</TableCell>
                                <TableCell>{item.color}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.supplier_price ? `₪${item.supplier_price.toFixed(2)}` : '-'}</TableCell>
                                <TableCell>{item.reseller_price ? `₪${item.reseller_price.toFixed(2)}` : '-'}</TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleEditHardware(item)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => handleDeleteHardware(item.id)}
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
                  </CardContent>
                </Card>
            )}
            
            {/* Doors Tables - Separate table for each door type */}
            {(categoryFilter === "all" || categoryFilter === "doors") && (
              <>
                {['doors_d7', 'doors_d100', 'doors_d82', 'doors_d80', 'doors_d88', 'doors_d_rhk', 'doors_d6'].map((tableName) => {
                  const tableLabel = tableName.replace('doors_', '').toUpperCase();
                  const tableDoors = filteredDoors.filter(door => door.table_name === tableName);
                  
                  return (
                    <Card key={tableName} className="shadow-sm">
                      <CardHeader>
                        <CardTitle>מלאי דלתות מיקום {tableLabel}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="rounded-md border overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-right">מידה</TableHead>
                                <TableHead className="text-right">כיוון</TableHead>
                                <TableHead className="text-right">9016t</TableHead>
                                <TableHead className="text-right">9001t</TableHead>
                                <TableHead className="text-right">7126d</TableHead>
                                <TableHead className="text-right">0096d</TableHead>
                                <TableHead className="text-right">MR09</TableHead>
                                <TableHead className="text-right font-bold">סה"כ</TableHead>
                                <TableHead className="text-right">מחיר ספק</TableHead>
                                <TableHead className="text-right">מחיר מפיץ</TableHead>
                                <TableHead className="text-right">תוספת פירזול</TableHead>
                                <TableHead className="text-right">פעולות</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {tableDoors.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                                    לא נמצאו דלתות
                                  </TableCell>
                                </TableRow>
                              ) : (
                                tableDoors.map((door) => (
                                  <TableRow key={door.id}>
                                    <TableCell className="font-medium">{door.size}</TableCell>
                                    <TableCell>{door.direction}</TableCell>
                                    <TableCell>{door.type_9016t}</TableCell>
                                    <TableCell>{door.type_9001t}</TableCell>
                                    <TableCell>{door.type_7126d}</TableCell>
                                    <TableCell>{door.type_0096d}</TableCell>
                                    <TableCell>{door.type_mr09}</TableCell>
                                    <TableCell className="font-bold">{door.total}</TableCell>
                                    <TableCell>{door.supplier_price ? `₪${door.supplier_price.toFixed(2)}` : '-'}</TableCell>
                                    <TableCell>{door.reseller_price ? `₪${door.reseller_price.toFixed(2)}` : '-'}</TableCell>
                                    <TableCell>{door.hardware_addition ? `₪${door.hardware_addition.toFixed(2)}` : '-'}</TableCell>
                                    <TableCell>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteDoor(door.id, door.table_name)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProduct}
      />
      
      <EditProductModal
        isOpen={isEditProductModalOpen}
        onClose={() => setIsEditProductModalOpen(false)}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
      
      <AddPullHandleModal
        open={isAddPullHandleModalOpen}
        onOpenChange={setIsAddPullHandleModalOpen}
        onAdd={handleAddPullHandle}
      />

      <EditInventoryItemModal
        isOpen={isEditPullHandleModalOpen}
        onClose={() => setIsEditPullHandleModalOpen(false)}
        onSave={handleSavePullHandle}
        item={editingPullHandle}
        title="עריכת ידית משיכה"
      />

      <AddLockingProductModal
        open={isAddLockingProductModalOpen}
        onOpenChange={setIsAddLockingProductModalOpen}
        onAdd={handleAddLockingProduct}
      />

      <EditInventoryItemModal
        isOpen={isEditLockingProductModalOpen}
        onClose={() => setIsEditLockingProductModalOpen(false)}
        onSave={handleSaveLockingProduct}
        item={editingLockingProduct}
        title="עריכת מוצר נעילה"
      />

      <AddHardwareModal
        open={isAddHardwareModalOpen}
        onOpenChange={setIsAddHardwareModalOpen}
        onAdd={handleAddHardware}
      />

      <EditInventoryItemModal
        isOpen={isEditHardwareModalOpen}
        onClose={() => setIsEditHardwareModalOpen(false)}
        onSave={handleSaveHardware}
        item={editingHardware}
        title="עריכת פירזול"
      />

      <AddDoorModal
        open={isAddDoorModalOpen}
        onOpenChange={setIsAddDoorModalOpen}
        onAdd={handleAddDoor}
      />
    </div>
  );
};

export default Inventory;
