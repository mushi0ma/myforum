import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Navbar } from "./Navbar";
import { Widgets } from "@/components/Widgets"; // <-- Импортируем новый компонент

export default function MainLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary w-full flex font-sans">
        
        {/* Глобальный фон */}
        <div className="fixed inset-0 bg-gradient-radial from-[#1a1d1f]/20 via-background to-background pointer-events-none z-0"></div>

        {/* 1. Сайдбар */}
        <AppSidebar />

        <div className="flex flex-col flex-1 min-w-0 z-10">
          
          {/* 2. Верхняя панель */}
          <Navbar />

          {/* 3. Основной контент */}
          <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Лента (Центр) */}
            <div className="lg:col-span-8 space-y-6">
              <Outlet />
            </div>

            {/* Виджеты (Справа) - Sticky */}
            <div className="hidden lg:block lg:col-span-4 h-full">
               <div className="sticky top-24">
                  <Widgets /> {/* <-- Вставляем компонент здесь */}
               </div>
            </div>

          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}