import { FilterContext } from "@/context/FilterContext";
import { useContext } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const MediumFilters = () => {
  const media = ["Movie", "Show", "Extra"];

  const filters = useContext(FilterContext);

  function updateFilter(e: string) {
    if (filters?.mediumFilter.includes(e)) {
      const newFilter = filters.mediumFilter.filter((m: string) => m !== e);
      filters.setMediumFilter(newFilter);

      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For everyone else

      return;
    }

    filters?.setMediumFilter([...filters.mediumFilter, e]);
  }

  return (
    <>
      <Accordion
        type="single"
        defaultValue="medium"
        collapsible
        className="w-full"
      >
        <AccordionItem value="medium">
          <AccordionTrigger className="font-heading text-lg font-medium">
            Format
          </AccordionTrigger>
          <AccordionContent>
            {media.map((m, i) => (
              <div className="flex gap-2" key={i}>
                <input
                  type="checkbox"
                  name={m}
                  id={m}
                  className=""
                  value={m}
                  onChange={(e) => updateFilter(e.target.value)}
                />
                <label htmlFor={m}>{m}</label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default MediumFilters;
