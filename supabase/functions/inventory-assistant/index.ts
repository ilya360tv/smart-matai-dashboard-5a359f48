import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question, inventory } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Prepare inventory summary for the AI
    const inventorySummary = inventory.map((item: any) => 
      `${item.name} - קטגוריה: ${item.category}, כמות: ${item.quantity}, מחיר: ${item.price}, מחיר ללקוח: ${item.customerPrice}, ספק: ${item.supplier}, צד: ${item.side}, סטטוס: ${item.status}`
    ).join("\n");

    const systemPrompt = `אתה עוזר חכם למלאי המדבר עברית בלבד. תפקידך לענות על שאלות לגבי המלאי בצורה ברורה וקצרה.

כללים חשובים:
1. ענה תמיד בעברית בלבד
2. תן תשובות קצרות וישירות
3. השתמש במספרים ובנתונים מהמלאי
4. אם לא מצאת מידע רלוונטי, אמר זאת בבירור
5. תן תשובה אנושית וידידותית

נתוני המלאי:
${inventorySummary}

סה"כ מוצרים במלאי: ${inventory.length}
סה"כ פריטים: ${inventory.reduce((sum: number, item: any) => sum + item.quantity, 0)}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: question }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "נסה שוב בעוד כמה רגעים - המערכת עמוסה" }), 
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "שירות ה-AI הגיע למגבלת השימוש" }), 
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || "לא הצלחתי לענות על השאלה";

    return new Response(
      JSON.stringify({ answer }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("inventory-assistant error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "אירעה שגיאה לא צפויה" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
