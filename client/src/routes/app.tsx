import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { entry, isEntry } from "../types";
import { EntryCard } from "../components/EntryCard";
import { useFilter } from "@/context/FilterContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SortOrder from "@/components/SortOrder";
import AppSidebar from "@/components/AppSidebar";
import WatchList from "@/components/WatchList";
import axios from "axios";
import { toast } from "sonner";

export const Route = createFileRoute("/app")({
  component: App,
});

function App() {
  const { filterList } = useFilter()!;
  // returns an array of entries based on if the character list includes any character from the charFilter

  const entries = useQuery({
    queryKey: ["entries"],
    queryFn: async () => {
      const data = await axios
        .get(import.meta.env.VITE_API_BASE_URL + "/entries")
        .then((res) => {
          const shows: entry[] = res.data.items.filter(
            (e: entry) => e.medium === "Show",
          );

          localStorage.setItem("shows", JSON.stringify(shows));

          return res.data;
        })
        .catch(() => {
          toast("Couldn't load DB");
        });
      return data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="bg-inverse-subtle dark:bg-subtle grow overflow-scroll">
          <div className="mb-4 flex items-center justify-between p-4">
            <SidebarTrigger />
            <SortOrder />
          </div>
          <div className="relative flex flex-col gap-4 lg:flex-row">
            <div className="@container order-3 grow lg:order-2">
              {entries.data && (
                <div className="mx-auto grid max-w-screen-lg auto-rows-min grid-cols-1 gap-2 px-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filterList(entries.data.items).map((e) => {
                    if (isEntry(e)) return <EntryCard entry={e} key={e.id} />;
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
        <WatchList />
      </SidebarProvider>
    </>
  );

  // Filter method
}

export default App;
