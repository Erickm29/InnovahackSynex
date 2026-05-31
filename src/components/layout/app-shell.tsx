"use client";

import { useState } from "react";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import type { SessionUser } from "@/lib/auth/types";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface AppShellProps {
  user: SessionUser;
  children: React.ReactNode;
}

export function AppShell({ user, children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <div className="fixed inset-y-0 left-0 z-40 hidden w-[var(--sidebar-width)] lg:block print:hidden">
        <Sidebar user={user} />
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-[var(--sidebar-width)] p-0 sm:max-w-xs"
        >
          <Sidebar
            user={user}
            onNavigate={() => setMobileOpen(false)}
            className="border-0"
          />
        </SheetContent>
      </Sheet>

      <div className="flex min-h-screen flex-1 flex-col lg:pl-[var(--sidebar-width)] print:pl-0 print:min-h-0">
        <div className="print:hidden">
          <Topbar user={user} onMenuClick={() => setMobileOpen(true)} />
        </div>
        <main className="flex-1 print:p-0">{children}</main>
      </div>
    </div>
  );
}
