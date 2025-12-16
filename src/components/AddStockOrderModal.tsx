import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface AddStockOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DRILLING_OPTIONS = ['100+', '100-', 'HOSEM', 'KATIF', 'RESHAFIM'];
const COLOR_OPTIONS = ['9016t', '9001t', '7126d', '0096d', 'mr09'];

export const AddStockOrderModal = ({ isOpen, onClose, onSuccess }: AddStockOrderModalProps) => {
  const [partnerType, setPartnerType] = useState<'supplier' | 'contractor'>('contractor');
  const [partnerName, setPartnerName] = useState('');
  const [wingWidth, setWingWidth] = useState('');
  const [direction, setDirection] = useState<'R' | 'L'>('R');
  const [wingHeight, setWingHeight] = useState('');
  const [drilling, setDrilling] = useState('');
  const [doorColor, setDoorColor] = useState('');
  const [constructionFrame, setConstructionFrame] = useState('');
  const [frameHeight, setFrameHeight] = useState('');
  const [coverFrame, setCoverFrame] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [price, setPrice] = useState('');
  const [installerPrice, setInstallerPrice] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: contractors = [] } = useQuery({
    queryKey: ['contractors-active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contractors')
        .select('*')
        .eq('active', 'פעיל');
      if (error) throw error;
      return data;
    }
  });

  const { data: suppliers = [] } = useQuery({
    queryKey: ['suppliers-active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .eq('active', 'פעיל');
      if (error) throw error;
      return data;
    }
  });

  const partners = partnerType === 'contractor' ? contractors : suppliers;

  const resetForm = () => {
    setPartnerType('contractor');
    setPartnerName('');
    setWingWidth('');
    setDirection('R');
    setWingHeight('');
    setDrilling('');
    setDoorColor('');
    setConstructionFrame('');
    setFrameHeight('');
    setCoverFrame('');
    setQuantity('1');
    setPrice('');
    setInstallerPrice('');
    setNotes('');
  };

  const handleSubmit = async () => {
    if (!partnerName) {
      toast.error('יש לבחור שותף');
      return;
    }

    setIsSubmitting(true);
    try {
      // Get next row number
      const { data: existingOrders } = await supabase
        .from('stock_orders')
        .select('row_number')
        .order('row_number', { ascending: false })
        .limit(1);

      const nextRowNumber = existingOrders && existingOrders.length > 0 
        ? existingOrders[0].row_number + 1 
        : 1;

      const { error } = await supabase
        .from('stock_orders')
        .insert({
          row_number: nextRowNumber,
          partner_type: partnerType === 'contractor' ? 'משווק' : 'ספק',
          partner_name: partnerName,
          wing_width: wingWidth ? parseFloat(wingWidth) : null,
          direction: direction,
          wing_height: wingHeight ? parseFloat(wingHeight) : null,
          drilling: drilling || null,
          door_color: doorColor || null,
          construction_frame: constructionFrame || null,
          frame_height: frameHeight ? parseFloat(frameHeight) : null,
          cover_frame: coverFrame || null,
          quantity: parseInt(quantity) || 1,
          price: parseFloat(price) || 0,
          installer_price: parseFloat(installerPrice) || 0,
          notes: notes || null
        });

      if (error) throw error;

      toast.success('ההזמנה נוספה בהצלחה');
      resetForm();
      onSuccess();
    } catch (error) {
      console.error('Error adding stock order:', error);
      toast.error('שגיאה בהוספת ההזמנה');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle>הזמנה חדשה</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>סוג שותף</Label>
            <RadioGroup
              value={partnerType}
              onValueChange={(v) => {
                setPartnerType(v as 'supplier' | 'contractor');
                setPartnerName('');
              }}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="contractor" id="contractor" />
                <Label htmlFor="contractor">משווק</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="supplier" id="supplier" />
                <Label htmlFor="supplier">ספק</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>שם השותף</Label>
            <Select value={partnerName} onValueChange={setPartnerName}>
              <SelectTrigger>
                <SelectValue placeholder="בחר שותף" />
              </SelectTrigger>
              <SelectContent>
                {partners.map((p) => (
                  <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>רוחב כנף (מ"מ)</Label>
              <Input
                type="number"
                value={wingWidth}
                onChange={(e) => setWingWidth(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>גובה כנף (מ"מ)</Label>
              <Input
                type="number"
                value={wingHeight}
                onChange={(e) => setWingHeight(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>כיוון (R/L)</Label>
            <RadioGroup
              value={direction}
              onValueChange={(v) => setDirection(v as 'R' | 'L')}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="R" id="dir-r" />
                <Label htmlFor="dir-r">R (ימין)</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="L" id="dir-l" />
                <Label htmlFor="dir-l">L (שמאל)</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ניקוב</Label>
              <Select value={drilling} onValueChange={setDrilling}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר ניקוב" />
                </SelectTrigger>
                <SelectContent>
                  {DRILLING_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>צבע הדלת</Label>
              <Select value={doorColor} onValueChange={setDoorColor}>
                <SelectTrigger>
                  <SelectValue placeholder="בחר צבע" />
                </SelectTrigger>
                <SelectContent>
                  {COLOR_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>משקוף בנייה</Label>
              <Input
                value={constructionFrame}
                onChange={(e) => setConstructionFrame(e.target.value)}
                placeholder="כן/לא או מידות"
              />
            </div>
            <div className="space-y-2">
              <Label>גובה משקוף (מ"מ)</Label>
              <Input
                type="number"
                value={frameHeight}
                onChange={(e) => setFrameHeight(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>משקוף כיסוי</Label>
            <Input
              value={coverFrame}
              onChange={(e) => setCoverFrame(e.target.value)}
              placeholder="כן/לא או מידות"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>כמות</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
              />
            </div>
            <div className="space-y-2">
              <Label>מחיר (₪)</Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>מחיר מתקין (₪)</Label>
              <Input
                type="number"
                value={installerPrice}
                onChange={(e) => setInstallerPrice(e.target.value)}
                placeholder="0"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>הערות</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="הערות נוספות..."
            />
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={onClose}>ביטול</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'שומר...' : 'שמור הזמנה'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
