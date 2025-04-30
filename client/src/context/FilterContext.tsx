import { entry, episode, isEntry, isEpisode } from "@/types";
import { createContext, ReactElement, useContext, useState } from "react";

interface FilterTypes {
  charFilter: number[];
  setCharFilter: (value: number[]) => void;
  mediumFilter: string[];
  setMediumFilter: (value: string[]) => void;
  sortOrder: "release" | "alphabetical";
  setSortOrder: (value: "release" | "alphabetical") => void;
  phaseFilter: number[];
  setPhaseFilter: (value: number[]) => void;
  filterList: (value: (entry | episode)[]) => (entry | episode)[];
}

export const FilterContext = createContext<FilterTypes | null>(null);

interface props {
  children: ReactElement;
}

export const FilterContextProvider = ({ children }: props) => {
  const [charFilter, setCharFilter] = useState<number[]>([]);
  const [mediumFilter, setMediumFilter] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"release" | "alphabetical">(
    "release",
  );
  const [phaseFilter, setPhaseFilter] = useState<number[]>([]);

  function filterList(list: (entry | episode)[]) {
    let filteredList: (entry | episode)[] = [];

    const shows: entry[] = JSON.parse(sessionStorage.getItem("shows")!);

    // when the filters are empty all results should be shown
    if (charFilter.length === 0) {
      filteredList = list;
    } else {
      list.forEach((e) => {
        if (isEntry(e)) {
          charFilter.forEach((c) => {
            if (e.characters.includes(c) && !filteredList.includes(e)) {
              // does not add entry to list if it already exists there, prevents duplicates
              filteredList.push(e);
            }
          });
        } else {
          if (!shows) return;

          const show = shows.find((s) => s.id === e.series);
          charFilter.forEach((c) => {
            if (show?.characters.includes(c) && !filteredList.includes(e)) {
              filteredList.push(e);
            }
          });
        }
      });
    }

    if (mediumFilter.length > 0) {
      filteredList = filteredList.filter((e) => {
        if (isEntry(e) && mediumFilter.includes(e.medium)) return true;
        if (isEpisode(e) && mediumFilter.includes("Show")) return true;
        return false;
      });
    }

    if (phaseFilter.length > 0) {
      filteredList = filteredList.filter((e) => {
        if (isEntry(e) && phaseFilter.includes(e.phase)) return true;

        if (isEpisode(e)) {
          const show = shows.find((s) => s.id === e.series);
          if (phaseFilter.includes(show!.phase)) return true;
        }
        return false;
      });
    }

    if (sortOrder === "release") {
      // Sort the entries by release date instead of ID
      filteredList.sort(
        (a: entry | episode, b: entry | episode) =>
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime(),
      );
    }

    if (sortOrder === "alphabetical") {
      filteredList.sort((a: entry | episode, b: entry | episode) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
      );
    }

    return filteredList;
  }

  return (
    <FilterContext.Provider
      value={{
        charFilter,
        mediumFilter,
        sortOrder,
        phaseFilter,
        setCharFilter,
        setMediumFilter,
        setSortOrder,
        setPhaseFilter,
        filterList,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a FilterContextProvider");

  return context;
};
