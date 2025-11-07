import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from "xlsx";
import { Upload, Database } from "lucide-react";

const TABLES = [
  { value: "doors_d100", label: "דלתות D100" },
  { value: "doors_d6", label: "דלתות D6" },
  { value: "doors_d7", label: "דלתות D7" },
  { value: "doors_d80", label: "דלתות D80" },
  { value: "doors_d82", label: "דלתות D82" },
  { value: "doors_d88", label: "דלתות D88" },
  { value: "doors_d_rhk", label: "דלתות D-RHK" },
  { value: "frame_heads_130", label: "ראשי מסגרת 130" },
  { value: "frame_heads_240", label: "ראשי מסגרת 240" },
  { value: "frame_legs_130", label: "רגלי מסגרת 130" },
  { value: "frame_legs_240", label: "רגלי מסגרת 240" },
  { value: "hardware_inventory", label: "מלאי פירזול" },
  { value: "inserts_150", label: "תוספות 150" },
  { value: "locking_products_inventory", label: "מוצרי נעילה" },
  { value: "pull_handles_inventory", label: "ידיות משיכה" },
  { value: "orders", label: "הזמנות" },
];

export function DataMigrationForm() {
  const [selectedTable, setSelectedTable] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file || !selectedTable) {
      toast({
        title: "שגיאה",
        description: "יש לבחור קובץ וטבלה",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        toast({
          title: "שגיאה",
          description: "הקובץ ריק",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Insert data in batches of 100
      const batchSize = 100;
      let successCount = 0;
      let errorCount = 0;

      for (let i = 0; i < jsonData.length; i += batchSize) {
        const batch = jsonData.slice(i, i + batchSize);
        const { error } = await supabase.from(selectedTable as any).insert(batch as any);

        if (error) {
          console.error("Error inserting batch:", error);
          errorCount += batch.length;
        } else {
          successCount += batch.length;
        }
      }

      toast({
        title: "ייבוא הושלם",
        description: `יובאו ${successCount} רשומות בהצלחה${errorCount > 0 ? `, ${errorCount} נכשלו` : ""}`,
      });

      setFile(null);
      setSelectedTable("");
      // Reset file input
      const fileInput = document.getElementById("file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "שגיאה בייבוא",
        description: error instanceof Error ? error.message : "אירעה שגיאה בייבוא הנתונים",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          ייבוא נתונים לטבלאות
        </CardTitle>
        <CardDescription>
          העלה קובץ Excel או CSV עם הנתונים לייבוא לטבלה הרצויה
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="table-select">בחר טבלה</Label>
          <Select value={selectedTable} onValueChange={setSelectedTable}>
            <SelectTrigger id="table-select">
              <SelectValue placeholder="בחר טבלה לייבוא" />
            </SelectTrigger>
            <SelectContent>
              {TABLES.map((table) => (
                <SelectItem key={table.value} value={table.value}>
                  {table.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="file-input">בחר קובץ</Label>
          <Input
            id="file-input"
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            disabled={!selectedTable}
          />
          {file && (
            <p className="text-sm text-muted-foreground">
              קובץ נבחר: {file.name}
            </p>
          )}
        </div>

        <Button
          onClick={handleImport}
          disabled={!file || !selectedTable || isLoading}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          {isLoading ? "מייבא..." : "ייבא נתונים"}
        </Button>

        <div className="text-sm text-muted-foreground space-y-1 bg-muted p-4 rounded-lg">
          <p className="font-semibold">הערות חשובות:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>שמות העמודות בקובץ חייבים להתאים לשמות השדות בטבלה</li>
            <li>הנתונים יתווספו לטבלה הקיימת (לא יימחקו נתונים קיימים)</li>
            <li>הייבוא מתבצע במנות של 100 רשומות בכל פעם</li>
            <li>מומלץ לגבות את הנתונים לפני ביצוע ייבוא</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
