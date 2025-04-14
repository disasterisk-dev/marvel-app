import { entry } from "../types";
import { useState } from "react";
import { format } from "date-fns";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Checkbox } from "./ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { EpisodeView } from "./EpisodeView";

type Props = {
  entry: entry;
};

export const EntryCard = ({ entry }: Props) => {
  const [selected, setSelected] = useState<boolean | "indeterminate">(false);

  return (
    <>
      <div className="relative overflow-hidden rounded-md" key={entry.id}>
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
          <HoverCardContent>
            <CardContent entry={entry} />
          </HoverCardContent>
        </HoverCard>
      </div>
    </>
  );
};

const CardContent = ({ entry }: Props) => {
  return (
    <div className="flex h-full flex-col gap-2">
      <h2 className="text-pretty">{entry.title}</h2>
      <hr className="my-1" />
      <p className="text-sm">
        by{" "}
        {entry.directors.map((d, i) => (
          <>
            <span>{d}</span>
            {i < entry.directors.length - 1 && <span>, </span>}
          </>
        ))}
      </p>
      <p className="grow text-sm italic">
        {format(entry.releaseDate, "do MMMM yyyy")}
      </p>
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
