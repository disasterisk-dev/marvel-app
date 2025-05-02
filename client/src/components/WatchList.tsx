import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  faClock,
  faHashtag,
  faShareAlt,
  faVideoCamera,
} from "@fortawesome/free-solid-svg-icons";
import { useList } from "@/context/ListContext";
import { entry, episode, isEntry, isEpisode } from "@/types";
import { WatchListEntry } from "./WatchListEntry";
import { Separator } from "./ui/separator";
import { WatchListEpisode } from "./WatchListEpisode";
import { useLinkProps } from "@tanstack/react-router";
import { formatRuntime, getIds } from "@/utils";
import { toast } from "sonner";
import { sumBy } from "lodash-es";

const WatchList = () => {
  const { getCombined, entries, episodes } = useList()!;
  const { href } = useLinkProps({
    to: "/list",
    search: {
      entries: getIds(entries),
      episodes: getIds(episodes),
    },
  });

  const shows: entry[] = JSON.parse(localStorage.getItem("shows")!);

  const list = getCombined();

  function shareList() {
    navigator.clipboard.writeText("https://" + window.location.host + href!);
    toast("Copied to clipboard!");
  }

  return (
    <Sheet key={"right"}>
      <SheetTrigger asChild>
        {list.length > 0 && (
          <Button className="font-heading fixed right-4 bottom-4 aspect-square font-medium">
            <FontAwesomeIcon icon={faVideoCamera} />
            My Watchlist
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="h-screen">
        <SheetHeader>
          <SheetTitle>Watch List</SheetTitle>
          <SheetDescription className="flex flex-col gap-2">
            <span>
              <FontAwesomeIcon icon={faHashtag} /> {list.length} items to watch
            </span>
            <span>
              <FontAwesomeIcon icon={faClock} />{" "}
              {formatRuntime(
                sumBy(getCombined(), (e: entry | episode) => e.runtime),
              )}
            </span>
          </SheetDescription>
        </SheetHeader>
        <div className="m-2 overflow-auto pr-4">
          {list.map((e, i) => {
            if (isEntry(e)) {
              return (
                <>
                  <WatchListEntry entry={e} key={i} />
                  <Separator className="last:hidden" />
                </>
              );
            }

            if (i === 0) {
              return (
                <>
                  <WatchListEntry
                    entry={shows.find((s) => s.id === e.series)!}
                    key={i}
                    isShell
                  />
                  <Separator className="last:hidden" />
                  <WatchListEpisode episode={e} />
                  <Separator className="last:hidden" />
                </>
              );
            }

            const previous = list[i - 1];

            return (
              <>
                {isEntry(previous) && (
                  <WatchListEntry
                    entry={shows.find((s) => s.id === e.series)!}
                    key={i}
                    isShell
                  />
                )}
                {isEpisode(previous) && previous.series !== e.series && (
                  <WatchListEntry
                    entry={shows.find((s) => s.id === e.series)!}
                    key={i}
                    isShell
                  />
                )}
                <WatchListEpisode episode={e} />
              </>
            );
          })}
        </div>
        <SheetFooter>
          <Button onClick={shareList}>
            <FontAwesomeIcon icon={faShareAlt} />
            Share
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default WatchList;
