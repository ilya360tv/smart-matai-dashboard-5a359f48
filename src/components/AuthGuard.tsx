import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Package } from "lucide-react";

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { loading } = useAuth(true);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background" dir="rtl">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/30 rounded-full animate-spin border-t-primary"></div>
            <Package className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
          </div>
          <p className="text-muted-foreground animate-pulse">מאמת הרשאות...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};