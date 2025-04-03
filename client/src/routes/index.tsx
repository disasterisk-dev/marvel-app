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

  // returns an array of entries based on if the character list includes any character from the charFilter

  const entries = useQuery({
    queryKey: ["entries"],
    queryFn: async () => {
      const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/entries");

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();

      // Sort the entries by release date instead of ID
      data.items.sort(
        (a: entry, b: entry) =>
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
      );

      console.log(data);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 relative">
        <aside className="hidden lg:block order-1">
          <MediumFilters state={mediumFilter} method={setMediumFilter} />
          <CharacterFilters
            charFilter={charFilter}
            setCharFilter={setCharFilter}
          />
        </aside>
        <div className="@container grow order-3 lg:order-2">
          {entries.data && (
            <div className="grid grid-cols-1 @xs:grid-cols-2 @md:grid-cols-3 @3xl:grid-cols-4 auto-rows-min gap-2 max-w-screen-lg mx-auto">
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
        mediumFilter.includes(e.medium)
      );
    }

    return filteredList;
  }
}

export default App;
