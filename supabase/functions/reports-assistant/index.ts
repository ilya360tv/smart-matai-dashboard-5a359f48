import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    console.log("Received message:", message);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch data from database to provide context
    const [ordersData, subOrdersData, suppliersData, contractorsData] = await Promise.all([
      supabase.from("order_groups").select("*"),
      supabase.from("sub_orders").select("*"),
      supabase.from("suppliers").select("*"),
      supabase.from("contractors").select("*"),
    ]);

    // Count various statistics
    const activeOrders = ordersData.data?.filter((o) => o.status === "פעיל").length || 0;
    const closedOrders = ordersData.data?.filter((o) => o.status === "סגור").length || 0;
    const activeSubOrders = subOrdersData.data?.filter((o) => o.status === "פעיל").length || 0;
    const canceledSubOrders = subOrdersData.data?.filter((o) => o.status === "בוטל").length || 0;
    const activeSuppliers = suppliersData.data?.filter((s) => s.active === "פעיל").length || 0;
    const activeContractors = contractorsData.data?.filter((c) => c.active === "פעיל").length || 0;

    // Build context about the data
    const dataContext = `
מידע על מערכת ההזמנות:
- קבוצות הזמנות פעילות: ${activeOrders}
- קבוצות הזמנות סגורות: ${closedOrders}
- סך כל קבוצות הזמנות: ${ordersData.data?.length || 0}

- תתי-הזמנות פעילות: ${activeSubOrders}
- תתי-הזמנות שבוטלו: ${canceledSubOrders}
- סך כל תתי-הזמנות: ${subOrdersData.data?.length || 0}

- ספקים פעילים: ${activeSuppliers}
- סך כל הספקים: ${suppliersData.data?.length || 0}

- קבלנים פעילים: ${activeContractors}
- סך כל הקבלנים: ${contractorsData.data?.length || 0}

קטגוריות מוצרים אפשריות:
- כנף בודדת חלקה
- כנף עם משקוף בנייה
- כנף עם משקוף הלבשה
- כנף וחצי בודדת
- כנף וחצי משקוף בנייה/חובק
- כנף וחצי הלבשה
- רק משקוף בנייה
- רק משקוף הלבשה
- רק משקוף בנייה לכנף וחצי
- רק משקוף הלבשה לכנף וחצי
- אינסרט
`;

    const systemPrompt = `אתה עוזר חכם למערכת ניהול הזמנות של דלתות ומשקופים. 
אתה צריך לענות על שאלות על בסיס הנתונים הבאים:

${dataContext}

כשמשתמש שואל שאלה:
1. נתח את השאלה והבן מה הוא רוצה לדעת
2. השתמש בנתונים שסיפקתי כדי לענות באופן מדויק
3. תן תשובות קצרות וממוקדות בעברית
4. אם יש צורך בחישוב או השוואה, בצע אותו
5. אם השאלה לא קשורה לנתונים שיש לך, הסבר בנימוס שאתה יכול לעזור רק עם שאלות על ההזמנות, המלאי, הספקים והקבלנים

דוגמאות לשאלות אפשריות:
- "כמה הזמנות פעילות יש?"
- "מה הסטטוס של ההזמנות?"
- "כמה ספקים יש במערכת?"
- "תן לי סיכום מהיר של המערכת"

תמיד תן תשובה קצרה ומדויקת בעברית.`;

    console.log("Calling Lovable AI...");

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errorText);
      
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ 
            response: "מצטער, יש כרגע עומס רב במערכת. אנא נסה שוב בעוד מספר שניות." 
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ 
            response: "מצטער, יש בעיה במערכת ה-AI. אנא פנה למנהל המערכת." 
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      throw new Error(`AI Gateway error: ${aiResponse.status} ${errorText}`);
    }

    const aiData = await aiResponse.json();
    const responseText = aiData.choices?.[0]?.message?.content || "מצטער, לא הצלחתי להבין את השאלה.";

    console.log("AI Response:", responseText);

    return new Response(
      JSON.stringify({ response: responseText }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in reports-assistant:", error);
    return new Response(
      JSON.stringify({ 
        response: "מצטער, אירעה שגיאה. נסה שוב מאוחר יותר."
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
