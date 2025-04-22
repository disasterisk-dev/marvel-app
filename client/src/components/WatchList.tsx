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
  faVideoCamera,
} from "@fortawesome/free-solid-svg-icons";
import { useList } from "@/context/ListContext";
import { entry } from "@/types";
import { formatDuration } from "date-fns";
import { WatchListItem } from "./WatchListItem";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

const WatchList = () => {
  const { getCombined } = useList()!;

  const list = getCombined().sort(
    (a, b) =>
      new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime(),
  );

  let totalRuntime = 0;

  list.forEach((e: entry) => {
    totalRuntime += e.runtime;
  });

  return (
    <Sheet key={"right"}>
      <SheetTrigger asChild>
        {list.length > 0 && (
          <Button className="fixed right-4 bottom-4 aspect-square">
            <FontAwesomeIcon icon={faVideoCamera} />
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
              {list.length === 0 && "0 minutes"}
              {list.length > 0 &&
                formatDuration({
                  hours: Math.floor(totalRuntime / 60),
                  minutes: totalRuntime % 60,
                })}
            </span>
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="m-2 overflow-scroll pr-4">
          {list.map((e: entry) => (
            <>
              <WatchListItem entry={e} key={e.id} />
              <Separator className="last:hidden" />
            </>
          ))}
        </ScrollArea>
        <SheetFooter>
          <Button>Export</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default WatchList;
