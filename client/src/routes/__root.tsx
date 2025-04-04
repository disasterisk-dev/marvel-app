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
import { useTheme } from "@/context.ts/ThemeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const Route = createRootRoute({
  component: Root,
  notFoundComponent: NotFound,
});

function Root() {
  const { theme, setTheme } = useTheme();

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
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button>Theme</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
        <main className="bg-inverse-subtle dark:bg-subtle grow overflow-scroll p-4">
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

function ThemeToggle() {
  const theme = document.querySelector("html")?.getAttribute("data-theme");

  if (theme == "light") {
    document.querySelector("html")?.setAttribute("data-theme", "dark");
    return;
  }

  document.querySelector("html")?.setAttribute("data-theme", "light");
  return;
}
