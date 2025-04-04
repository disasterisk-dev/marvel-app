import { useQuery } from "@tanstack/react-query";
import { entry, episode } from "../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";

type Props = {
  entry: entry;
  closeEps: (e: entry | null) => void;
};
export const EpisodeView = ({ entry, closeEps }: Props) => {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For everyone else

  const episodes = useQuery({
    queryKey: ["episodes", entry.id],
    queryFn: async () => {
      console.log("get eps");

      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/episodes/from/" + entry.id,
      );

      if (!res.ok) {
        throw new Error("COuld not get episodes");
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
    <div className="bg-inverse order-2 h-min min-w-sm rounded-md p-4 lg:order-3">
      <div className="flex items-center">
        <span className="font-heading text-subtle grow text-lg font-medium">
          Episodes
        </span>
        <button
          className="bg-bold text-inverse flex aspect-square cursor-pointer items-center rounded-full p-2"
          onClick={() => closeEps(null)}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>

      <h2 className="font-heading mt-2 text-xl font-semibold text-nowrap">
        {entry.title}
      </h2>
      {episodes.data && (
        <>
          <div>
            {episodes.data.items.map((e: episode) => (
              <>
                <div className="flex gap-4 py-2">
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
