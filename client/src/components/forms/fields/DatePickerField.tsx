import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFieldContext } from "@/forms/useAppForm";
import { option } from "@/types";
import {
  faCalendar,
  faCalendarDays,
  faCalendarWeek,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

type Props = {
  label: string;
};
export const DatePickerField = ({ label }: Props) => {
  const [day, setDay] = useState<number>(1);
  const [month, setMonth] = useState<number>(1);
  const [year, setYear] = useState<number>(2008);
  const field = useFieldContext<string>();

  const months = [
    "",
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const yearOptions: option[] = [];

  // create year options from 2008 (MCU birth year) to 5 years from present
  for (let i = 2008; i <= new Date().getFullYear() + 5; i++) {
    yearOptions.push({ label: i.toString(), value: i });
  }

  const [dayOptions, setDayOptions] = useState<option[]>([]);
  const [dayMax, setDayMax] = useState<number>(31);

  useEffect(() => {
    const newDays: option[] = [];

    switch (month) {
      case 4:
      case 6:
      case 9:
      case 11:
        setDayMax(30);
        break;
      case 2:
        setDay(28);
        break;
      default:
        setDayMax(31);
        break;
    }

    for (let i = 1; i <= dayMax; i++) {
      newDays.push({ label: i.toString(), value: i });
    }

    setDayOptions(newDays);

    field.handleChange(year + "-" + month + "-" + day);
  }, [day, month, year, field, dayMax]);

  return (
    <>
      <Label htmlFor={field.name}>{label}</Label>
      <div className="flex gap-2">
        {/* Day Select */}
        <Select
          onValueChange={(v) => setDay(parseInt(v))}
          value={day.toString()}
        >
          <SelectTrigger>
            <FontAwesomeIcon icon={faCalendarDays} />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-50">
            {dayOptions.map((o) => (
              <SelectItem value={o.value.toString()}>{o.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {/* Month Select */}
        <Select
          onValueChange={(v) => {
            if (day > dayMax) {
              setDayMax(dayMax);
            }
            setMonth(parseInt(v));
          }}
          value={month.toString()}
        >
          <SelectTrigger className="grow">
            <FontAwesomeIcon icon={faCalendarWeek} />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-50">
            {months.map((m, i) => {
              if (i > 0)
                return <SelectItem value={i.toString()}>{m}</SelectItem>;
            })}
          </SelectContent>
        </Select>
        {/* Year Select */}
        <Select
          onValueChange={(v) => setYear(parseInt(v))}
          value={year.toString()}
        >
          <SelectTrigger>
            <FontAwesomeIcon icon={faCalendar} />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-50">
            {yearOptions.map((y) => (
              <SelectItem value={y.value.toString()}>{y.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* <Popover>
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
      </Popover> */}
    </>
  );
};
