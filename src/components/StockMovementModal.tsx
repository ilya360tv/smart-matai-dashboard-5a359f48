import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  sku: string;
  currentStock: number;
  minStock: number;
  supplier: string;
}

interface StockMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  movementType: "in" | "out";
}

export const StockMovementModal = ({
  isOpen,
  onClose,
  product,
  movementType,
}: StockMovementModalProps) => {
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      toast.error("אנא הזן כמות תקינה");
      return;
    }

    if (movementType === "out" && qty > product.currentStock) {
      toast.error("כמות היציאה גדולה מהמלאי הקיים");
      return;
    }

    // Simulate successful operation
    const newStock = movementType === "in" 
      ? product.currentStock + qty 
      : product.currentStock - qty;

    toast.success(
      `${movementType === "in" ? "כניסה" : "יציאה"} של ${qty} יחידות ${movementType === "in" ? "נוספו" : "הוסרו"} בהצלחה`,
      {
        description: `מלאי חדש: ${newStock} יחידות`,
      }
    );

    // Reset and close
    setQuantity("");
    setNotes("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {movementType === "in" ? "כניסת מלאי" : "יציאת מלאי"}
          </DialogTitle>
          <DialogDescription>
            {product.name} ({product.sku})
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="current-stock">מלאי נוכחי</Label>
              <Input
                id="current-stock"
                value={product.currentStock}
                disabled
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">כמות *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="הזן כמות"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">הערות (אופציונלי)</Label>
              <Textarea
                id="notes"
                placeholder="הוסף הערות..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              ביטול
            </Button>
            <Button type="submit">
              {movementType === "in" ? "הוסף למלאי" : "הסר מהמלאי"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
