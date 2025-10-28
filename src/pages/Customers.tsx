import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";

const Customers = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to unified suppliers/customers page
    navigate("/suppliers");
  }, [navigate]);

  return (
    <div className="flex h-screen w-full">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
          <h1 className="text-xl font-bold">מעביר לדף ניהול עסקים...</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">
            <p className="text-muted-foreground">מעביר לדף ניהול ספקים / לקוחות עסקיים...</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Customers;
