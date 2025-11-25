import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddOrderModal = ({
  isOpen,
  onClose,
  onSuccess,
}: AddOrderModalProps) => {
  const [nextOrderNumber, setNextOrderNumber] = useState("C47");
  const [partnerType, setPartnerType] = useState<"supplier" | "contractor">("supplier");
  const [suppliers, setSuppliers] = useState<Array<{ id: string; name: string }>>([]);
  const [contractors, setContractors] = useState<Array<{ id: string; name: string }>>([]);
  const [formData, setFormData] = useState({
    customer_name: "",
    product_type: "",
    product_width: "",
    side: "",
    drilling: "",
    katif_blocker: "",
    door_color: "",
    construction_frame: "",
    frame_height: "",
    cover_frame: "",
    electric_lock: false,
    handle_hole: false,
    clamp_holes: "",
    quantity: "1",
    price: "",
    installer_price: "",
  });

  useEffect(() => {
    if (isOpen) {
      fetchNextOrderNumber();
      fetchPartners();
    }
  }, [isOpen]);

  const fetchPartners = async () => {
    try {
      const [suppliersData, contractorsData] = await Promise.all([
        supabase.from("suppliers").select("id, name").eq("active", "פעיל"),
        supabase.from("contractors").select("id, name").eq("active", "פעיל"),
      ]);

      if (suppliersData.data) setSuppliers(suppliersData.data);
      if (contractorsData.data) setContractors(contractorsData.data);
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  const fetchNextOrderNumber = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("order_number")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const lastNumber = data[0].order_number;
        const match = lastNumber.match(/C(\d+)/);
        if (match) {
          const nextNum = parseInt(match[1]) + 1;
          setNextOrderNumber(`C${nextNum}`);
        }
      }
    } catch (error) {
      console.error("Error fetching next order number:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customer_name || !formData.product_type) {
      toast({
        title: "שגיאה",
        description: "נא למלא את שם הלקוח וסוג המוצר",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("orders").insert({
        order_number: nextOrderNumber,
        customer_name: formData.customer_name,
        product_type: formData.product_type,
        product_width: formData.product_width
          ? parseFloat(formData.product_width)
          : null,
        side: formData.side || null,
        drilling: formData.drilling || null,
        katif_blocker: formData.katif_blocker || null,
        door_color: formData.door_color || null,
        construction_frame: formData.construction_frame || null,
        frame_height: formData.frame_height
          ? parseFloat(formData.frame_height)
          : null,
        cover_frame: formData.cover_frame || null,
        electric_lock: formData.electric_lock,
        handle_hole: formData.handle_hole,
        clamp_holes: formData.clamp_holes || null,
        quantity: parseInt(formData.quantity) || 1,
        price: parseFloat(formData.price) || 0,
        installer_price: parseFloat(formData.installer_price) || 0,
      });

      if (error) throw error;

      toast({
        title: "ההזמנה נוצרה בהצלחה!",
        description: `הזמנה מספר ${nextOrderNumber} נוצרה`,
      });

      onSuccess();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "שגיאה ביצירת ההזמנה",
        description: "לא הצלחנו ליצור את ההזמנה",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      customer_name: "",
      product_type: "",
      product_width: "",
      side: "",
      drilling: "",
      katif_blocker: "",
      door_color: "",
      construction_frame: "",
      frame_height: "",
      cover_frame: "",
      electric_lock: false,
      handle_hole: false,
      clamp_holes: "",
      quantity: "1",
      price: "",
      installer_price: "",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center justify-between">
            <span>פתיחת הזמנה חדשה</span>
            <span className="text-primary">{nextOrderNumber}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Partner Selection */}
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg border-2 border-primary/20">
            <div className="space-y-3">
              <Label className="text-base font-semibold">בחר ספק / קבלן *</Label>
              <RadioGroup
                value={partnerType}
                onValueChange={(value: "supplier" | "contractor") => {
                  setPartnerType(value);
                  setFormData({ ...formData, customer_name: "" });
                }}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="supplier" id="supplier" />
                  <Label htmlFor="supplier" className="cursor-pointer font-normal">ספק</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="contractor" id="contractor" />
                  <Label htmlFor="contractor" className="cursor-pointer font-normal">קבלן</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_name">
                {partnerType === "supplier" ? "בחר ספק" : "בחר קבלן"} *
              </Label>
              <Select
                value={formData.customer_name}
                onValueChange={(value) =>
                  setFormData({ ...formData, customer_name: value })
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder={partnerType === "supplier" ? "בחר ספק מהרשימה" : "בחר קבלן מהרשימה"} />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {(partnerType === "supplier" ? suppliers : contractors).map((partner) => (
                    <SelectItem key={partner.id} value={partner.name}>
                      {partner.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Product Type */}
            <div className="space-y-2">
              <Label htmlFor="product_type">סוג מוצר *</Label>
              <Input
                id="product_type"
                value={formData.product_type}
                onChange={(e) =>
                  setFormData({ ...formData, product_type: e.target.value })
                }
                placeholder="סוג המוצר"
                required
              />
            </div>

            {/* Product Width */}
            <div className="space-y-2">
              <Label htmlFor="product_width">רוחב מוצר (ס״מ)</Label>
              <Input
                id="product_width"
                type="number"
                step="0.1"
                value={formData.product_width}
                onChange={(e) =>
                  setFormData({ ...formData, product_width: e.target.value })
                }
                placeholder="80"
              />
            </div>

            {/* Side R/L */}
            <div className="space-y-2">
              <Label htmlFor="side">R/L</Label>
              <Select
                value={formData.side}
                onValueChange={(value) =>
                  setFormData({ ...formData, side: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר צד" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="R">R (ימין)</SelectItem>
                  <SelectItem value="L">L (שמאל)</SelectItem>
                  <SelectItem value="ימין">ימין</SelectItem>
                  <SelectItem value="שמאל">שמאל</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Drilling */}
            <div className="space-y-2">
              <Label htmlFor="drilling">ניקוב</Label>
              <Input
                id="drilling"
                value={formData.drilling}
                onChange={(e) =>
                  setFormData({ ...formData, drilling: e.target.value })
                }
                placeholder="סוג ניקוב"
              />
            </div>

            {/* Katif Blocker */}
            <div className="space-y-2">
              <Label htmlFor="katif_blocker">חוסם קטיף רשים</Label>
              <Input
                id="katif_blocker"
                value={formData.katif_blocker}
                onChange={(e) =>
                  setFormData({ ...formData, katif_blocker: e.target.value })
                }
                placeholder="חוסם קטיף"
              />
            </div>

            {/* Door Color */}
            <div className="space-y-2">
              <Label htmlFor="door_color">צבע הדלת</Label>
              <Input
                id="door_color"
                value={formData.door_color}
                onChange={(e) =>
                  setFormData({ ...formData, door_color: e.target.value })
                }
                placeholder="צבע"
              />
            </div>

            {/* Construction Frame */}
            <div className="space-y-2">
              <Label htmlFor="construction_frame">משקוף בנייה</Label>
              <Input
                id="construction_frame"
                value={formData.construction_frame}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    construction_frame: e.target.value,
                  })
                }
                placeholder="משקוף בנייה"
              />
            </div>

            {/* Frame Height */}
            <div className="space-y-2">
              <Label htmlFor="frame_height">גובה משקוף (ס״מ)</Label>
              <Input
                id="frame_height"
                type="number"
                step="0.1"
                value={formData.frame_height}
                onChange={(e) =>
                  setFormData({ ...formData, frame_height: e.target.value })
                }
                placeholder="210"
              />
            </div>

            {/* Cover Frame */}
            <div className="space-y-2">
              <Label htmlFor="cover_frame">משקוף כיסוי</Label>
              <Input
                id="cover_frame"
                value={formData.cover_frame}
                onChange={(e) =>
                  setFormData({ ...formData, cover_frame: e.target.value })
                }
                placeholder="משקוף כיסוי"
              />
            </div>

            {/* Clamp Holes */}
            <div className="space-y-2">
              <Label htmlFor="clamp_holes">חורים לחובק</Label>
              <Input
                id="clamp_holes"
                value={formData.clamp_holes}
                onChange={(e) =>
                  setFormData({ ...formData, clamp_holes: e.target.value })
                }
                placeholder="מספר חורים"
              />
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">כמות *</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                required
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">מחיר (₪)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="0.00"
              />
            </div>

            {/* Installer Price */}
            <div className="space-y-2">
              <Label htmlFor="installer_price">מחיר מתקין (₪)</Label>
              <Input
                id="installer_price"
                type="number"
                step="0.01"
                value={formData.installer_price}
                onChange={(e) =>
                  setFormData({ ...formData, installer_price: e.target.value })
                }
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Switches */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-3">
              <Switch
                id="electric_lock"
                checked={formData.electric_lock}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, electric_lock: checked })
                }
              />
              <Label htmlFor="electric_lock" className="cursor-pointer">
                מנעול חשמלי
              </Label>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="handle_hole"
                checked={formData.handle_hole}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, handle_hole: checked })
                }
              />
              <Label htmlFor="handle_hole" className="cursor-pointer">
                חור לידית
              </Label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              ביטול
            </Button>
            <Button type="submit">צור הזמנה</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
