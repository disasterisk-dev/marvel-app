import { entry } from "@/types";
import { Button } from "./ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faTrash } from "@fortawesome/free-solid-svg-icons";
import { formatDuration } from "date-fns";
import { useList } from "@/context/ListContext";

type Props = {
  entry: entry;
};
export const WatchListItem = ({ entry }: Props) => {
  const { entries, setEntries, episodes, setEpisodes } = useList()!;

  function removeFromList() {
    if (entry.medium !== "Show") {
      setEntries(entries.filter((e) => e.id !== entry.id));
      return;
    }

    setEpisodes(episodes.filter((e) => e.series !== entry.id));
  }

  return (
    <>
      <div className="h-min">
        <div className="my-2 flex gap-2">
          <div className="max-w-1/3">
            <img className="aspect-2/3 w-full" src={entry.posterUrl} alt="" />
          </div>
          <div className="text-muted-foreground basis-full">
            <h3 className="font-semibold">{entry.title}</h3>
            <span>
              <FontAwesomeIcon icon={faClock} />{" "}
              {formatDuration({
                hours: Math.floor(entry.runtime / 60),
                minutes: entry.runtime % 60,
              })}
            </span>
          </div>
          <Button
            variant={"outline"}
            className="text-destructive aspect-square"
            onClick={removeFromList}
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>
        {entry.episodes && (
          <div className="border-muted-foreground border-l-2 pl-4">
            {entry.episodes.map((x) => (
              <div>{x.title}</div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};
