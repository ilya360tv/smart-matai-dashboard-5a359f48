import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddHardwareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (item: { hardware_type: string; color: string; quantity: number }) => void;
}

export const AddHardwareModal = ({ open, onOpenChange, onAdd }: AddHardwareModalProps) => {
  const [hardwareType, setHardwareType] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      hardware_type: hardwareType,
      color,
      quantity: parseInt(quantity) || 0,
    });
    setHardwareType("");
    setColor("");
    setQuantity("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>הוספת פירזול</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="hardwareType">סוג פירזול</Label>
            <Input
              id="hardwareType"
              value={hardwareType}
              onChange={(e) => setHardwareType(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="color">צבע</Label>
            <Input
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
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
