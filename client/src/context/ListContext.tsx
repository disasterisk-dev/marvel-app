import { entry, episode } from "@/types";
import { createContext, ReactElement, useContext, useState } from "react";

interface listTypes {
  entries: entry[];
  episodes: episode[];
  setEntries: (value: entry[]) => void;
  setEpisodes: (value: episode[]) => void;
  getCombined: () => entry[];
}

const ListContext = createContext<listTypes | null>(null);

type Props = {
  children: ReactElement;
};
export const ListProvider = ({ children }: Props) => {
  const [entries, setEntries] = useState<entry[]>([]);
  const [episodes, setEpisodes] = useState<episode[]>([]);

  function getCombined(): entry[] {
    const newCombined: entry[] = [];

    entries.forEach((e) => {
      if (e.medium === "Show") {
        const eps = episodes
          .filter((x) => x.series === e.id)
          .sort(
            (a, b) =>
              new Date(a.releaseDate).getTime() -
              new Date(b.releaseDate).getTime(),
          );

        // if no episodes remove entry
        if (eps.length === 0) return;

        e.episodes = eps;

        let runtime = 0;
        eps.forEach((x) => (runtime += x.runtime));
        e.runtime = runtime;
      }

      newCombined.push(e);
    });

    return newCombined;
  }

  return (
    <ListContext.Provider
      value={{
        entries,
        setEntries,
        episodes,
        setEpisodes,
        getCombined,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};

export const useList = () => {
  const context = useContext(ListContext);

  if (context === undefined) {
    throw new Error("Must use useList inside the ListProvider component");
  }

  return context;
};
