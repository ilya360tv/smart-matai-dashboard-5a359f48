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

const ORDER_CATEGORIES = [
  "כנף חלקה",
  "כנף מעוצבת",
  "כנף מוסדית",
  "כנף רפפה",
];

const LOUVRE_DOOR_TYPES = [
  "כנף רפפה עליונה",
  "כנף רפפה תחתונה",
  "כנף רפפה ארוכה",
];

export const AddOrderModal = ({
  isOpen,
  onClose,
  onSuccess,
}: AddOrderModalProps) => {
  const [nextOrderNumber, setNextOrderNumber] = useState("C47");
  const [currentStep, setCurrentStep] = useState(1);
  const [partnerType, setPartnerType] = useState<"supplier" | "contractor">("supplier");
  const [suppliers, setSuppliers] = useState<Array<{ id: string; name: string }>>([]);
  const [contractors, setContractors] = useState<Array<{ id: string; name: string }>>([]);
  const [formData, setFormData] = useState({
    customer_name: "",
    order_category: "",
    louvre_type: "",
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

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.customer_name) {
        toast({
          title: "שגיאה",
          description: "נא לבחור ספק או קבלן",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.order_category) {
        toast({
          title: "שגיאה",
          description: "נא לבחור סוג כנף",
          variant: "destructive",
        });
        return;
      }
      
      // אם בחרו כנף רפפה, עובר לשלב 3
      if (formData.order_category === "כנף רפפה") {
        setCurrentStep(3);
        return;
      }
      
      // אחרת, סיום
      toast({
        title: "פרטי ההזמנה נשמרו!",
        description: `ספק/קבלן: ${formData.customer_name}\nסוג כנף: ${formData.order_category}`,
      });
      onClose();
    } else if (currentStep === 3) {
      if (!formData.louvre_type) {
        toast({
          title: "שגיאה",
          description: "נא לבחור סוג כנף רפפה",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "פרטי ההזמנה נשמרו!",
        description: `ספק/קבלן: ${formData.customer_name}\nסוג כנף: ${formData.order_category} - ${formData.louvre_type}`,
      });
      onClose();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNextStep();
  };

  const resetForm = () => {
    setFormData({
      customer_name: "",
      order_category: "",
      louvre_type: "",
    });
    setPartnerType("supplier");
    setCurrentStep(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center justify-between">
            <span>פתיחת הזמנה חדשה - שלב {currentStep} {formData.order_category === "כנף רפפה" ? "מתוך 3" : "מתוך 2"}</span>
            <span className="text-primary">{nextOrderNumber}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
            <>
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
            </>
          )}

          {currentStep === 2 && (
            <>
              {/* Order Category Selection */}
              <div className="space-y-4 p-6 bg-muted/30 rounded-lg border-2 border-primary/20">
                <Label className="text-base font-semibold">בחר סוג כנף *</Label>
                <RadioGroup
                  value={formData.order_category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, order_category: value, louvre_type: "" })
                  }
                  className="grid grid-cols-1 gap-3"
                >
                  {ORDER_CATEGORIES.map((category) => (
                    <div
                      key={category}
                      className="flex items-center gap-3 p-4 border-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setFormData({ ...formData, order_category: category, louvre_type: "" })}
                    >
                      <RadioGroupItem value={category} id={category} />
                      <Label htmlFor={category} className="cursor-pointer font-normal flex-1">
                        {category}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-between">
                <Button type="button" variant="outline" onClick={handlePreviousStep}>
                  חזור
                </Button>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={onClose}>
                    ביטול
                  </Button>
                  <Button type="submit">המשך</Button>
                </div>
              </div>
            </>
          )}

          {currentStep === 3 && (
            <>
              {/* Louvre Door Type Selection */}
              <div className="space-y-4 p-6 bg-muted/30 rounded-lg border-2 border-primary/20">
                <Label className="text-base font-semibold">בחר סוג כנף רפפה *</Label>
                <RadioGroup
                  value={formData.louvre_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, louvre_type: value })
                  }
                  className="grid grid-cols-1 gap-3"
                >
                  {LOUVRE_DOOR_TYPES.map((type) => (
                    <div
                      key={type}
                      className="flex items-center gap-3 p-4 border-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setFormData({ ...formData, louvre_type: type })}
                    >
                      <RadioGroupItem value={type} id={type} />
                      <Label htmlFor={type} className="cursor-pointer font-normal flex-1">
                        {type}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-between">
                <Button type="button" variant="outline" onClick={handlePreviousStep}>
                  חזור
                </Button>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={onClose}>
                    ביטול
                  </Button>
                  <Button type="submit">סיום</Button>
                </div>
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};
