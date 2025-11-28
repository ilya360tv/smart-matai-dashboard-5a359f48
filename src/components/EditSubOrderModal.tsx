import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SubOrder {
  id: string;
  order_group_id: string;
  full_order_number: string;
  partner_type: string;
  partner_name: string;
  product_category: string;
  active_door_type: string | null;
  fixed_door_type: string | null;
  active_louvre_type: string | null;
  fixed_louvre_type: string | null;
  active_door_width: number | null;
  active_door_height: number | null;
  active_door_direction: string | null;
  opening_direction: string | null;
  fixed_door_width: number | null;
  fixed_door_height: number | null;
  fixed_door_direction: string | null;
  insert_width: number | null;
  insert_height: number | null;
  insert_color_1: string | null;
  insert_color_2: string | null;
  quantity: number;
  price: number;
  installer_price: number;
  notes: string | null;
  status: string;
}

interface EditSubOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  subOrder: SubOrder | null;
}

export function EditSubOrderModal({
  isOpen,
  onClose,
  onSuccess,
  subOrder,
}: EditSubOrderModalProps) {
  const [formData, setFormData] = useState({
    partner_type: "",
    partner_name: "",
    product_category: "",
    active_door_width: "",
    active_door_height: "",
    active_door_direction: "",
    opening_direction: "",
    fixed_door_width: "",
    fixed_door_height: "",
    fixed_door_direction: "",
    insert_width: "",
    insert_height: "",
    insert_color_1: "",
    insert_color_2: "",
    quantity: "1",
    price: "0",
    installer_price: "0",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subOrder) {
      setFormData({
        partner_type: subOrder.partner_type || "",
        partner_name: subOrder.partner_name || "",
        product_category: subOrder.product_category || "",
        active_door_width: subOrder.active_door_width?.toString() || "",
        active_door_height: subOrder.active_door_height?.toString() || "",
        active_door_direction: subOrder.active_door_direction || "",
        opening_direction: subOrder.opening_direction || "",
        fixed_door_width: subOrder.fixed_door_width?.toString() || "",
        fixed_door_height: subOrder.fixed_door_height?.toString() || "",
        fixed_door_direction: subOrder.fixed_door_direction || "",
        insert_width: subOrder.insert_width?.toString() || "",
        insert_height: subOrder.insert_height?.toString() || "",
        insert_color_1: subOrder.insert_color_1 || "",
        insert_color_2: subOrder.insert_color_2 || "",
        quantity: subOrder.quantity.toString(),
        price: subOrder.price.toString(),
        installer_price: subOrder.installer_price.toString(),
        notes: subOrder.notes || "",
      });
    }
  }, [subOrder]);

  const handleSubmit = async () => {
    if (!subOrder) return;

    try {
      setLoading(true);

      const updateData = {
        partner_type: formData.partner_type,
        partner_name: formData.partner_name,
        product_category: formData.product_category,
        active_door_width: formData.active_door_width ? parseFloat(formData.active_door_width) : null,
        active_door_height: formData.active_door_height ? parseFloat(formData.active_door_height) : null,
        active_door_direction: formData.active_door_direction || null,
        opening_direction: formData.opening_direction || null,
        fixed_door_width: formData.fixed_door_width ? parseFloat(formData.fixed_door_width) : null,
        fixed_door_height: formData.fixed_door_height ? parseFloat(formData.fixed_door_height) : null,
        fixed_door_direction: formData.fixed_door_direction || null,
        insert_width: formData.insert_width ? parseFloat(formData.insert_width) : null,
        insert_height: formData.insert_height ? parseFloat(formData.insert_height) : null,
        insert_color_1: formData.insert_color_1 || null,
        insert_color_2: formData.insert_color_2 || null,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        installer_price: parseFloat(formData.installer_price),
        notes: formData.notes || null,
      };

      const { error } = await supabase
        .from("sub_orders")
        .update(updateData)
        .eq("id", subOrder.id);

      if (error) throw error;

      toast({
        title: "תת-ההזמנה עודכנה בהצלחה",
        description: "השינויים נשמרו במערכת",
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating sub-order:", error);
      toast({
        title: "שגיאה בעדכון תת-ההזמנה",
        description: "לא הצלחנו לעדכן את תת-ההזמנה",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            עריכת תת-הזמנה {subOrder?.full_order_number}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Partner Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">פרטי שותף</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>סוג שותף</Label>
                <Select
                  value={formData.partner_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, partner_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סוג שותף" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ספק">ספק</SelectItem>
                    <SelectItem value="קבלן">קבלן</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>שם השותף</Label>
                <Input
                  value={formData.partner_name}
                  onChange={(e) =>
                    setFormData({ ...formData, partner_name: e.target.value })
                  }
                  placeholder="הזן שם"
                />
              </div>
            </div>
          </div>

          {/* Product Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">מוצר</h3>
            <div className="space-y-2">
              <Label>קטגוריית מוצר</Label>
              <Select
                value={formData.product_category}
                onValueChange={(value) =>
                  setFormData({ ...formData, product_category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="בחר קטגוריה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="דלת D80">דלת D80</SelectItem>
                  <SelectItem value="דלת D82">דלת D82</SelectItem>
                  <SelectItem value="דלת D88">דלת D88</SelectItem>
                  <SelectItem value="דלת D100">דלת D100</SelectItem>
                  <SelectItem value="דלת RHK">דלת RHK</SelectItem>
                  <SelectItem value="כנף וחצי">כנף וחצי</SelectItem>
                  <SelectItem value="כנף כפולה">כנף כפולה</SelectItem>
                  <SelectItem value="אינסרט">אינסרט</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dimensions Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">מידות</h3>
            
            {formData.product_category === "אינסרט" ? (
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>רוחב (מ"מ)</Label>
                  <Input
                    type="number"
                    value={formData.insert_width}
                    onChange={(e) =>
                      setFormData({ ...formData, insert_width: e.target.value })
                    }
                    placeholder="רוחב"
                  />
                </div>
                <div className="space-y-2">
                  <Label>גובה (מ"מ)</Label>
                  <Input
                    type="number"
                    value={formData.insert_height}
                    onChange={(e) =>
                      setFormData({ ...formData, insert_height: e.target.value })
                    }
                    placeholder="גובה"
                  />
                </div>
                <div className="space-y-2">
                  <Label>צבע</Label>
                  <Input
                    value={formData.insert_color_1}
                    onChange={(e) =>
                      setFormData({ ...formData, insert_color_1: e.target.value })
                    }
                    placeholder="צבע"
                  />
                </div>
                <div className="space-y-2 col-span-3">
                  <Label>צבע שני (אופציונלי)</Label>
                  <Input
                    value={formData.insert_color_2}
                    onChange={(e) =>
                      setFormData({ ...formData, insert_color_2: e.target.value })
                    }
                    placeholder="צבע שני"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>רוחב כנף פעילה (מ"מ)</Label>
                    <Input
                      type="number"
                      value={formData.active_door_width}
                      onChange={(e) =>
                        setFormData({ ...formData, active_door_width: e.target.value })
                      }
                      placeholder="רוחב"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>גובה כנף פעילה (מ"מ)</Label>
                    <Input
                      type="number"
                      value={formData.active_door_height}
                      onChange={(e) =>
                        setFormData({ ...formData, active_door_height: e.target.value })
                      }
                      placeholder="גובה"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>כיוון כנף פעילה</Label>
                    <Select
                      value={formData.active_door_direction}
                      onValueChange={(value) =>
                        setFormData({ ...formData, active_door_direction: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="בחר כיוון" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="R">R - ימין</SelectItem>
                        <SelectItem value="L">L - שמאל</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>כיוון פתיחה</Label>
                    <Select
                      value={formData.opening_direction}
                      onValueChange={(value) =>
                        setFormData({ ...formData, opening_direction: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="בחר כיוון פתיחה" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="פנים">פנים</SelectItem>
                        <SelectItem value="חוץ">חוץ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(formData.product_category === "כנף וחצי" || formData.product_category === "כנף כפולה") && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>רוחב כנף קבועה (מ"מ)</Label>
                      <Input
                        type="number"
                        value={formData.fixed_door_width}
                        onChange={(e) =>
                          setFormData({ ...formData, fixed_door_width: e.target.value })
                        }
                        placeholder="רוחב"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>גובה כנף קבועה (מ"מ)</Label>
                      <Input
                        type="number"
                        value={formData.fixed_door_height}
                        onChange={(e) =>
                          setFormData({ ...formData, fixed_door_height: e.target.value })
                        }
                        placeholder="גובה"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>כיוון כנף קבועה</Label>
                      <Select
                        value={formData.fixed_door_direction}
                        onValueChange={(value) =>
                          setFormData({ ...formData, fixed_door_direction: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="בחר כיוון" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="R">R - ימין</SelectItem>
                          <SelectItem value="L">L - שמאל</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Quantity & Pricing Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">כמות ומחירים</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>כמות</Label>
                <Input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  min="1"
                />
              </div>
              <div className="space-y-2">
                <Label>מחיר (₪)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>מחיר מתקין (₪)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.installer_price}
                  onChange={(e) =>
                    setFormData({ ...formData, installer_price: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-2">
            <Label>הערות</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="הערות נוספות..."
              rows={3}
            />
          </div>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            ביטול
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "שומר..." : "שמור שינויים"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
