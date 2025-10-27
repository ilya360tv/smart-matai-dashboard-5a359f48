import { DashboardSidebar } from "@/components/DashboardSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Customers = () => {
  return (
    <div className="flex h-screen w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <h1 className="text-xl font-bold">לקוחות</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">
            <Card>
              <CardHeader>
                <CardTitle>ניהול לקוחות</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">דף זה בבנייה - כאן יופיע ניהול לקוחות</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Customers;
