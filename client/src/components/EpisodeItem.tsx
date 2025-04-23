import { episode } from "@/types";
import { Checkbox } from "./ui/checkbox";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useList } from "@/context/ListContext";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { useAdmin } from "@/context/AdminContext";

type Props = {
  episode: episode;
};
export const EpisodeItem = ({ episode }: Props) => {
  const [selected, setSelected] = useState<boolean>(false);
  const { episodes, storeEpisodes } = useList()!;
  const { setOpen, setEdit, setTab } = useAdmin()!;

  useEffect(() => {
    setSelected(episodes.includes(episode));
  }, [episode, episodes]);

  function toggleSelected() {
    setSelected(!selected);

    // If checkbox is checked
    if (selected) {
      storeEpisodes(episodes.filter((e) => e.id !== episode.id));
      return;
    }

    // If entry is already in watchlist, return immediately
    if (episodes.includes(episode)) return;

    storeEpisodes([...episodes, episode]);
    return;
  }

  function openEdit() {
    setEdit(episode);
    setTab("episode");
    setOpen(true);
  }

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className="flex items-center gap-4 py-2"
            onClick={toggleSelected}
          >
            <Checkbox checked={selected} onCheckedChange={toggleSelected} />
            <div className="grow">
              <h3>
                {episode.episodeNumber}. {episode.title}
              </h3>
              <div className="flex items-center">
                <p className="grow">{episode.runtime}m</p>
                <p className="text-sm italic">
                  {format(episode.releaseDate, "do MMMM yyyy")}
                </p>
              </div>
            </div>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={openEdit}>
            <FontAwesomeIcon icon={faPencil} />
            Edit
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <hr className="last:hidden" />
    </>
  );
};
