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
  getCombined: () => (entry | episode)[];
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

  function getCombined(): (entry | episode)[] {
    return [...entries, ...episodes].sort(
      (a, b) =>
        new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime(),
    );
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
