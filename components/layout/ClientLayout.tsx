"use client";

import { usePathname } from "next/navigation";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { SiteAssistant } from "@/components/chat/SiteAssistant";
import { SiteTracker } from "@/components/analytics/SiteTracker";
import { AuthProvider } from "@/lib/hooks/useAuth";

const SHELL_HIDDEN_PREFIXES = ["/admin", "/dashboard", "/login", "/register", "/verify"];

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideShell = SHELL_HIDDEN_PREFIXES.some((p) => pathname?.startsWith(p));

  return (
    <AuthProvider>
      {!hideShell && <CustomCursor />}
      {!hideShell && <ScrollProgress />}
      {!hideShell && <Navbar />}
      {children}
      {!hideShell && <Footer />}
      {!hideShell && <SiteTracker />}
      {!hideShell && <SiteAssistant />}
    </AuthProvider>
  );
}
