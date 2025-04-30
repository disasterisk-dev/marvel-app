import AppSidebar from "@/components/AppSidebar";
import SortOrder from "@/components/SortOrder";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { WatchListEntry } from "@/components/WatchListEntry";
import { WatchListEpisode } from "@/components/WatchListEpisode";
import { entry, episode, isEntry, isEpisode, listQuerySchema } from "@/types";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { useState } from "react";

export const Route = createFileRoute("/list")({
  component: RouteComponent,
  validateSearch: (search) => listQuerySchema.parse(search),
});

function RouteComponent() {
  const { entries, episodes } = Route.useSearch();

  const [shows, setShows] = useState<entry[] | null>(null);

  // fetch entries and episodes
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["list-entries"],
    queryFn: async () => {
      const entryData = await axios
        .get(import.meta.env.VITE_API_BASE_URL + "/entries")
        .then((res) => {
          const shows: entry[] = res.data.items.filter(
            (e: entry) => e.medium === "Show",
          );

          setShows(shows);

          if (!entries) return [];

          return res.data.items.filter((e: entry) => entries.includes(e.id));
        });

      const episodeData = await axios
        .get(import.meta.env.VITE_API_BASE_URL + "/episodes")
        .then((res) => {
          if (!episodes) return [];

          return res.data.items.filter((e: episode) => episodes.includes(e.id));
        });

      console.log([...entryData, ...episodeData]);
      return [...entryData, ...episodeData].sort(
        (a, b) =>
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime(),
      );
    },
  });

  // EDIT LIST -  set entries and episodes to local storage and reroute to App
  function editList() {
    return;
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="bg-inverse-subtle dark:bg-subtle grow overflow-scroll">
          <div className="mb-4 flex items-center justify-between p-4">
            <SidebarTrigger />
            <SortOrder />
          </div>
          {isLoading && <div>Loading...</div>}
          {isError && <div>{error.message}</div>}
          {data && (
            <div className="m-2 overflow-scroll pr-4">
              {data.map((e, i) => {
                if (isEntry(e)) {
                  return (
                    <>
                      <WatchListEntry entry={e} key={i} />
                    </>
                  );
                }

                if (i === 0) {
                  return (
                    <>
                      <WatchListEntry
                        entry={shows!.find((s) => s.id === e.series)!}
                        key={i}
                        isShell
                      />
                      <WatchListEpisode episode={e} />
                    </>
                  );
                }

                const previous = data[i - 1];

                return (
                  <>
                    {isEntry(previous) && (
                      <WatchListEntry
                        entry={shows!.find((s) => s.id === e.series)!}
                        key={i}
                        isShell
                      />
                    )}
                    {isEpisode(previous) && previous.series !== e.series && (
                      <WatchListEntry
                        entry={shows!.find((s) => s.id === e.series)!}
                        key={i}
                        isShell
                      />
                    )}
                    <WatchListEpisode episode={e} />
                  </>
                );
              })}
            </div>
          )}
        </main>
        <Button className="fixed right-4 bottom-4" onClick={editList}>
          <FontAwesomeIcon icon={faPencil} />
          Edit this List
        </Button>
      </SidebarProvider>
    </>
  );
}
