import { AppSidebar } from '@/components/molecules/sidebar';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex py-2 shrink-0 items-center gap-2 border-b px-2">
          <SidebarTrigger />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
