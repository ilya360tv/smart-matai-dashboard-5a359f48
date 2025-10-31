import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

interface DoorInventory {
  size: string;
  direction: string;
  quantity: number;
  table_name: string;
}

interface AddDoorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (item: Omit<DoorInventory, "id">) => void;
}

const doorTypes = [
  { value: "doors_d100", label: "d100" },
  { value: "doors_d82", label: "d82" },
  { value: "doors_d80", label: "d80" },
  { value: "doors_d_rhk", label: "d תואם r/h/k" },
  { value: "doors_d6", label: "d6" },
  { value: "doors_d7", label: "d7" },
];

export const AddDoorModal = ({ open, onOpenChange, onAdd }: AddDoorModalProps) => {
  const [formData, setFormData] = useState({
    size: "",
    direction: "ימין",
    quantity: 0,
    table_name: "doors_d100",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      size: "",
      direction: "ימין",
      quantity: 0,
      table_name: "doors_d100",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>הוסף דלת למלאי</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="table_name">סוג דלת</Label>
            <Select
              value={formData.table_name}
              onValueChange={(value) => setFormData({ ...formData, table_name: value })}
            >
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                {doorTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="size">מידה</Label>
            <Input
              id="size"
              placeholder="לדוגמה: 880/1940"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="direction">כיוון</Label>
            <Select
              value={formData.direction}
              onValueChange={(value) => setFormData({ ...formData, direction: value })}
            >
              <SelectTrigger className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="ימין">ימין</SelectItem>
                <SelectItem value="שמאל">שמאל</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="quantity">כמות</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
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