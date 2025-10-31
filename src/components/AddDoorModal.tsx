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
  type_9016t: number;
  type_9001t: number;
  type_7126d: number;
  type_0096d: number;
  type_mr09: number;
  type_d100: number;
  type_d82: number;
  type_d80: number;
  type_d_rhk: number;
  type_d6: number;
  type_d7: number;
  total: number;
}

interface AddDoorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (item: Omit<DoorInventory, "id" | "total">) => void;
}

export const AddDoorModal = ({ open, onOpenChange, onAdd }: AddDoorModalProps) => {
  const [formData, setFormData] = useState({
    size: "",
    direction: "ימין",
    type_9016t: 0,
    type_9001t: 0,
    type_7126d: 0,
    type_0096d: 0,
    type_mr09: 0,
    type_d100: 0,
    type_d82: 0,
    type_d80: 0,
    type_d_rhk: 0,
    type_d6: 0,
    type_d7: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      size: "",
      direction: "ימין",
      type_9016t: 0,
      type_9001t: 0,
      type_7126d: 0,
      type_0096d: 0,
      type_mr09: 0,
      type_d100: 0,
      type_d82: 0,
      type_d80: 0,
      type_d_rhk: 0,
      type_d6: 0,
      type_d7: 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>הוסף דלת למלאי</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
              <Label htmlFor="type_9016t">9016t</Label>
              <Input
                id="type_9016t"
                type="number"
                min="0"
                value={formData.type_9016t}
                onChange={(e) => setFormData({ ...formData, type_9016t: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="type_9001t">9001t</Label>
              <Input
                id="type_9001t"
                type="number"
                min="0"
                value={formData.type_9001t}
                onChange={(e) => setFormData({ ...formData, type_9001t: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="type_7126d">7126d</Label>
              <Input
                id="type_7126d"
                type="number"
                min="0"
                value={formData.type_7126d}
                onChange={(e) => setFormData({ ...formData, type_7126d: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="type_0096d">0096d</Label>
              <Input
                id="type_0096d"
                type="number"
                min="0"
                value={formData.type_0096d}
                onChange={(e) => setFormData({ ...formData, type_0096d: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="type_mr09">mr09</Label>
              <Input
                id="type_mr09"
                type="number"
                min="0"
                value={formData.type_mr09}
                onChange={(e) => setFormData({ ...formData, type_mr09: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="type_d100">d100</Label>
              <Input
                id="type_d100"
                type="number"
                min="0"
                value={formData.type_d100}
                onChange={(e) => setFormData({ ...formData, type_d100: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="type_d82">d82</Label>
              <Input
                id="type_d82"
                type="number"
                min="0"
                value={formData.type_d82}
                onChange={(e) => setFormData({ ...formData, type_d82: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="type_d80">d80</Label>
              <Input
                id="type_d80"
                type="number"
                min="0"
                value={formData.type_d80}
                onChange={(e) => setFormData({ ...formData, type_d80: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="type_d_rhk">d תואם r/h/k</Label>
              <Input
                id="type_d_rhk"
                type="number"
                min="0"
                value={formData.type_d_rhk}
                onChange={(e) => setFormData({ ...formData, type_d_rhk: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="type_d6">d6</Label>
              <Input
                id="type_d6"
                type="number"
                min="0"
                value={formData.type_d6}
                onChange={(e) => setFormData({ ...formData, type_d6: Number(e.target.value) })}
                required
              />
            </div>
            <div>
              <Label htmlFor="type_d7">d7</Label>
              <Input
                id="type_d7"
                type="number"
                min="0"
                value={formData.type_d7}
                onChange={(e) => setFormData({ ...formData, type_d7: Number(e.target.value) })}
                required
              />
            </div>
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
