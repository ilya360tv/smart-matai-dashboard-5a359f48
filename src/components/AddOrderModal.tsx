import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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

    if (!formData.customer_name) {
      toast({
        title: "שגיאה",
        description: "נא לבחור ספק או קבלן",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "שלב ראשון הושלם!",
      description: `נבחר: ${formData.customer_name}`,
    });

    onClose();
  };

  const resetForm = () => {
    setFormData({
      customer_name: "",
    });
    setPartnerType("supplier");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center justify-between">
            <span>פתיחת הזמנה חדשה</span>
            <span className="text-primary">{nextOrderNumber}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Partner Selection */}
          <div className="space-y-4 p-6 bg-muted/30 rounded-lg border-2 border-primary/20">
            <div className="space-y-3">
              <Label className="text-base font-semibold">בחר ספק / קבלן *</Label>
              <RadioGroup
                value={partnerType}
                onValueChange={(value: "supplier" | "contractor") => {
                  setPartnerType(value);
                  setFormData({ ...formData, customer_name: "" });
                }}
                className="flex flex-row-reverse gap-8 justify-end"
                dir="rtl"
              >
                <div className="flex items-center gap-2">
                  <Label htmlFor="contractor" className="cursor-pointer font-normal">קבלן</Label>
                  <RadioGroupItem value="contractor" id="contractor" />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="supplier" className="cursor-pointer font-normal">ספק</Label>
                  <RadioGroupItem value="supplier" id="supplier" />
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

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              ביטול
            </Button>
            <Button type="submit">המשך</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
