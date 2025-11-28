import { Package, Users, Building2, Menu, Home, History, DollarSign, Receipt, ShoppingCart, Database } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const menuItems = [
  { icon: Home, label: "דף הבית", href: "/" },
  { icon: Package, label: "מלאי", href: "/inventory" },
  { icon: ShoppingCart, label: "הזמנות", href: "/orders" },
  { icon: History, label: "תנועות מלאי", href: "/stock-movements" },
  { icon: DollarSign, label: "תשלומי לקוחות", href: "/customer-payments" },
  { icon: Receipt, label: "תשלומי ספקים", href: "/supplier-payments" },
  { icon: Building2, label: "ספקים", href: "/suppliers" },
  { icon: Users, label: "משווקים", href: "/contractors" },
  { icon: Database, label: "ייבוא נתונים", href: "/data-migration" },
];

export const DashboardSidebar = () => {
  const location = useLocation();
  
  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-2">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <h2 className="text-lg font-semibold">תפריט ניווט</h2>
      </div>
      <nav className="flex-1 space-y-1 px-2 lg:px-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.label}
              to={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-foreground hover:bg-accent"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64 p-0 [&>button]:left-4 [&>button]:right-auto">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-l bg-card">
        <SidebarContent />
      </aside>
    </>
  );
};
