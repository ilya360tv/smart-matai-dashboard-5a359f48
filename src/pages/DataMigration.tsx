import { DashboardSidebar } from "@/components/DashboardSidebar";
import { DataMigrationForm } from "@/components/DataMigrationForm";

export default function DataMigration() {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">ייבוא נתונים</h1>
            <p className="text-muted-foreground mt-2">
              ייבא נתונים מקבצי Excel לטבלאות המערכת
            </p>
          </div>
          <DataMigrationForm />
        </div>
      </main>
    </div>
  );
}
