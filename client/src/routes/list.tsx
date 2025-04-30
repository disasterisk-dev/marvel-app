import AppSidebar from "@/components/AppSidebar";
import SortOrder from "@/components/SortOrder";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { WatchListEntry } from "@/components/WatchListEntry";
import { WatchListEpisode } from "@/components/WatchListEpisode";
import { useList } from "@/context/ListContext";
import { entry, episode, isEntry, isEpisode, listQuerySchema } from "@/types";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { toast } from "sonner";

export const Route = createFileRoute("/list")({
  component: RouteComponent,
  validateSearch: (search) => listQuerySchema.parse(search),
});

function RouteComponent() {
  const { entries: entryQ, episodes: episodeQ } = Route.useSearch();
  const { entries, episodes, storeEntries, storeEpisodes, getCombined } =
    useList()!;
  const navigate = useNavigate();

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

          sessionStorage.setItem("shows", JSON.stringify(shows));

          if (!entries) return [];

          return res.data.items.filter((e: entry) => entryQ.includes(e.id));
        });

      const episodeData = await axios
        .get(import.meta.env.VITE_API_BASE_URL + "/episodes")
        .then((res) => {
          if (!episodeQ) return [];

          return res.data.items.filter((e: episode) => episodeQ.includes(e.id));
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
    if (!data) return;

    if (entries.length > 0 || episodes.length > 0) {
      toast("This will overwrite your data", {
        action: {
          label: "OK",
          onClick: () => {
            storeEntries(data.filter((e: episode | entry) => isEntry(e)));
            storeEpisodes(data.filter((e: episode | entry) => isEpisode(e)));

            console.log(getCombined());
            navigate({ from: "/list", to: "/app" });
          },
        },
      });
    }
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
                      <WatchListEntry entry={e} isShell key={i} />
                    </>
                  );
                }

                const shows: entry[] = JSON.parse(
                  sessionStorage.getItem("shows")!,
                );

                if (i === 0) {
                  return (
                    <>
                      <WatchListEntry
                        entry={shows!.find((s) => s.id === e.series)!}
                        key={i}
                        isShell
                      />
                      <WatchListEpisode isShell episode={e} />
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
                    <WatchListEpisode episode={e} isShell />
                  </>
                );
              })}
            </div>
          )}
        </main>
        {data && (
          <Button className="fixed right-4 bottom-4" onClick={editList}>
            <FontAwesomeIcon icon={faPencil} />
            Edit this List
          </Button>
        )}
      </SidebarProvider>
    </>
  );
}
