import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { entry } from "../types";
import CharacterFilters from "../components/CharacterFilters";
import MediumFilters from "../components/MediumFilters";
import { EntryCard } from "../components/EntryCard";
import { EpisodeView } from "../components/EpisodeView";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  const [charFilter, setCharFilter] = useState<number[]>([]);
  const [mediumFilter, setMediumFilter] = useState<string[]>([]);
  const [epsView, setEpsView] = useState<entry | null>(null);
  const [sortOrder, setSortOrder] = useState<"release" | "alpha">("release");

  // returns an array of entries based on if the character list includes any character from the charFilter

  const entries = useQuery({
    queryKey: ["entries"],
    queryFn: async () => {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/entries");

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();

      console.log(data);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <div className="relative flex flex-col gap-4 lg:flex-row">
        <aside className="order-1 hidden lg:block">
          <MediumFilters state={mediumFilter} method={setMediumFilter} />
          <CharacterFilters
            charFilter={charFilter}
            setCharFilter={setCharFilter}
          />
        </aside>
        <div className="@container order-3 grow lg:order-2">
          <select
            name=""
            id=""
            value={sortOrder}
            // @ts-expect-error safe as the only options fit the union type
            onChange={(e) => setSortOrder(e.target.value)}
            className="mb-2"
          >
            <option value="release">Realease Order</option>
            <option value="alpha">Alphabetical Order</option>
          </select>
          {entries.data && (
            <div className="mx-auto grid max-w-screen-lg auto-rows-min grid-cols-1 gap-2 @xs:grid-cols-2 @md:grid-cols-3 @3xl:grid-cols-4">
              {filterEntries(entries.data.items).map((e) => (
                <EntryCard entry={e} key={e.id} showEps={setEpsView} />
              ))}
            </div>
          )}
        </div>
        {epsView && <EpisodeView entry={epsView} closeEps={setEpsView} />}
      </div>
    </>
  );

  // Filter method

  function filterEntries(entryList: entry[]) {
    let filteredList: entry[] = [];

    // when the filters are empty all results should be shown
    if (charFilter.length === 0) {
      filteredList = entryList;
    } else {
      entryList.forEach((e) => {
        charFilter.forEach((c) => {
          if (e.characters.includes(c)) {
            // does not add entry to list if it already exists there, prevents duplicates
            if (!filteredList.includes(e)) filteredList.push(e);
          }
        });
      });
    }

    if (mediumFilter.length > 0) {
      filteredList = filteredList.filter((e) =>
        mediumFilter.includes(e.medium),
      );
    }

    if (sortOrder === "release") {
      // Sort the entries by release date instead of ID
      filteredList.sort(
        (a: entry, b: entry) =>
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime(),
      );
    }

    if (sortOrder === "alpha") {
      filteredList.sort((a: entry, b: entry) =>
        a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
      );
    }

    return filteredList;
  }
}

export default App;
