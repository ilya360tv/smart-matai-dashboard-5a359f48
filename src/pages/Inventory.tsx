import { useState } from "react";
import { AlertTriangle, Plus, Minus } from "lucide-react";
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
import { StockMovementModal } from "@/components/StockMovementModal";

interface Product {
  id: number;
  name: string;
  sku: string;
  currentStock: number;
  minStock: number;
  supplier: string;
}

const Inventory = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [movementType, setMovementType] = useState<"in" | "out" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const products: Product[] = [
    { id: 1, name: "מוצר A", sku: "SKU-001", currentStock: 5, minStock: 20, supplier: "ספק 1" },
    { id: 2, name: "מוצר B", sku: "SKU-002", currentStock: 3, minStock: 15, supplier: "ספק 2" },
    { id: 3, name: "מוצר C", sku: "SKU-003", currentStock: 50, minStock: 25, supplier: "ספק 1" },
    { id: 4, name: "מוצר D", sku: "SKU-004", currentStock: 100, minStock: 30, supplier: "ספק 3" },
    { id: 5, name: "מוצר E", sku: "SKU-005", currentStock: 8, minStock: 40, supplier: "ספק 2" },
    { id: 6, name: "מוצר F", sku: "SKU-006", currentStock: 75, minStock: 20, supplier: "ספק 1" },
  ];

  const stockHistory = [
    { id: 1, date: "2025-01-15 14:30", product: "מוצר A", type: "כניסה", quantity: 10, user: "משתמש 1" },
    { id: 2, date: "2025-01-15 13:20", product: "מוצר B", type: "יציאה", quantity: 5, user: "משתמש 2" },
    { id: 3, date: "2025-01-14 16:45", product: "מוצר C", type: "כניסה", quantity: 25, user: "משתמש 1" },
    { id: 4, date: "2025-01-14 11:15", product: "מוצר D", type: "יציאה", quantity: 15, user: "משתמש 3" },
    { id: 5, date: "2025-01-13 09:00", product: "מוצר E", type: "כניסה", quantity: 30, user: "משתמש 2" },
  ];

  const handleOpenModal = (product: Product, type: "in" | "out") => {
    setSelectedProduct(product);
    setMovementType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setMovementType(null);
  };

  const isLowStock = (current: number, min: number) => current < min;

  return (
    <div className="flex min-h-screen w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="flex h-14 items-center gap-2 border-b bg-card px-3 lg:h-[60px] lg:px-6 sticky top-0 z-10">
          <h1 className="text-lg lg:text-xl font-bold">ניהול מלאי</h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-3 lg:p-6">
          <div className="mx-auto max-w-7xl space-y-4 lg:space-y-6">
            {/* Products Table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg lg:text-2xl">רשימת מוצרים</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">שם מוצר</TableHead>
                        <TableHead className="text-right">מק"ט</TableHead>
                        <TableHead className="text-right">כמות במלאי</TableHead>
                        <TableHead className="text-right">כמות מינימלית</TableHead>
                        <TableHead className="text-right">ספק</TableHead>
                        <TableHead className="text-right">פעולות</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow
                          key={product.id}
                          className={
                            isLowStock(product.currentStock, product.minStock)
                              ? "bg-destructive/5 hover:bg-destructive/10"
                              : ""
                          }
                        >
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              {isLowStock(product.currentStock, product.minStock) && (
                                <AlertTriangle className="h-4 w-4 text-warning" />
                              )}
                              {product.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                isLowStock(product.currentStock, product.minStock)
                                  ? "bg-warning/10 text-warning border-warning/20"
                                  : "bg-success/10 text-success border-success/20"
                              }
                            >
                              {product.currentStock}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{product.minStock}</TableCell>
                          <TableCell>{product.supplier}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1"
                                onClick={() => handleOpenModal(product, "in")}
                              >
                                <Plus className="h-3 w-3" />
                                כניסה
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1"
                                onClick={() => handleOpenModal(product, "out")}
                              >
                                <Minus className="h-3 w-3" />
                                יציאה
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className={`p-4 rounded-lg border ${
                        isLowStock(product.currentStock, product.minStock)
                          ? "bg-destructive/5 border-warning/30"
                          : "bg-card"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {isLowStock(product.currentStock, product.minStock) && (
                            <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0" />
                          )}
                          <div>
                            <h3 className="font-semibold text-base">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">{product.sku}</p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            isLowStock(product.currentStock, product.minStock)
                              ? "bg-warning/10 text-warning border-warning/20"
                              : "bg-success/10 text-success border-success/20"
                          }
                        >
                          {product.currentStock}
                        </Badge>
                      </div>
                      <div className="space-y-2 text-sm mb-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">מינימום:</span>
                          <span className="font-medium">{product.minStock}</span>
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
                          onClick={() => handleOpenModal(product, "in")}
                        >
                          <Plus className="h-4 w-4" />
                          כניסה
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          className="flex-1 gap-2"
                          onClick={() => handleOpenModal(product, "out")}
                        >
                          <Minus className="h-4 w-4" />
                          יציאה
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stock History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg lg:text-2xl">היסטוריית תנועות מלאי</CardTitle>
              </CardHeader>
              <CardContent>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">תאריך ושעה</TableHead>
                        <TableHead className="text-right">שם מוצר</TableHead>
                        <TableHead className="text-right">סוג תנועה</TableHead>
                        <TableHead className="text-right">כמות</TableHead>
                        <TableHead className="text-right">משתמש</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stockHistory.map((movement) => (
                        <TableRow key={movement.id}>
                          <TableCell className="text-muted-foreground">{movement.date}</TableCell>
                          <TableCell className="font-medium">{movement.product}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                movement.type === "כניסה"
                                  ? "bg-success/10 text-success border-success/20"
                                  : "bg-primary/10 text-primary border-primary/20"
                              }
                            >
                              {movement.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-semibold">{movement.quantity}</TableCell>
                          <TableCell className="text-muted-foreground">{movement.user}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-3">
                  {stockHistory.map((movement) => (
                    <div key={movement.id} className="p-4 rounded-lg border bg-card">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-base mb-1">{movement.product}</h3>
                          <p className="text-xs text-muted-foreground">{movement.date}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            movement.type === "כניסה"
                              ? "bg-success/10 text-success border-success/20"
                              : "bg-primary/10 text-primary border-primary/20"
                          }
                        >
                          {movement.type}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">כמות:</span>
                        <span className="font-semibold">{movement.quantity}</span>
                      </div>
                      <div className="flex justify-between text-sm mt-1">
                        <span className="text-muted-foreground">משתמש:</span>
                        <span>{movement.user}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Stock Movement Modal */}
      {selectedProduct && movementType && (
        <StockMovementModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          product={selectedProduct}
          movementType={movementType}
        />
      )}
    </div>
  );
};

export default Inventory;
