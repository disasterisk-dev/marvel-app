import * as React from "react";
import {
  Outlet,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router";
import AdminPanel from "@/components/admin";
import { Toaster } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import SortOrder from "@/components/SortOrder";

export const Route = createRootRoute({
  component: Root,
  notFoundComponent: NotFound,
});

function Root() {
  const { location } = useRouterState();
  return (
    <React.Fragment>
      <SidebarProvider defaultOpen={false}>
        <AppSidebar />

        <main className="bg-inverse-subtle dark:bg-subtle grow">
          <div className="mb-4 flex items-center justify-between p-4">
            {location.pathname !== "/" && (
              <>
                <SidebarTrigger />
                <SortOrder />
              </>
            )}
          </div>
          <Outlet />
        </main>
        <AdminPanel />
        <Toaster />
      </SidebarProvider>
    </React.Fragment>
  );
}

function NotFound() {
  return <div>Not Found</div>;
}
