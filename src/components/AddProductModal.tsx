import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (product: {
    name: string;
    category: string;
    quantity: number;
    price: number;
    supplier: string;
    side: "ימין" | "שמאל" | "הזזה" | "לא רלוונטי";
  }) => void;
}

export const AddProductModal = ({ isOpen, onClose, onAdd }: AddProductModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    quantity: "",
    price: "",
    supplier: "",
    side: "לא רלוונטי" as "ימין" | "שמאל" | "הזזה" | "לא רלוונטי",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name: formData.name,
      category: formData.category,
      quantity: Number(formData.quantity),
      price: Number(formData.price),
      supplier: formData.supplier,
      side: formData.side,
    });
    setFormData({
      name: "",
      category: "",
      quantity: "",
      price: "",
      supplier: "",
      side: "לא רלוונטי",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">הוסף מוצר חדש</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">שם מוצר</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="הזן שם מוצר"
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">קטגוריה</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="בחר קטגוריה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ידיות">ידיות</SelectItem>
                <SelectItem value="צירים">צירים</SelectItem>
                <SelectItem value="מפתחות">מפתחות</SelectItem>
                <SelectItem value="מנעולים">מנעולים</SelectItem>
                <SelectItem value="אביזרים">אביזרים</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="side">צד</Label>
            <Select
              value={formData.side}
              onValueChange={(value: "ימין" | "שמאל" | "הזזה" | "לא רלוונטי") => 
                setFormData({ ...formData, side: value })
              }
              required
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="בחר צד" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ימין">ימין</SelectItem>
                <SelectItem value="שמאל">שמאל</SelectItem>
                <SelectItem value="הזזה">הזזה</SelectItem>
                <SelectItem value="לא רלוונטי">לא רלוונטי</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">כמות</Label>
              <Input
                id="quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="0"
                required
                min="0"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">מחיר (₪)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                required
                min="0"
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier">ספק</Label>
            <Input
              id="supplier"
              value={formData.supplier}
              onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              placeholder="הזן שם ספק"
              required
              className="h-11"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
              ביטול
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              שמור
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
