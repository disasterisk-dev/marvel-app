import { useQuery } from "@tanstack/react-query";
import { entry, episode } from "../types";
import { format } from "date-fns";

type Props = {
  entry: entry;
  closeEps: (e: entry | null) => void;
};
export const EpisodeView = ({ entry }: Props) => {
  const episodes = useQuery({
    queryKey: ["episodes", entry.id],
    queryFn: async () => {
      console.log("get eps");

      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/episodes/from/" + entry.id,
      );

      if (!res.ok) {
        throw new Error("Could not get episodes");
      }

      const data = await res.json();

      data.items.sort(
        (a: episode, b: episode) =>
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime(),
      );

      return data;
    },
    enabled: !!entry,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="overflow-scroll p-4">
      {episodes.data && (
        <>
          <div>
            {episodes.data.items.map((e: episode) => (
              <>
                <div className="flex gap-4 py-2" key={e.id}>
                  <input type="checkbox" name="" id="" />
                  <div className="grow">
                    <h3>
                      {e.episodeNumber}. {e.title}
                    </h3>
                    <div className="flex items-center">
                      <p className="grow">{e.runtime}m</p>
                      <p className="text-sm italic">
                        {format(e.releaseDate, "do MMMM yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
                <hr className="last:hidden" />
              </>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
