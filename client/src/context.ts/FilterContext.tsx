import { createContext, useState } from "react";

interface FilterTypes {
  charFilter: number[];
  setCharFilter: (value: number[]) => void;
  mediumFilter: string[];
  setMediumFilter: (value: string[]) => void;
  sortOrder: "release" | "alpha";
  setSortOrder: (value: "release" | "alpha") => void;
}

export const FilterContext = createContext<FilterTypes | null>(null);

export const FilterContextProvider = ({ children }) => {
  const [charFilter, setCharFilter] = useState<number[]>([]);
  const [mediumFilter, setMediumFilter] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<"release" | "alpha">("release");

  return (
    <FilterContext.Provider
      value={{
        charFilter,
        mediumFilter,
        sortOrder,
        setCharFilter,
        setMediumFilter,
        setSortOrder,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};
