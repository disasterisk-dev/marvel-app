import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { entry } from "../types";
import { EntryCard } from "../components/EntryCard";
import { useFilter } from "@/context/FilterContext";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SortOrder from "@/components/SortOrder";
import AppSidebar from "@/components/AppSidebar";
import WatchList from "@/components/WatchList";
import axios from "axios";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/app")({
  component: App,
  validateSearch: (search) => appSearchSchema.parse(search),
});

const appSearchSchema = z.object({
  entries: z.optional(z.array(z.number())),
  episodes: z.optional(z.array(z.number())),
});

type AppSearch = z.infer<typeof appSearchSchema>;

function App() {
  const { charFilter, mediumFilter, sortOrder, phaseFilter } = useFilter()!;
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
                  {filterEntries(entries.data.items).map((e) => (
                    <EntryCard entry={e} key={e.id} />
                  ))}
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

  function filterEntries(entryList: entry[]) {
    let filteredList: entry[] = [];

    // when the filters are empty all results should be shown
    if (charFilter.length === 0) {
      filteredList = entryList;
    } else {
      entryList.forEach((e) => {
        charFilter.forEach((c) => {
          if (e.characters.includes(c)) {
            // does not add entry to list if it already exists there, prevents duplicates
            if (!filteredList.includes(e)) filteredList.push(e);
          }
        });
      });
    }

    if (mediumFilter.length > 0) {
      filteredList = filteredList.filter((e) =>
        mediumFilter.includes(e.medium),
      );
    }

    if (phaseFilter.length > 0) {
      filteredList = filteredList.filter((e) => phaseFilter.includes(e.phase));
    }

    if (sortOrder === "release") {
      // Sort the entries by release date instead of ID
      filteredList.sort(
        (a: entry, b: entry) =>
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime(),
      );
    }

    if (sortOrder === "alphabetical") {
      filteredList.sort((a: entry, b: entry) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
      );
    }

    return filteredList;
  }
}

export default App;
