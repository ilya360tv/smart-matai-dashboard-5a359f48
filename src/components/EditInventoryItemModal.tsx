import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InventoryItem {
  id: string;
  quantity: number;
  [key: string]: any;
}

interface EditInventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, quantity: number) => void;
  item: InventoryItem | null;
  title: string;
}

export const EditInventoryItemModal = ({ isOpen, onClose, onSave, item, title }: EditInventoryItemModalProps) => {
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if (item) {
      setQuantity(item.quantity);
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (item) {
      onSave(item.id, quantity);
      onClose();
    }
  };

  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="quantity">כמות</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
              min="0"
            />
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
