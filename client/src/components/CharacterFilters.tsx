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
import axios from "axios";
import { toast } from "sonner";

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
      const data = await axios
        .get(import.meta.env.VITE_API_BASE_URL + "/characters")
        .then((res) => {
          return res.data.items;
        })
        .catch(() => {
          toast("Couldn't load characters");
        });

      data.sort((a: character, b: character) =>
        a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
      );

      localStorage.setItem("characters", JSON.stringify(data));
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
              characters.data.map((c: character) => (
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
