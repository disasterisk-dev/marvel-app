import { useFilter } from "@/context/FilterContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

const MediumFilters = () => {
  const media = ["Movie", "Show", "Extra"];

  const { mediumFilter, setMediumFilter } = useFilter()!;

  function updateFilter(e: string) {
    if (mediumFilter.includes(e)) {
      const newFilter = mediumFilter.filter((m: string) => m !== e);
      setMediumFilter(newFilter);

      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For everyone else

      return;
    }

    setMediumFilter([...mediumFilter, e]);
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For everyone else
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
              <div className="flex gap-2 pb-1" key={i}>
                <Checkbox
                  name={m}
                  id={m}
                  className=""
                  checked={mediumFilter.includes(m)}
                  onCheckedChange={() => updateFilter(m)}
                />
                <Label htmlFor={m}>{m}</Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

export default MediumFilters;
