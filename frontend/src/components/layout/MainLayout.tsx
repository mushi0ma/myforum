import { useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Navbar } from "./Navbar";
import { MobileSidebar } from "./MobileSidebar";
import { Widgets } from "@/components/Widgets";

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary w-full flex font-sans">

        {/* Глобальный фон */}
        <div className="fixed inset-0 bg-gradient-radial from-[#1a1d1f]/20 via-background to-background pointer-events-none z-0"></div>

        {/* Desktop Sidebar (hidden on mobile) */}
        <AppSidebar />

        {/* Mobile Sidebar (Sheet/Drawer for < lg) */}
        <MobileSidebar open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

        <div className="flex flex-col flex-1 min-w-0 z-10">

          {/* Navbar with mobile menu trigger */}
          <Navbar onMenuClick={() => setMobileMenuOpen(true)} />

          {/* Main Content Area */}
          <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Feed (Center Column) */}
            <div className="lg:col-span-8 space-y-6">
              <Outlet />
            </div>

            {/* Widgets (Right Column - Sticky) */}
            <div className="hidden lg:block lg:col-span-4 h-full">
               <div className="sticky top-24">
                  <Widgets />
               </div>
            </div>

          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}