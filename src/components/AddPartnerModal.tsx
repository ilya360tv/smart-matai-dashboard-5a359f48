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

interface AddPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (partner: {
    name: string;
    phone: string;
    email: string;
    city: string;
    status: "ספק" | "לקוח";
  }) => void;
  type: "ספק" | "לקוח";
}

export const AddPartnerModal = ({ isOpen, onClose, onAdd, type }: AddPartnerModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    city: "",
    status: "פעיל" as "פעיל" | "לא פעיל",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      city: formData.city,
      status: type,
    });
    setFormData({
      name: "",
      phone: "",
      email: "",
      city: "",
      status: "פעיל",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            הוסף {type} חדש
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">שם {type}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={`הזן שם ${type}`}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">טלפון</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="050-1234567"
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">אימייל</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="email@example.com"
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">עיר</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="הזן עיר"
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">סטטוס</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "פעיל" | "לא פעיל") => 
                setFormData({ ...formData, status: value })
              }
              required
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="בחר סטטוס" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="פעיל">פעיל</SelectItem>
                <SelectItem value="לא פעיל">לא פעיל</SelectItem>
              </SelectContent>
            </Select>
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
