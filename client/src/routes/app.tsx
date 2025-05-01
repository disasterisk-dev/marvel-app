import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { entry, isEntry } from "../types";
import { EntryCard } from "../components/EntryCard";
import { useFilter } from "@/context/FilterContext";
import WatchList from "@/components/WatchList";
import axios from "axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { times } from "lodash-es";

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
      <div className="relative flex flex-col gap-4 lg:flex-row">
        <div className="@container order-3 grow lg:order-2">
          {entries.isLoading && (
            <div className="grid auto-rows-min grid-cols-1 gap-2 px-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {times(12, () => (
                <Skeleton className="aspect-2/3" />
              ))}
            </div>
          )}
          {entries.data && (
            <div className="grid auto-rows-min grid-cols-1 gap-2 px-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {filterList(entries.data.items).map((e) => {
                if (isEntry(e)) return <EntryCard entry={e} key={e.id} />;
              })}
            </div>
          )}
        </div>
      </div>
      <WatchList />
    </>
  );

  // Filter method
}

export default App;
