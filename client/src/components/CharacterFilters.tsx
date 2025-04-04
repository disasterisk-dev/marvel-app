import { useQuery } from "@tanstack/react-query";
import { character } from "../types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useContext } from "react";
import { FilterContext } from "@/context.ts/FilterContext";

const CharacterFilters = () => {
  const filters = useContext(FilterContext);

  function updateFilter(id: number) {
    if (filters?.charFilter.includes(id)) {
      const newFilter = filters.charFilter.filter((c) => c !== id);
      filters.setCharFilter(newFilter);
      console.log(filters.charFilter);

      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For everyone else

      return;
    }

    filters?.setCharFilter([...filters.charFilter, id]);

    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For everyone else

    return;
  }

  const characters = useQuery({
    queryKey: ["characters"],
    queryFn: async () => {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/characters",
      );

      if (!res.ok) {
        throw new Error("Couldn't get characters");
      }

      const data = await res.json();

      data.items.sort((a: character, b: character) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      );

      return data;
    },
  });
  return (
    <>
      <Accordion
        type="single"
        defaultValue="characters"
        collapsible
        className="w-full"
      >
        <AccordionItem value="characters">
          <AccordionTrigger className="font-heading text-lg font-medium">
            Characters
          </AccordionTrigger>
          <AccordionContent>
            {characters.error && <div>{characters.error.message}</div>}
            {characters.data &&
              characters.data.items.map((c: character) => (
                <div className="flex gap-2" key={c.id}>
                  <input
                    type="checkbox"
                    name={c.id.toString()}
                    id={c.id.toString()}
                    className=""
                    value={c.id}
                    onChange={(e) => updateFilter(parseInt(e.target.value))}
                  />
                  <label className="text-nowrap" htmlFor={c.id.toString()}>
                    {c.name}
                  </label>
                </div>
              ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default CharacterFilters;
