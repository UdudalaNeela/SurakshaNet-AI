import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { AuthGuard } from "@/components/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <TooltipProvider>
        <div className="flex min-h-screen w-full overflow-x-hidden overflow-y-auto">
          <Sidebar />
          <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
            <Header />
            <main className="flex-1 overflow-y-auto p-6 bg-background/50">
              {children}
            </main>
          </div>
        </div>
      </TooltipProvider>
    </AuthGuard>
  );
}
