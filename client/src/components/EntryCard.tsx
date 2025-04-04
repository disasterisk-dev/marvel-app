import { entry } from "../types";
import { useState } from "react";
import { format } from "date-fns";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

type Props = {
  entry: entry;
  showEps: (e: entry) => void;
};

export const EntryCard = ({ entry, showEps }: Props) => {
  const [selected, setSelected] = useState<boolean>(false);

  return (
    <>
      <div className="relative overflow-hidden rounded-md" key={entry.id}>
        <HoverCard>
          <HoverCardTrigger>
            <input
              type="checkbox"
              name=""
              id=""
              checked={selected}
              value={entry.id}
              className="absolute top-2 left-2 scale-150 cursor-pointer"
              onChange={() => setSelected(!selected)}
            />
            <div
              className="aspect-2/3 cursor-pointer"
              onClick={() => setSelected(!selected)}
            >
              <img src={entry.posterUrl} alt="" />
            </div>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="flex flex-col gap-2">
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
              <p className="text-sm italic">
                {format(entry.releaseDate, "do MMMM yyyy")}
              </p>
              {(entry.medium === "Show" || entry.id === 56) && (
                <button
                  onClick={() => showEps(entry)}
                  className="bg-subtle text-inverse w-full rounded-sm p-2"
                >
                  show episodes
                </button>
              )}
            </div>
          </HoverCardContent>
        </HoverCard>
        {/* replace with ShadCN UI hover card */}
      </div>
    </>
  );
};
