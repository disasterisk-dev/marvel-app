import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFieldContext } from "@/forms/useAppForm";
import { cn } from "@/lib/utils";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";

type Props = {
  label: string;
};
export const DatePickerField = ({ label }: Props) => {
  const field = useFieldContext<string>();

  return (
    <>
      <Label htmlFor={field.name}>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              new Date(field.state.value).toDateString() == "Invalid Date" &&
                "text-muted-foreground",
            )}
          >
            <FontAwesomeIcon icon={faCalendar} />
            {new Date(field.state.value).toDateString() != "Invalid Date" ? (
              format(field.state.value, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Calendar
            mode="single"
            selected={new Date(field.state.value)}
            onSelect={(d) => field.handleChange(d!.toString())}
          />
        </PopoverContent>
      </Popover>
    </>
  );
};
