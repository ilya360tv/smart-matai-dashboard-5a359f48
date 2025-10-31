import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddLockingProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (item: { item_type: string; quantity: number }) => void;
}

export const AddLockingProductModal = ({ open, onOpenChange, onAdd }: AddLockingProductModalProps) => {
  const [itemType, setItemType] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      item_type: itemType,
      quantity: parseInt(quantity) || 0,
    });
    setItemType("");
    setQuantity("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>הוספת מוצר נעילה</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="itemType">סוג פריט</Label>
            <Input
              id="itemType"
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="quantity">כמות</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              ביטול
            </Button>
            <Button type="submit">הוסף</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
