import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import Filters from "../components/Filters";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/app")({
  component: App,
});

function App() {
  const [charFilter, setCharFilter] = useState<number[]>([]);

  // returns an array of entries based on if the character list includes any character from the charFilter
  function filterEntries(entryList) {
    // when the char filter is empty all results should be shown
    if (charFilter.length === 0) return entryList;

    let filteredList = [];

    entryList.forEach((e) => {
      charFilter.forEach((c) => {
        if (e.characters.includes(c)) {
          // does not add entry to list if it already exists there, prevents duplicates
          if (!filteredList.includes(e)) filteredList.push(e);
        }
      });
    });

    return filteredList;
  }

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
        (a, b) => new Date(a.releaseDate) - new Date(b.releaseDate)
      );

      console.log(data);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <div className="flex gap-4">
        <Filters charFilter={charFilter} setCharFilter={setCharFilter} />
        {entries.data && (
          <div className="grid grid-cols-4 auto-rows-min gap-2 max-w-screen-lg mx-auto">
            {filterEntries(entries.data.items).map((e) => (
              <div
                className="bg-inverse text-bold rounded-md relative overflow-hidden"
                key={e.id}
              >
                <input
                  type="checkbox"
                  name=""
                  id=""
                  className="absolute top-2 left-2 scale-150"
                />
                <img src={e.posterUrl} alt="" />

                <div className="p-2 flex gap-2">
                  <h2>{e.title}</h2>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
