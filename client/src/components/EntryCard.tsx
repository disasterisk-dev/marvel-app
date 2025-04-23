import { entry } from "../types";
import { useEffect } from "react";
import { format, formatDuration } from "date-fns";
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

type Props = {
  entry: entry;
};

export const EntryCard = ({ entry }: Props) => {
  const { entries, storeEntries } = useList()!;
  const { setOpen, setEdit, setTab } = useAdmin()!;

  // useEffect(() => {
  //   if (entry.medium !== "Show") return;

  //   if (
  //     episodes.find((x) => x.series === entry.id) &&
  //     !entries.find((e) => e.id === entry.id)
  //   ) {
  //     storeEntries([...entries, entry]);
  //   }
  // }, [entry, storeEntries, episodes, entries]);

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

  function openEdit() {
    setEdit(entry);
    setTab("entry");
    setOpen(true);
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-md">
        <Sheet>
          <SheetTrigger asChild>
            <div className="bg-inverse dark:bg-bold cursor-pointer gap-2">
              <img className="aspect-2/3" src={entry.posterUrl} alt="" />
            </div>
          </SheetTrigger>

          <SheetContent>
            <ContextMenu>
              <ContextMenuTrigger>
                <SheetHeader>
                  <SheetTitle>{entry.title}</SheetTitle>
                  <SheetDescription className="flex gap-2">
                    <img
                      className="aspect-2/3 h-auto w-1/2"
                      src={entry.posterUrl}
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
                <ContextMenuItem onClick={openEdit}>
                  <FontAwesomeIcon icon={faPencil} />
                  Edit
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>

            {(entry.medium === "Show" || entry.id === 56) && (
              <EpisodeView entryID={entry.id} />
            )}
            <SheetFooter>
              {entry.medium !== "Show" && (
                <Button onClick={toggleSelect}>
                  {entries.find((e) => e.id === entry.id)
                    ? "Remove from List"
                    : "Add to List"}
                </Button>
              )}
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
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
        {entry.medium !== "Show" && (
          <>
            <FontAwesomeIcon className="text-muted-foreground" icon={faClock} />
            {formatDuration({
              hours: Math.floor(entry.runtime / 60),
              minutes: entry.runtime % 60,
            })}
          </>
        )}
      </div>
    </div>
  );
};
