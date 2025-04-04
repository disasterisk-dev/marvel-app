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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import MediumFilters from "@/components/MediumFilters";
import CharacterFilters from "@/components/CharacterFilters";

export const Route = createRootRoute({
  component: Root,
  notFoundComponent: NotFound,
});

function Root() {
  return (
    <React.Fragment>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <h1 className="grow text-2xl font-bold">Uatu IO</h1>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <MediumFilters />
              <CharacterFilters />
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <a
              href="https://github.com/disasterisk-dev/marvel-app"
              target="_blank"
            >
              <FontAwesomeIcon icon={faGithub} className="text-2xl" />
            </a>
          </SidebarFooter>
        </Sidebar>
        {/* Move filters here as sidebar */}
        <main className="bg-inverse-subtle grow overflow-scroll p-4">
          <SidebarTrigger />
          <Outlet />
        </main>
      </SidebarProvider>
    </React.Fragment>
  );
}

function NotFound() {
  return <div>Not Found</div>;
}
