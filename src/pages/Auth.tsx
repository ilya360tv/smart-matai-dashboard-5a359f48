import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, Lock, Mail, Eye, EyeOff, Package } from "lucide-react";

const emailSchema = z.string().email("כתובת אימייל לא תקינה");
const passwordSchema = z.string().min(6, "הסיסמה חייבת להכיל לפחות 6 תווים");

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          navigate("/", { replace: true });
        }
        setCheckingSession(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/", { replace: true });
      }
      setCheckingSession(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateInputs = () => {
    try {
      emailSchema.parse(email);
    } catch {
      toast.error("כתובת אימייל לא תקינה");
      return false;
    }
    try {
      passwordSchema.parse(password);
    } catch {
      toast.error("הסיסמה חייבת להכיל לפחות 6 תווים");
      return false;
    }
    return true;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateInputs()) return;
    
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("אימייל או סיסמה שגויים");
          } else {
            toast.error(error.message);
          }
          return;
        }
        
        toast.success("התחברת בהצלחה!");
      } else {
        const redirectUrl = `${window.location.origin}/`;
        
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            emailRedirectTo: redirectUrl,
          },
        });

        if (error) {
          if (error.message.includes("User already registered")) {
            toast.error("משתמש כבר קיים עם אימייל זה");
          } else {
            toast.error(error.message);
          }
          return;
        }
        
        toast.success("נרשמת בהצלחה! בדוק את האימייל שלך לאישור");
      }
    } catch (error) {
      toast.error("שגיאה בלתי צפויה, נסה שוב");
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background" dir="rtl">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/30 rounded-full animate-spin border-t-primary"></div>
            <Package className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary" />
          </div>
          <p className="text-muted-foreground animate-pulse">טוען...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background p-4" dir="rtl">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <Card className="w-full max-w-md animate-scale-in relative backdrop-blur-sm bg-card/95 shadow-2xl border-border/50">
        <CardHeader className="space-y-4 text-center pb-2">
          {/* Logo/Icon */}
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
            <Package className="h-8 w-8 text-primary-foreground" />
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
              {isLogin ? "כניסה למערכת" : "הרשמה למערכת"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isLogin ? "הזן את פרטי ההתחברות שלך" : "צור חשבון חדש"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">אימייל</Label>
              <div className="relative group">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  disabled={loading}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">סיסמה</Label>
              <div className="relative group">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 pl-10 h-11 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  disabled={loading}
                  required
                  autoComplete={isLogin ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 text-base font-medium relative overflow-hidden group"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{isLogin ? "מתחבר..." : "נרשם..."}</span>
                </div>
              ) : (
                <span className="relative z-10">{isLogin ? "התחבר" : "הרשם"}</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/10 to-primary/0 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              disabled={loading}
            >
              {isLogin ? (
                <>אין לך חשבון? <span className="font-medium text-primary">הרשם עכשיו</span></>
              ) : (
                <>יש לך חשבון? <span className="font-medium text-primary">התחבר</span></>
              )}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;