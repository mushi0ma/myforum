import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Navbar } from "@/components/Navbar";
import { Widgets } from "@/components/Widgets";
import { AppSidebar } from "./AppSidebar";

export default function MainLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar />
        <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Feed / Page Content */}
          <div className="lg:col-span-8 space-y-6">
            <Outlet />
          </div>

          {/* Right Widgets (Desktop only) */}
          <div className="hidden lg:block lg:col-span-4 h-full">
            <div className="sticky top-24">
              <Widgets />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}