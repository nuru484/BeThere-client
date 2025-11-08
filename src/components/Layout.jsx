import { SidebarProvider } from "@/components/ui/sidebar";
import { AppNavbar } from "@/components/AppNavbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <SidebarProvider>
      <main className="w-full container mx-auto min-h-screen">
        <AppNavbar />
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
