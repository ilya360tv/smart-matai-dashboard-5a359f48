import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import Suppliers from "./pages/Suppliers";
import Contractors from "./pages/Contractors";
import StockMovements from "./pages/StockMovements";
import Payments from "./pages/Payments";
import Customers from "./pages/Customers";
import PartnerProfile from "./pages/PartnerProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/stock-movements" element={<StockMovements />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/contractors" element={<Contractors />} />
          <Route path="/suppliers/:id" element={<PartnerProfile />} />
          <Route path="/customers" element={<Customers />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
