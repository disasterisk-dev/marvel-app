import { entry } from "../types";
import { useState } from "react";
import { format, formatDuration } from "date-fns";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Checkbox } from "./ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { EpisodeView } from "./EpisodeView";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClapperboard,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

type Props = {
  entry: entry;
};

export const EntryCard = ({ entry }: Props) => {
  const [selected, setSelected] = useState<boolean | "indeterminate">(false);

  return (
    <>
      <div className="relative overflow-hidden rounded-md">
        <HoverCard>
          <HoverCardTrigger>
            {/* Not completely sold on the shad checkbox */}
            <div className="absolute top-2 left-2 scale-150">
              <Checkbox
                checked={selected}
                onCheckedChange={(c) => setSelected(c)}
              />
            </div>
            <div
              className="bg-inverse dark:bg-bold flex cursor-pointer flex-col gap-2 md:flex-row"
              onClick={() => setSelected(!selected)}
            >
              <img
                className="aspect-2/3 md:max-h-64 lg:max-h-full"
                src={entry.posterUrl}
                alt=""
              />
              <div className="flex-auto basis-full p-2 lg:hidden">
                <CardContent entry={entry} />
              </div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent className="min-w-fit">
            <CardContent entry={entry} />
          </HoverCardContent>
        </HoverCard>
      </div>
    </>
  );
};

const CardContent = ({ entry }: Props) => {
  // Separate fetch for show to return and display collective runtime of episodes
  const { data: showEntry } = useQuery({
    queryKey: ["show-entry", entry.id],
    queryFn: () => {
      const show = axios
        .get(import.meta.env.VITE_API_BASE_URL + "/entries/" + entry.id)
        .then((res) => {
          const show: entry = res.data.item;
          return show;
        });

      return show;
    },
    enabled: entry.medium === "Show",
    refetchOnWindowFocus: false,
  });

  return (
    <div className="flex h-full flex-col gap-2">
      <h2 className="text-nowrap">{entry.title}</h2>
      <hr className="my-1" />
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
        {entry.runtime &&
          formatDuration({
            hours: Math.floor(entry.runtime / 60),
            minutes: entry.runtime % 60,
          })}
        {showEntry &&
          formatDuration({
            hours: Math.floor(showEntry.runtime / 60),
            minutes: showEntry.runtime % 60,
          })}
      </div>
      {(entry.medium === "Show" || entry.id === 56) && (
        <>
          <Sheet key={"right"}>
            <SheetTrigger>
              <Button className="w-full">Show Episodes</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <span className="font-heading text-subtle grow text-lg font-medium">
                  Episodes
                </span>
                <h2 className="font-heading text-xl font-semibold text-nowrap">
                  {entry.title}
                </h2>
              </SheetHeader>
              <EpisodeView entry={entry} closeEps={() => {}} />
            </SheetContent>
          </Sheet>
        </>
      )}
    </div>
  );
};
