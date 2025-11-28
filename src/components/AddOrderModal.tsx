import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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

const PRODUCT_CATEGORIES = [
  "כנף בודדת חלקה",
  "כנף עם משקוף בנייה",
  "כנף עם משקוף הלבשה",
  "כנף וחצי בודדת (בלי משקוף)",
  "כנף וחצי משקוף בנייה/חובק",
  "כנף וחצי הלבשה",
  "רק משקוף בנייה",
  "רק משקוף הלבשה",
  "רק משקוף בנייה לכנף וחצי",
  "רק משקוף הלבשה לכנף וחצי",
  "אינסרט",
];

const DOOR_TYPES = [
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

const INSERT_COLORS = [
  "9016T - לבן תנועה",
  "9001T - לבן שמנת",
  "7126D - חום",
  "0096D - כסף",
  "MR09 - אפור כהה",
];

export const AddOrderModal = ({
  isOpen,
  onClose,
  onSuccess,
}: AddOrderModalProps) => {
  const [nextOrderNumber, setNextOrderNumber] = useState("C47-1");
  const [activeGroup, setActiveGroup] = useState<{ id: string; group_number: string } | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [partnerType, setPartnerType] = useState<"supplier" | "marketer">("supplier");
  const [suppliers, setSuppliers] = useState<Array<{ id: string; name: string }>>([]);
  const [marketers, setMarketers] = useState<Array<{ id: string; name: string }>>([]);
  const [hasDraft, setHasDraft] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    product_category: "",
    active_door_type: "",
    fixed_door_type: "",
    active_louvre_type: "",
    fixed_louvre_type: "",
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
  });

  useEffect(() => {
    if (isOpen) {
      fetchNextOrderNumber();
      fetchPartners();
      checkForDraft();
    }
  }, [isOpen]);

  const fetchPartners = async () => {
    try {
      const [suppliersData, marketersData] = await Promise.all([
        supabase.from("suppliers").select("id, name").eq("active", "פעיל"),
        supabase.from("contractors").select("id, name").eq("active", "פעיל"),
      ]);

      if (suppliersData.data) setSuppliers(suppliersData.data);
      if (marketersData.data) setMarketers(marketersData.data);
    } catch (error) {
      console.error("Error fetching partners:", error);
    }
  };

  const checkForDraft = () => {
    const draft = localStorage.getItem("order_draft");
    setHasDraft(!!draft);
  };

  const saveDraft = () => {
    const draft = {
      formData,
      currentStep,
      partnerType,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("order_draft", JSON.stringify(draft));
    toast({
      title: "טיוטה נשמרה!",
      description: "תוכל לחזור להזמנה זו בכל עת",
    });
    onClose();
  };

  const loadDraft = () => {
    const draft = localStorage.getItem("order_draft");
    if (draft) {
      const { formData: savedFormData, currentStep: savedStep, partnerType: savedPartnerType } = JSON.parse(draft);
      setFormData(savedFormData);
      setCurrentStep(savedStep);
      setPartnerType(savedPartnerType);
      setHasDraft(false);
      toast({
        title: "טיוטה נטענה!",
        description: "ממשיך מהמקום שבו עצרת",
      });
    }
  };

  const deleteDraft = () => {
    localStorage.removeItem("order_draft");
    setHasDraft(false);
    toast({
      title: "טיוטה נמחקה",
      description: "הטיוטה הוסרה מהמערכת",
    });
  };

  const fetchNextOrderNumber = async () => {
    try {
      // Get active order group
      const { data: groupData, error: groupError } = await supabase
        .from("order_groups")
        .select("id, group_number")
        .eq("status", "פעיל")
        .maybeSingle();

      if (groupError) throw groupError;
      
      let activeGroupData = groupData;
      
      // If no active group exists, create one
      if (!activeGroupData) {
        // Get the latest group number to determine the next one
        const { data: allGroups, error: allGroupsError } = await supabase
          .from("order_groups")
          .select("group_number")
          .order("created_at", { ascending: false })
          .limit(1);

        if (allGroupsError) throw allGroupsError;

        // Calculate next group number
        let nextGroupNum = 48; // Default starting number
        if (allGroups && allGroups.length > 0) {
          const match = allGroups[0].group_number.match(/C(\d+)/);
          nextGroupNum = match ? parseInt(match[1]) + 1 : 48;
        }

        const newGroupNumber = `C${nextGroupNum}`;

        // Create new active group
        const { data: newGroup, error: createError } = await supabase
          .from("order_groups")
          .insert({
            group_number: newGroupNumber,
            status: "פעיל",
          })
          .select("id, group_number")
          .single();

        if (createError) throw createError;
        
        activeGroupData = newGroup;
        
        toast({
          title: "הזמנה חדשה נוצרה!",
          description: `קבוצה ${newGroupNumber} נפתחה אוטומטית`,
        });
      }
      
      setActiveGroup(activeGroupData);

      // Get the next sub-order number for this group
      const { data: subOrdersData, error: subOrdersError } = await supabase
        .from("sub_orders")
        .select("sub_number")
        .eq("order_group_id", activeGroupData.id)
        .order("sub_number", { ascending: false })
        .limit(1);

      if (subOrdersError) throw subOrdersError;

      const nextSubNumber = subOrdersData && subOrdersData.length > 0 
        ? subOrdersData[0].sub_number + 1 
        : 1;
      
      setNextOrderNumber(`${activeGroupData.group_number}-${nextSubNumber}`);
    } catch (error) {
      console.error("Error fetching next order number:", error);
      toast({
        title: "שגיאה",
        description: "לא הצלחנו לטעון את מספר ההזמנה הבא",
        variant: "destructive",
      });
    }
  };

  const handleNextStep = async () => {
    const isOneAndHalf = formData.product_category.includes("כנף וחצי");
    
    if (currentStep === 1) {
      if (!formData.customer_name) {
        toast({
          title: "שגיאה",
          description: "נא לבחור ספק או משווק",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.product_category) {
        toast({
          title: "שגיאה",
          description: "נא לבחור מוצר",
          variant: "destructive",
        });
        return;
      }
      
      // אם בחר "רק משקוף", דלג לשלבים אחרים בעתיד
      const isFrameOnly = formData.product_category.includes("רק משקוף");
      if (isFrameOnly) {
        toast({
          title: "פרטי ההזמנה נשמרו!",
          description: `ספק/משווק: ${formData.customer_name}\nמוצר: ${formData.product_category}`,
        });
        onClose();
        return;
      }
      
      // אם בחר אינסרט, עבור לשלב אינסרט
      if (formData.product_category === "אינסרט") {
        setCurrentStep(8); // שלב חדש לאינסרט
        return;
      }
      
      setCurrentStep(3);
    } else if (currentStep === 8) {
      // שלב אינסרט - בדיקת שדות
      if (!formData.insert_width || parseFloat(formData.insert_width) <= 0) {
        toast({
          title: "שגיאה",
          description: "נא להזין רוחב תקין במילימטרים",
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.insert_height || parseFloat(formData.insert_height) <= 0) {
        toast({
          title: "שגיאה",
          description: "נא להזין גובה תקין במילימטרים",
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.insert_color_1) {
        toast({
          title: "שגיאה",
          description: "נא לבחור צבע",
          variant: "destructive",
        });
        return;
      }
      
      // סיום - שמירת ההזמנה
      await saveSubOrder();
    } else if (currentStep === 3) {
      if (!formData.active_door_type) {
        toast({
          title: "שגיאה",
          description: "נא לבחור סוג כנף",
          variant: "destructive",
        });
        return;
      }
      
      // אם כנף וחצי, מעתיק אוטומטית את הכנף הפעילה לכנף הקבועה
      if (isOneAndHalf) {
        setFormData(prev => ({ 
          ...prev, 
          fixed_door_type: prev.active_door_type 
        }));
      }
      
      // אם בחרו כנף רפפה, עובר לשלב בחירת סוג רפפה
      if (formData.active_door_type === "כנף רפפה") {
        setCurrentStep(5);
        return;
      }
      
      // אחרת, עובר לשלב מידות וכיוון משולב
      setCurrentStep(6);
    } else if (currentStep === 5) {
      // בחירת סוג רפפה לכנף פעילה
      if (!formData.active_louvre_type) {
        toast({
          title: "שגיאה",
          description: "נא לבחור סוג כנף רפפה",
          variant: "destructive",
        });
        return;
      }
      
      // אם כנף וחצי, מעתיק אוטומטית את סוג הרפפה לכנף הקבועה
      if (isOneAndHalf) {
        setFormData(prev => ({ 
          ...prev, 
          fixed_louvre_type: prev.active_louvre_type 
        }));
      }
      
      // עובר לשלב מידות וכיוון משולב
      setCurrentStep(6);
    } else if (currentStep === 6) {
      // שלב משולב: רוחב, גובה, כיוון
      
      // בדיקת כנף פעילה
      if (!formData.active_door_width || parseInt(formData.active_door_width) <= 0) {
        toast({
          title: "שגיאה",
          description: "נא להזין רוחב כנף פעילה תקין במילימטרים",
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.active_door_height || parseInt(formData.active_door_height) <= 0) {
        toast({
          title: "שגיאה",
          description: "נא להזין גובה כנף פעילה תקין במילימטרים",
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.active_door_direction) {
        toast({
          title: "שגיאה",
          description: isOneAndHalf ? "נא לבחור כיוון כנף פעילה" : "נא לבחור כיוון",
          variant: "destructive",
        });
        return;
      }
      
      if (!formData.opening_direction) {
        toast({
          title: "שגיאה",
          description: "נא לבחור כיוון פתיחה (פנים/חוץ)",
          variant: "destructive",
        });
        return;
      }
      
      // בדיקת כנף קבועה (אם כנף וחצי)
      if (isOneAndHalf) {
        if (!formData.fixed_door_width || parseInt(formData.fixed_door_width) <= 0) {
          toast({
            title: "שגיאה",
            description: "נא להזין רוחב כנף קבועה תקין במילימטרים",
            variant: "destructive",
          });
          return;
        }
        
        if (!formData.fixed_door_height || parseInt(formData.fixed_door_height) <= 0) {
          toast({
            title: "שגיאה",
            description: "נא להזין גובה כנף קבועה תקין במילימטרים",
            variant: "destructive",
          });
          return;
        }
        
        if (!formData.fixed_door_direction) {
          toast({
            title: "שגיאה",
            description: "נא לבחור כיוון כנף קבועה",
            variant: "destructive",
          });
          return;
        }
      }
      
      // סיום - שמירת ההזמנה
      await saveSubOrder();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === 8) {
      // חזרה משלב אינסרט לבחירת מוצר
      setCurrentStep(2);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleNextStep();
  };

  const saveSubOrder = async () => {
    if (!activeGroup) {
      toast({
        title: "שגיאה",
        description: "לא נמצאה קבוצת הזמנות פעילה",
        variant: "destructive",
      });
      return;
    }

    try {
      // Get the next sub number
      const { data: lastSubOrder } = await supabase
        .from("sub_orders")
        .select("sub_number")
        .eq("order_group_id", activeGroup.id)
        .order("sub_number", { ascending: false })
        .limit(1);

      const nextSubNumber = lastSubOrder && lastSubOrder.length > 0 
        ? lastSubOrder[0].sub_number + 1 
        : 1;

      const fullOrderNumber = `${activeGroup.group_number}-${nextSubNumber}`;

      // Insert the sub-order
      const { error } = await supabase.from("sub_orders").insert({
        order_group_id: activeGroup.id,
        sub_number: nextSubNumber,
        full_order_number: fullOrderNumber,
        partner_type: partnerType,
        partner_name: formData.customer_name,
        product_category: formData.product_category,
        active_door_type: formData.active_door_type || null,
        fixed_door_type: formData.fixed_door_type || null,
        active_louvre_type: formData.active_louvre_type || null,
        fixed_louvre_type: formData.fixed_louvre_type || null,
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
      });

      if (error) throw error;

      toast({
        title: "תת-הזמנה נשמרה בהצלחה!",
        description: `הזמנה מספר ${fullOrderNumber} נוספה`,
      });

      resetForm();
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Error saving sub-order:", error);
      toast({
        title: "שגיאה",
        description: "לא הצלחנו לשמור את תת-ההזמנה",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      customer_name: "",
      product_category: "",
      active_door_type: "",
      fixed_door_type: "",
      active_louvre_type: "",
      fixed_louvre_type: "",
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
    });
    setPartnerType("supplier");
    setCurrentStep(1);
    localStorage.removeItem("order_draft");
    setHasDraft(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] flex flex-col" dir="rtl">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl font-bold flex items-center justify-between">
            <span>פתיחת הזמנה חדשה - שלב {currentStep} מתוך 7</span>
            <span className="text-primary">{nextOrderNumber}</span>
          </DialogTitle>
        </DialogHeader>

        {hasDraft && currentStep === 1 && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 space-y-3 flex-shrink-0">
            <p className="font-semibold text-blue-900">נמצאה טיוטה שמורה</p>
            <div className="flex gap-2">
              <Button type="button" variant="default" onClick={loadDraft} className="flex-1">
                המשך מהטיוטה
              </Button>
              <Button type="button" variant="outline" onClick={deleteDraft}>
                התחל מחדש
              </Button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-y-auto">
          {currentStep === 1 && (
            <div className="flex-1 flex flex-col justify-between p-4">
              {/* Partner Selection */}
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg border-2 border-primary/20">
                <div className="space-y-3">
                  <Label className="text-base font-semibold">בחר ספק / משווק *</Label>
                  <RadioGroup
                    value={partnerType}
                    onValueChange={(value: "supplier" | "marketer") => {
                      setPartnerType(value);
                      setFormData({ ...formData, customer_name: "" });
                    }}
                    className="flex flex-row-reverse gap-8 justify-end"
                    dir="rtl"
                  >
                    <div className="flex items-center gap-2">
                      <Label htmlFor="marketer" className="cursor-pointer font-normal">משווק</Label>
                      <RadioGroupItem value="marketer" id="marketer" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="supplier" className="cursor-pointer font-normal">ספק</Label>
                      <RadioGroupItem value="supplier" id="supplier" />
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customer_name">
                    {partnerType === "supplier" ? "בחר ספק" : "בחר משווק"} *
                  </Label>
                  <Select
                    value={formData.customer_name}
                    onValueChange={(value) =>
                      setFormData({ ...formData, customer_name: value })
                    }
                  >
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder={partnerType === "supplier" ? "בחר ספק מהרשימה" : "בחר משווק מהרשימה"} />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {(partnerType === "supplier" ? suppliers : marketers).map((partner) => (
                        <SelectItem key={partner.id} value={partner.name}>
                          {partner.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end mt-6">
                <Button type="button" variant="ghost" onClick={saveDraft}>
                  שמור כטיוטה
                </Button>
                <Button type="button" variant="outline" onClick={onClose}>
                  ביטול
                </Button>
                <Button type="submit">המשך</Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="p-4 space-y-4">
              {/* Product Category Selection */}
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg border-2 border-primary/20">
                <Label className="text-base font-semibold">בחר מוצר *</Label>
                <RadioGroup
                  value={formData.product_category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, product_category: value, active_door_type: "", fixed_door_type: "", active_louvre_type: "", fixed_louvre_type: "" })
                  }
                  className="grid grid-cols-2 gap-3"
                >
                  {PRODUCT_CATEGORIES.map((category) => (
                    <div
                      key={category}
                      className="flex items-center gap-3 p-3 border-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setFormData({ ...formData, product_category: category, active_door_type: "", fixed_door_type: "", active_louvre_type: "", fixed_louvre_type: "" })}
                    >
                      <RadioGroupItem value={category} id={category} />
                      <Label htmlFor={category} className="cursor-pointer font-normal flex-1 text-sm">
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
                  <Button type="button" variant="ghost" onClick={saveDraft}>
                    שמור כטיוטה
                  </Button>
                  <Button type="button" variant="outline" onClick={onClose}>
                    ביטול
                  </Button>
                  <Button type="submit">המשך</Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <>
              {/* Door Type Selection - Active Door or Single Door */}
              <div className="space-y-4 p-6 bg-muted/30 rounded-lg border-2 border-primary/20">
                <Label className="text-base font-semibold">
                  {formData.product_category.includes("כנף וחצי") ? "בחר סוג כנף (הכנף הקבועה תהיה זהה) *" : "בחר סוג כנף *"}
                </Label>
                <RadioGroup
                  value={formData.active_door_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, active_door_type: value, active_louvre_type: "", fixed_door_type: formData.product_category.includes("כנף וחצי") ? value : "" })
                  }
                  className="grid grid-cols-1 gap-3"
                >
                  {DOOR_TYPES.map((type) => (
                    <div
                      key={type}
                      className="flex items-center gap-3 p-4 border-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setFormData({ ...formData, active_door_type: type, active_louvre_type: "", fixed_door_type: formData.product_category.includes("כנף וחצי") ? type : "" })}
                    >
                      <RadioGroupItem value={type} id={`active-${type}`} />
                      <Label htmlFor={`active-${type}`} className="cursor-pointer font-normal flex-1">
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
                  <Button type="button" variant="ghost" onClick={saveDraft}>
                    שמור כטיוטה
                  </Button>
                  <Button type="button" variant="outline" onClick={onClose}>
                    ביטול
                  </Button>
                  <Button type="submit">המשך</Button>
                </div>
              </div>
            </>
          )}

          {currentStep === 4 && (
            <>
              {/* Fixed Door Type Selection - Only for כנף וחצי */}
              <div className="space-y-4 p-6 bg-muted/30 rounded-lg border-2 border-primary/20">
                <Label className="text-base font-semibold">בחר סוג כנף קבועה *</Label>
                <RadioGroup
                  value={formData.fixed_door_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, fixed_door_type: value, fixed_louvre_type: "" })
                  }
                  className="grid grid-cols-1 gap-3"
                >
                  {DOOR_TYPES.map((type) => (
                    <div
                      key={type}
                      className="flex items-center gap-3 p-4 border-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setFormData({ ...formData, fixed_door_type: type, fixed_louvre_type: "" })}
                    >
                      <RadioGroupItem value={type} id={`fixed-${type}`} />
                      <Label htmlFor={`fixed-${type}`} className="cursor-pointer font-normal flex-1">
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
                  <Button type="button" variant="ghost" onClick={saveDraft}>
                    שמור כטיוטה
                  </Button>
                  <Button type="button" variant="outline" onClick={onClose}>
                    ביטול
                  </Button>
                  <Button type="submit">המשך</Button>
                </div>
              </div>
            </>
          )}

          {currentStep === 5 && (
            <>
              {/* Active Louvre Door Type Selection */}
              <div className="space-y-4 p-6 bg-muted/30 rounded-lg border-2 border-primary/20">
                <Label className="text-base font-semibold">
                  {formData.product_category.includes("כנף וחצי") ? "בחר סוג כנף רפפה (הכנף הקבועה תהיה זהה) *" : "בחר סוג כנף רפפה *"}
                </Label>
                <RadioGroup
                  value={formData.active_louvre_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, active_louvre_type: value, fixed_louvre_type: formData.product_category.includes("כנף וחצי") ? value : "" })
                  }
                  className="grid grid-cols-1 gap-3"
                >
                  {LOUVRE_DOOR_TYPES.map((type) => (
                    <div
                      key={type}
                      className="flex items-center gap-3 p-4 border-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setFormData({ ...formData, active_louvre_type: type, fixed_louvre_type: formData.product_category.includes("כנף וחצי") ? type : "" })}
                    >
                      <RadioGroupItem value={type} id={`active-louvre-${type}`} />
                      <Label htmlFor={`active-louvre-${type}`} className="cursor-pointer font-normal flex-1">
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
                  <Button type="button" variant="ghost" onClick={saveDraft}>
                    שמור כטיוטה
                  </Button>
                  <Button type="button" variant="outline" onClick={onClose}>
                    ביטול
                  </Button>
                  <Button type="submit">המשך</Button>
                </div>
              </div>
            </>
          )}

          {currentStep === 7 && (
            <>
              {/* Fixed Louvre Door Type Selection */}
              <div className="space-y-4 p-6 bg-muted/30 rounded-lg border-2 border-primary/20">
                <Label className="text-base font-semibold">בחר סוג כנף רפפה קבועה *</Label>
                <RadioGroup
                  value={formData.fixed_louvre_type}
                  onValueChange={(value) =>
                    setFormData({ ...formData, fixed_louvre_type: value })
                  }
                  className="grid grid-cols-1 gap-3"
                >
                  {LOUVRE_DOOR_TYPES.map((type) => (
                    <div
                      key={type}
                      className="flex items-center gap-3 p-4 border-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setFormData({ ...formData, fixed_louvre_type: type })}
                    >
                      <RadioGroupItem value={type} id={`fixed-louvre-${type}`} />
                      <Label htmlFor={`fixed-louvre-${type}`} className="cursor-pointer font-normal flex-1">
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
                  <Button type="button" variant="ghost" onClick={saveDraft}>
                    שמור כטיוטה
                  </Button>
                  <Button type="button" variant="outline" onClick={onClose}>
                    ביטול
                  </Button>
                  <Button type="submit">המשך</Button>
                </div>
              </div>
            </>
          )}

          {currentStep === 6 && (
            <div className="p-4 space-y-4">
              {/* Combined Dimensions & Direction */}
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg border-2 border-primary/20">
                {formData.product_category.includes("כנף וחצי") ? (
                  <>
                    {/* כנף פעילה */}
                    <div className="pb-4 border-b-2 border-primary/20">
                      <h3 className="text-lg font-bold text-primary mb-3">כנף פעילה</h3>
                      
                      <div className="grid grid-cols-4 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="active-width" className="text-sm">רוחב (מ"מ) *</Label>
                          <Input
                            id="active-width"
                            type="number"
                            value={formData.active_door_width}
                            onChange={(e) => setFormData({ ...formData, active_door_width: e.target.value })}
                            placeholder="רוחב"
                            className="text-right w-24"
                            dir="rtl"
                            min="1"
                            max="9999"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="active-height" className="text-sm">גובה (מ"מ) *</Label>
                          <Input
                            id="active-height"
                            type="number"
                            value={formData.active_door_height}
                            onChange={(e) => setFormData({ ...formData, active_door_height: e.target.value })}
                            placeholder="גובה"
                            className="text-right w-24"
                            dir="rtl"
                            min="1"
                            max="9999"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm">כיוון *</Label>
                          <RadioGroup
                            value={formData.active_door_direction}
                            onValueChange={(value) =>
                              setFormData({ ...formData, active_door_direction: value })
                            }
                            className="flex gap-4 justify-center h-10 items-center"
                            dir="rtl"
                          >
                            <div className="flex items-center gap-2">
                              <Label htmlFor="active-right-combined" className="cursor-pointer font-normal">
                                R
                              </Label>
                              <RadioGroupItem value="ימין" id="active-right-combined" />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label htmlFor="active-left-combined" className="cursor-pointer font-normal">
                                L
                              </Label>
                              <RadioGroupItem value="שמאל" id="active-left-combined" />
                            </div>
                          </RadioGroup>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm">פתיחה *</Label>
                          <RadioGroup
                            value={formData.opening_direction}
                            onValueChange={(value) =>
                              setFormData({ ...formData, opening_direction: value })
                            }
                            className="flex gap-2 justify-center h-10 items-center"
                            dir="rtl"
                          >
                            <div className="flex items-center gap-1">
                              <Label htmlFor="outside" className="cursor-pointer font-normal text-sm">
                                חוץ
                              </Label>
                              <RadioGroupItem value="חוץ" id="outside" />
                            </div>
                            <div className="flex items-center gap-1">
                              <Label htmlFor="inside" className="cursor-pointer font-normal text-sm">
                                פנים
                              </Label>
                              <RadioGroupItem value="פנים" id="inside" />
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>

                    {/* כנף קבועה */}
                    <div>
                      <h3 className="text-lg font-bold text-primary mb-3">כנף קבועה</h3>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="fixed-width" className="text-sm">רוחב (מ"מ) *</Label>
                          <Input
                            id="fixed-width"
                            type="number"
                            value={formData.fixed_door_width}
                            onChange={(e) => setFormData({ ...formData, fixed_door_width: e.target.value })}
                            placeholder="רוחב"
                            className="text-right w-24"
                            dir="rtl"
                            min="1"
                            max="9999"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="fixed-height" className="text-sm">גובה (מ"מ) *</Label>
                          <Input
                            id="fixed-height"
                            type="number"
                            value={formData.fixed_door_height}
                            onChange={(e) => setFormData({ ...formData, fixed_door_height: e.target.value })}
                            placeholder="גובה"
                            className="text-right w-24"
                            dir="rtl"
                            min="1"
                            max="9999"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label className="text-sm">כיוון *</Label>
                          <RadioGroup
                            value={formData.fixed_door_direction}
                            onValueChange={(value) =>
                              setFormData({ ...formData, fixed_door_direction: value })
                            }
                            className="flex gap-4 justify-center h-10 items-center"
                            dir="rtl"
                          >
                            <div className="flex items-center gap-2">
                              <Label htmlFor="fixed-right-combined" className="cursor-pointer font-normal">
                                R
                              </Label>
                              <RadioGroupItem value="ימין" id="fixed-right-combined" />
                            </div>
                            <div className="flex items-center gap-2">
                              <Label htmlFor="fixed-left-combined" className="cursor-pointer font-normal">
                                L
                              </Label>
                              <RadioGroupItem value="שמאל" id="fixed-left-combined" />
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* כנף בודדת */}
                    <div className="grid grid-cols-4 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="single-width" className="text-sm">רוחב (מ"מ) *</Label>
                        <Input
                          id="single-width"
                          type="number"
                          value={formData.active_door_width}
                          onChange={(e) => setFormData({ ...formData, active_door_width: e.target.value })}
                          placeholder="רוחב"
                          className="text-right w-24"
                          dir="rtl"
                          min="1"
                          max="9999"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="single-height" className="text-sm">גובה (מ"מ) *</Label>
                        <Input
                          id="single-height"
                          type="number"
                          value={formData.active_door_height}
                          onChange={(e) => setFormData({ ...formData, active_door_height: e.target.value })}
                          placeholder="גובה"
                          className="text-right w-24"
                          dir="rtl"
                          min="1"
                          max="9999"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">כיוון *</Label>
                        <RadioGroup
                          value={formData.active_door_direction}
                          onValueChange={(value) =>
                            setFormData({ ...formData, active_door_direction: value })
                          }
                          className="flex gap-4 justify-center h-10 items-center"
                          dir="rtl"
                        >
                          <div className="flex items-center gap-2">
                            <Label htmlFor="single-right-combined" className="cursor-pointer font-normal">
                              R
                            </Label>
                            <RadioGroupItem value="ימין" id="single-right-combined" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label htmlFor="single-left-combined" className="cursor-pointer font-normal">
                              L
                            </Label>
                            <RadioGroupItem value="שמאל" id="single-left-combined" />
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">פתיחה *</Label>
                        <RadioGroup
                          value={formData.opening_direction}
                          onValueChange={(value) =>
                            setFormData({ ...formData, opening_direction: value })
                          }
                          className="flex gap-2 justify-center h-10 items-center"
                          dir="rtl"
                        >
                          <div className="flex items-center gap-1">
                            <Label htmlFor="single-outside" className="cursor-pointer font-normal text-sm">
                              חוץ
                            </Label>
                            <RadioGroupItem value="חוץ" id="single-outside" />
                          </div>
                          <div className="flex items-center gap-1">
                            <Label htmlFor="single-inside" className="cursor-pointer font-normal text-sm">
                              פנים
                            </Label>
                            <RadioGroupItem value="פנים" id="single-inside" />
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-between">
                <Button type="button" variant="outline" onClick={handlePreviousStep}>
                  חזור
                </Button>
                <div className="flex gap-3">
                  <Button type="button" variant="ghost" onClick={saveDraft}>
                    שמור כטיוטה
                  </Button>
                  <Button type="button" variant="outline" onClick={onClose}>
                    ביטול
                  </Button>
                  <Button type="submit">סיום</Button>
                </div>
              </div>
            </div>
          )}

          {currentStep === 8 && (
            <div className="p-4 space-y-4">
              {/* Insert Selection */}
              <div className="space-y-4 p-4 bg-muted/30 rounded-lg border-2 border-primary/20">
                <h3 className="text-lg font-bold text-primary">פרטי אינסרט</h3>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="insert-width" className="text-sm">רוחב (מ"מ) *</Label>
                    <Input
                      id="insert-width"
                      type="number"
                      value={formData.insert_width}
                      onChange={(e) => setFormData({ ...formData, insert_width: e.target.value })}
                      placeholder="רוחב"
                      className="text-right w-24"
                      dir="rtl"
                      min="1"
                      max="9999"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="insert-height" className="text-sm">גובה (מ"מ) *</Label>
                    <Input
                      id="insert-height"
                      type="number"
                      value={formData.insert_height}
                      onChange={(e) => setFormData({ ...formData, insert_height: e.target.value })}
                      placeholder="גובה"
                      className="text-right w-24"
                      dir="rtl"
                      min="1"
                      max="9999"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="insert-color-1">צבע *</Label>
                    <Select
                      value={formData.insert_color_1}
                      onValueChange={(value) =>
                        setFormData({ ...formData, insert_color_1: value })
                      }
                    >
                      <SelectTrigger id="insert-color-1" className="bg-background">
                        <SelectValue placeholder="בחר צבע" />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        {INSERT_COLORS.map((color) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insert-color-2">צבע שני (אופציונלי)</Label>
                  <Select
                    value={formData.insert_color_2}
                    onValueChange={(value) =>
                      setFormData({ ...formData, insert_color_2: value })
                    }
                  >
                    <SelectTrigger id="insert-color-2" className="bg-background">
                      <SelectValue placeholder="בחר צבע שני (לא חובה)" />
                    </SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      <SelectItem value="">ללא צבע שני</SelectItem>
                      {INSERT_COLORS.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-between">
                <Button type="button" variant="outline" onClick={handlePreviousStep}>
                  חזור
                </Button>
                <div className="flex gap-3">
                  <Button type="button" variant="ghost" onClick={saveDraft}>
                    שמור כטיוטה
                  </Button>
                  <Button type="button" variant="outline" onClick={onClose}>
                    ביטול
                  </Button>
                  <Button type="submit">סיום</Button>
                </div>
              </div>
            </div>
          )}

        </form>
      </DialogContent>
    </Dialog>
  );
};
