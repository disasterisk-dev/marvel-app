import { entry, episode } from "@/types";
import {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";

interface listTypes {
  entries: entry[];
  episodes: episode[];
  storeEntries: (value: entry[]) => void;
  storeEpisodes: (value: episode[]) => void;
  getCombined: () => entry[];
}

const ListContext = createContext<listTypes | null>(null);

type Props = {
  children: ReactElement;
};
export const ListProvider = ({ children }: Props) => {
  const [entries, setEntries] = useState<entry[]>([]);
  const [episodes, setEpisodes] = useState<episode[]>([]);

  useEffect(() => {
    const loadEntries = JSON.parse(localStorage.getItem("entries")!);
    if (loadEntries) setEntries(loadEntries);

    const loadEpisodes = JSON.parse(localStorage.getItem("episodes")!);
    if (loadEpisodes) setEpisodes(loadEpisodes);
  }, []);

  function storeEntries(e: entry[]) {
    setEntries(e);
    localStorage.setItem("entries", JSON.stringify(e));
  }

  function storeEpisodes(e: episode[]) {
    setEpisodes(e);
    localStorage.setItem("episodes", JSON.stringify(e));
  }

  function getCombined(): entry[] {
    const newCombined: entry[] = [];

    const shows: entry[] = JSON.parse(localStorage.getItem("shows")!);

    const printOut: (entry | episode)[] = [];

    episodes.forEach((e) => {
      const series = shows.find((s) => s.id === e.series);

      series!.episodes = [e];
      series!.releaseDate = e.releaseDate;
      series!.title = e.title;

      newCombined.push({
        id: e.id,
        title: e.title,
        directors: e.directors,
        releaseDate: e.releaseDate,
        runtime: e.runtime,
        characters: [],
        medium: "Show",
        posterUrl: series!.posterUrl,
        phase: series!.phase,
      });

      printOut.push(e);
    });

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
      printOut.push(e);
      newCombined.push(e);
    });
    console.log(
      printOut.sort(
        (a, b) =>
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime(),
      ),
    );
    return newCombined.sort((e) => new Date(e.runtime).getTime());
  }

  return (
    <ListContext.Provider
      value={{
        entries,
        storeEntries,
        episodes,
        storeEpisodes,
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
