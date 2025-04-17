import { createContext, ReactElement, useContext, useState } from "react";

interface FilterTypes {
  charFilter: number[];
  setCharFilter: (value: number[]) => void;
  mediumFilter: string[];
  setMediumFilter: (value: string[]) => void;
  sortOrder: "release" | "alphabetical";
  setSortOrder: (value: "release" | "alphabetical") => void;
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

export const useFilter = () => {
  const context = useContext(FilterContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a FilterContextProvider");

  return context;
};
