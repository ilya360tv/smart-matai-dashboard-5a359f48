import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthGuard } from "@/components/AuthGuard";
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import Orders from "./pages/Orders";
import StockOrders from "./pages/StockOrders";
import Reports from "./pages/Reports";
import Suppliers from "./pages/Suppliers";
import Contractors from "./pages/Contractors";
import StockMovements from "./pages/StockMovements";
import CustomerPayments from "./pages/CustomerPayments";
import SupplierPayments from "./pages/SupplierPayments";
import Customers from "./pages/Customers";
import PartnerProfile from "./pages/PartnerProfile";
import DataMigration from "./pages/DataMigration";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<AuthGuard><Index /></AuthGuard>} />
          <Route path="/inventory" element={<AuthGuard><Inventory /></AuthGuard>} />
          <Route path="/stock-orders" element={<AuthGuard><StockOrders /></AuthGuard>} />
          <Route path="/orders" element={<AuthGuard><Orders /></AuthGuard>} />
          <Route path="/reports" element={<AuthGuard><Reports /></AuthGuard>} />
          <Route path="/stock-movements" element={<AuthGuard><StockMovements /></AuthGuard>} />
          <Route path="/customer-payments" element={<AuthGuard><CustomerPayments /></AuthGuard>} />
          <Route path="/supplier-payments" element={<AuthGuard><SupplierPayments /></AuthGuard>} />
          <Route path="/suppliers" element={<AuthGuard><Suppliers /></AuthGuard>} />
          <Route path="/contractors" element={<AuthGuard><Contractors /></AuthGuard>} />
          <Route path="/suppliers/:id" element={<AuthGuard><PartnerProfile /></AuthGuard>} />
          <Route path="/customers" element={<AuthGuard><Customers /></AuthGuard>} />
          <Route path="/data-migration" element={<AuthGuard><DataMigration /></AuthGuard>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
