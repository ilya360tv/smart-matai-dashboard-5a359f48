import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  customerPrice: number;
  supplier: string;
  side: "ימין" | "שמאל" | "הזזה" | "לא רלוונטי";
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  product: Product | null;
}

export const EditProductModal = ({ isOpen, onClose, onSave, product }: EditProductModalProps) => {
  const [formData, setFormData] = useState<Product | null>(null);

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>עריכת מוצר</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">שם מוצר</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">קטגוריה</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="quantity">כמות</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="side">צד</Label>
              <select
                id="side"
                value={formData.side}
                onChange={(e) => setFormData({ ...formData, side: e.target.value as Product["side"] })}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="ימין">ימין</option>
                <option value="שמאל">שמאל</option>
                <option value="הזזה">הזזה</option>
                <option value="לא רלוונטי">לא רלוונטי</option>
              </select>
            </div>
            <div>
              <Label htmlFor="price">מחיר בסיסי</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="customerPrice">מחיר ללקוח</Label>
              <Input
                id="customerPrice"
                type="number"
                step="0.01"
                value={formData.customerPrice}
                onChange={(e) => setFormData({ ...formData, customerPrice: Number(e.target.value) })}
                required
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="supplier">ספק</Label>
              <Input
                id="supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              ביטול
            </Button>
            <Button type="submit">שמור</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
