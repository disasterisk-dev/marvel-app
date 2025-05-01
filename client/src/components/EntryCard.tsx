import { entry, episode } from "../types";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { EpisodeView } from "./EpisodeView";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faCalendar,
  faClapperboard,
  faClock,
  faMinus,
  faPencil,
} from "@fortawesome/free-solid-svg-icons";
import { useList } from "@/context/ListContext";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { useAdmin } from "@/context/AdminContext";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { formatRuntime } from "@/utils";

type Props = {
  entry: entry;
};

export const EntryCard = ({ entry }: Props) => {
  const { entries, episodes, storeEntries, storeEpisodes } = useList()!;
  const { setOpen, setEdit, setTab } = useAdmin()!;

  const episodeList = useQuery({
    queryKey: ["episodes", entry.id],
    queryFn: async () => {
      const data = await axios
        .get(import.meta.env.VITE_API_BASE_URL + "/episodes/from/" + entry.id)
        .then((res) => {
          return res.data;
        })
        .catch(() => {
          throw new Error("");
        });

      data.items.sort(
        (a: episode, b: episode) =>
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime(),
      );

      return data;
    },
    enabled: entry.medium === "Show",
    refetchOnWindowFocus: false,
  });

  function toggleSelect() {
    // If checkbox is checked
    if (entries.find((e) => e.id === entry.id)) {
      storeEntries(entries.filter((e) => e.id !== entry.id));
      return;
    }

    // If entry is already in watchlist, return immediately
    if (entries.find((e) => e.id === entry.id)) return;

    storeEntries([...entries, entry]);
    return;
  }

  async function toggleAllEpisodes() {
    if (episodes.find((e) => e.series === entry.id)) {
      storeEpisodes(episodes.filter((e) => e.series !== entry.id));
      return;
    }

    storeEpisodes([...episodes, ...episodeList.data.items]);
  }

  function openEdit() {
    setEdit(entry);
    setTab("entry");
    setOpen(true);
  }

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <div className="bg-inverse dark:bg-bold aspect-2/3 w-full cursor-pointer gap-2 overflow-hidden rounded-md">
            <img
              className="w-full"
              src={import.meta.env.VITE_FILE_BASE_URL + entry.posterUrl}
              alt=""
            />
          </div>
        </SheetTrigger>

        <SheetContent>
          <ContextMenu>
            <ContextMenuTrigger>
              <SheetHeader>
                <SheetTitle>{entry.title}</SheetTitle>
                <SheetDescription className="flex gap-2">
                  <img
                    className="aspect-2/3 h-auto w-1/2 overflow-hidden rounded-sm"
                    src={import.meta.env.VITE_FILE_BASE_URL + entry.posterUrl}
                    alt=""
                  />
                  <CardContent entry={entry} />
                </SheetDescription>
              </SheetHeader>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuLabel className="text-card-foreground font-semibold">
                {entry.title}
              </ContextMenuLabel>
              {entry.medium !== "Show" && (
                <ContextMenuItem onClick={toggleSelect}>
                  {entries.find((e) => e.id === entry.id) ? (
                    <>
                      <FontAwesomeIcon icon={faAdd} />
                      Add to List
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faMinus} />
                      Remove from List
                    </>
                  )}
                </ContextMenuItem>
              )}
              <ContextMenuItem onClick={openEdit}>
                <FontAwesomeIcon icon={faPencil} />
                Edit
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>

          {episodeList.data && (
            <EpisodeView episodes={episodeList.data.items} />
          )}
          <SheetFooter className="pb-4">
            {entry.medium !== "Show" && (
              <Button onClick={toggleSelect}>
                {entries.find((e) => e.id === entry.id)
                  ? "Remove from List"
                  : "Add to List"}
              </Button>
            )}
            {entry.medium === "Show" && (
              <Button onClick={toggleAllEpisodes}>
                {episodes.find((e) => e.series === entry.id)
                  ? "Remove all from List"
                  : "Add all to List"}
              </Button>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

const CardContent = ({ entry }: Props) => {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center gap-2 text-sm">
        <FontAwesomeIcon
          className="text-muted-foreground"
          icon={faClapperboard}
        />
        <span>
          {entry.directors.map((d, i) => (
            <>
              <span
                key={i}
                className="after:content-[',\00a0'] last:after:content-['']"
              >
                {d}
              </span>
            </>
          ))}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <FontAwesomeIcon className="text-muted-foreground" icon={faCalendar} />
        {format(entry.releaseDate, "do MMMM yyyy")}
      </div>
      <div className="flex items-center gap-2 text-sm">
        <FontAwesomeIcon className="text-muted-foreground" icon={faClock} />
        {entry.medium !== "Show" && <>{formatRuntime(entry.runtime)}</>}
      </div>
    </div>
  );
};
