import { useFilter } from "@/context/FilterContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

const PhaseFilter = () => {
  const phases = ["One", "Two", "Three", "Four", "Five", "Six"];

  const { phaseFilter, setPhaseFilter } = useFilter()!;

  function updateFilter(id: number) {
    if (phaseFilter.includes(id)) {
      const newFilter = phaseFilter.filter((c) => c !== id);
      setPhaseFilter(newFilter);

      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For everyone else

      return;
    }

    setPhaseFilter([...phaseFilter, id]);

    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For everyone else

    return;
  }

  return (
    <Accordion
      type="single"
      defaultValue="medium"
      collapsible
      className="w-full"
    >
      <AccordionItem value="medium">
        <AccordionTrigger className="font-heading text-lg font-medium">
          Phase
        </AccordionTrigger>
        <AccordionContent>
          {phases.map((p, i) => (
            <div className="flex gap-2 pb-1" key={i}>
              <Checkbox
                name={p}
                id={p}
                className=""
                checked={phaseFilter.includes(i + 1)}
                onCheckedChange={() => updateFilter(i + 1)}
              />
              <Label htmlFor={p}>{p}</Label>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PhaseFilter;
