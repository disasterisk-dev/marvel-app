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
        import.meta.env.VITE_API_BASE_URL + "/episodes/from/" + entry.id
      );

      if (!res.ok) {
        throw new Error("COuld not get episodes");
      }

      const data = await res.json();

      return data;
    },
    enabled: !!entry,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="bg-inverse h-min p-4 rounded-md min-w-sm order-2 lg:order-3">
      <div className="flex items-center">
        <span className="grow font-heading font-medium text-lg text-subtle">
          Episodes
        </span>
        <button
          className="bg-bold text-inverse aspect-square flex p-2 rounded-full items-center cursor-pointer"
          onClick={() => closeEps(null)}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>

      <h2 className="text-nowrap text-xl font-semibold font-heading mt-2">
        {entry.title}
      </h2>
      {episodes.data && (
        <>
          <div>
            {episodes.data.items.map((e: episode) => (
              <>
                <div className="py-2 flex gap-4">
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
