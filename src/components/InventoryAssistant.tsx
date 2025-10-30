import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Brain, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  customerPrice: number;
  supplier: string;
  side: string;
  status: string;
}

interface InventoryAssistantProps {
  products: Product[];
}

export const InventoryAssistant = ({ products }: InventoryAssistantProps) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) {
      toast({
        title: "שגיאה",
        description: "אנא הזן שאלה",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setAnswer("");

    try {
      const { data, error } = await supabase.functions.invoke("inventory-assistant", {
        body: { 
          question: question.trim(),
          inventory: products 
        },
      });

      if (error) {
        if (error.message?.includes("429")) {
          toast({
            title: "המערכת עמוסה",
            description: "אנא נסה שוב בעוד מספר רגעים",
            variant: "destructive",
          });
        } else if (error.message?.includes("402")) {
          toast({
            title: "שירות ה-AI הגיע למגבלה",
            description: "אנא פנה למנהל המערכת",
            variant: "destructive",
          });
        } else {
          throw error;
        }
        return;
      }

      if (data?.answer) {
        setAnswer(data.answer);
      } else {
        throw new Error("לא התקבלה תשובה מהשרת");
      }
    } catch (error) {
      console.error("Error asking assistant:", error);
      toast({
        title: "שגיאה",
        description: "לא הצלחנו לענות על השאלה. אנא נסה שוב.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isLoading) {
      handleAsk();
    }
  };

  return (
    <Card className="shadow-lg border-primary/20">
      <CardHeader className="bg-gradient-to-l from-primary/5 to-transparent">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Brain className="h-6 w-6 text-primary" />
          עוזר חכם לשאילתות מלאי
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-6">
        <div className="flex gap-2">
          <Input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="שאל שאלה על המלאי... (לדוגמה: 'כמה סחורה יש לי במלאי?')"
            disabled={isLoading}
            className="h-11 flex-1"
          />
          <Button
            onClick={handleAsk}
            disabled={isLoading || !question.trim()}
            className="gap-2 h-11 px-6"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                מעבד...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                שאל
              </>
            )}
          </Button>
        </div>

        {answer && (
          <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-start gap-3">
              <div className="rounded-full bg-primary/10 p-2 mt-1">
                <Brain className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-1">תשובה:</p>
                <p className="text-base leading-relaxed whitespace-pre-wrap">{answer}</p>
              </div>
            </div>
          </div>
        )}

        {!answer && !isLoading && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <Brain className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p>שאל שאלה כלשהי על המלאי והעוזר החכם יענה לך</p>
            <p className="mt-2 text-xs">דוגמאות: "כמה סחורה יש לי?", "כמה פריטים מספק X?"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
