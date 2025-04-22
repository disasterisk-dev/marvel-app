import { useQuery } from "@tanstack/react-query";
import { episode } from "../types";
import { EpisodeItem } from "./EpisodeItem";

type Props = {
  entryID: number;
};
export const EpisodeView = ({ entryID }: Props) => {
  const episodes = useQuery({
    queryKey: ["episodes", entryID],
    queryFn: async () => {
      console.log("get eps");

      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/episodes/from/" + entryID,
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
    enabled: !!entryID,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="overflow-scroll p-4">
      {episodes.data && (
        <>
          <div>
            <h3>Episodes:</h3>
            {episodes.data.items.map((e: episode) => (
              <EpisodeItem episode={e} key={e.id} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
