import { useQuery } from "@tanstack/react-query";
import { character } from "../types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { useFilter } from "@/context/FilterContext";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

const CharacterFilters = () => {
  const { charFilter, setCharFilter } = useFilter()!;

  function updateFilter(id: number) {
    if (charFilter.includes(id)) {
      const newFilter = charFilter.filter((c) => c !== id);
      setCharFilter(newFilter);

      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For everyone else

      return;
    }

    setCharFilter([...charFilter, id]);

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
                <div className="flex gap-2 pb-1" key={c.id}>
                  <Checkbox
                    name={c.name}
                    id={c.name}
                    onCheckedChange={() => updateFilter(c.id)}
                  />
                  <Label htmlFor={c.name}>{c.name}</Label>
                </div>
              ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default CharacterFilters;
