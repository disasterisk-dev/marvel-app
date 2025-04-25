import { episode } from "@/types";
import { Button } from "./ui/button";
import { useList } from "@/context/ListContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faTrash } from "@fortawesome/free-solid-svg-icons";
import { formatRuntime } from "@/utils";
import { Separator } from "./ui/separator";

type Props = {
  episode: episode;
};
export const WatchListEpisode = ({ episode }: Props) => {
  const { episodes, storeEpisodes } = useList()!;

  function removeFromList() {
    storeEpisodes(episodes.filter((e) => e.id !== episode.id));
  }

  return (
    <>
      <div className="my-2 flex gap-2">
        <div className="text-muted-foreground basis-full">
          <h3 className="font-semibold">
            {episode.episodeNumber}. {episode.title}
          </h3>

          <span>
            <FontAwesomeIcon icon={faClock} /> {formatRuntime(episode.runtime)}
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
      <Separator className="last:hidden" />
    </>
  );
};
