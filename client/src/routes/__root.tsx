import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import MediumFilters from "@/components/MediumFilters";
import CharacterFilters from "@/components/CharacterFilters";
import ThemeToggle from "@/components/ThemeToggle";
import SortOrder from "@/components/SortOrder";
import AdminPanel from "@/components/admin";
import { Toaster } from "sonner";

export const Route = createRootRoute({
  component: Root,
  notFoundComponent: NotFound,
});

function Root() {
  return (
    <React.Fragment>
      <SidebarProvider>
        <Sidebar>
          <div className="bg-brand-300 dark:bg-brand-400 text-inverse">
            <SidebarHeader>
              <h1 className="grow text-2xl font-bold">Uatu IO</h1>
            </SidebarHeader>
          </div>
          <SidebarContent>
            <SidebarGroup>
              <MediumFilters />
              <CharacterFilters />
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-end justify-between">
              <ThemeToggle />
              <a
                href="https://github.com/disasterisk-dev/marvel-app"
                target="_blank"
              >
                <FontAwesomeIcon icon={faGithub} className="text-4xl" />
              </a>
            </div>
          </SidebarFooter>
        </Sidebar>
        {/* Move filters here as sidebar */}
        <main className="bg-inverse-subtle dark:bg-subtle grow overflow-scroll">
          <div className="mb-4 flex items-center justify-between p-4">
            <SidebarTrigger />
            <SortOrder />
          </div>
          <Outlet />
          <AdminPanel />
          <Toaster />
        </main>
      </SidebarProvider>
    </React.Fragment>
  );
}

function NotFound() {
  return <div>Not Found</div>;
}
