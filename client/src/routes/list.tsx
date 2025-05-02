import { Button } from "@/components/ui/button";
import { WatchListEntry } from "@/components/WatchListEntry";
import { WatchListEpisode } from "@/components/WatchListEpisode";
import { useFilter } from "@/context/FilterContext";
import { useList } from "@/context/ListContext";
import { entry, episode, isEntry, isEpisode, listQuerySchema } from "@/types";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { toast } from "sonner";
import { sumBy, times } from "lodash-es";
import { formatRuntime } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@radix-ui/react-select";

export const Route = createFileRoute("/list")({
  component: RouteComponent,
  validateSearch: (search) => listQuerySchema.parse(search),
});

function RouteComponent() {
  const { entries: entryQ, episodes: episodeQ } = Route.useSearch();
  const { entries, episodes, storeEntries, storeEpisodes, getCombined } =
    useList()!;
  const navigate = useNavigate();
  const { filterList } = useFilter()!;

  // fetch entries and episodes
  const { data, isLoading, isError, error, isFetching } = useQuery({
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

      const data = [...entryData, ...episodeData].sort(
        (a, b) =>
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime(),
      );

      return data;
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
      {(isFetching || isLoading) &&
        times(10, () => (
          <>
            <div className="mb-2 flex gap-2">
              <Skeleton className="aspect-2/3 w-32" />
              <Skeleton className="h-4 w-full pt-1" />
            </div>
            <Separator />
          </>
        ))}
      {isError && <div>{error.message}</div>}
      {data && (
        <div className="m-2 overflow-scroll pr-4">
          <div>{formatRuntime(sumBy(data, (e) => e.runtime))}</div>
          {filterList(data).map((e: entry | episode, i: number) => {
            if (isEntry(e)) {
              return (
                <>
                  <WatchListEntry entry={e} isShell key={i} />
                </>
              );
            }

            const shows: entry[] = JSON.parse(sessionStorage.getItem("shows")!);

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
      {data && (
        <Button className="fixed right-4 bottom-4" onClick={editList}>
          <FontAwesomeIcon icon={faPencil} />
          Edit this List
        </Button>
      )}
    </>
  );
}
