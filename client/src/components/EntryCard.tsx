import { entry } from "../types";
import { useState } from "react";

type Props = {
  entry: entry;
  showEps: (e: entry) => void;
};

export const EntryCard = ({ entry, showEps }: Props) => {
  const [selected, setSelected] = useState<boolean>(false);

  return (
    <div
      className="bg-inverse text-bold rounded-md relative overflow-hidden"
      key={entry.id}
    >
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

      <div className="p-2">
        <h2>{entry.title}</h2>
        {entry.medium === "Show" && (
          <button onClick={() => showEps(entry)}>episodes</button>
        )}
        {entry.id === 56 && (
          <button onClick={() => showEps(entry)}>episodes</button>
        )}
      </div>
    </div>
  );
};
