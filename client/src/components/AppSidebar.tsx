import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import MediumFilters from "@/components/MediumFilters";
import PhaseFilter from "@/components/PhaseFilter";
import CharacterFilters from "@/components/CharacterFilters";
import ThemeToggle from "@/components/ThemeToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

const AppSidebar = () => {
  return (
    <Sidebar>
      <div className="bg-brand text-background dark:text-foreground">
        <SidebarHeader>
          <h1 className="grow text-2xl font-bold">UATU IO</h1>
        </SidebarHeader>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <MediumFilters />
          <PhaseFilter />
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
  );
};

export default AppSidebar;
