import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm } from "@tanstack/react-form";
import { FieldInfo } from "./FieldInfo";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { z } from "zod";
import DirectorSelect from "./DirectorSelect";
import CharacterSelect from "./CharacterSelect";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import axios from "axios";
import { toast } from "sonner";

type Props = {
  password: string | undefined;
  close: () => void;
};

const EntryForm = ({ password, close }: Props) => {
  const form = useForm({
    defaultValues: {
      title: "",
      releaseDate: "",
      directors: [""],
      medium: "Movie",
      runtime: 0,
      posterUrl: "",
      characters: [0],
      phase: 1,
    },
    validators: {
      onChange: z.object({
        title: z.string(),
        releaseDate: z.string(),
        directors: z.array(z.string()),
        medium: z.enum(["Movie", "Show", "Extra"]),
        runtime: z.number(),
        posterUrl: z.string(),
        characters: z.array(z.number()),
        phase: z.number(),
      }),
    },
    onSubmit: async ({ value }) => {
      console.log(value);
      await axios
        .post(
          import.meta.env.VITE_API_BASE_URL + "/entries",
          { ...value },
          {
            headers: {
              Authorization: "Bearer " + password!,
            },
          },
        )
        .then((res) => {
          toast("Created New Entry", res.data);
        })
        .catch((err) => {
          toast("Something went wrong", {
            description: err.message,
            action: {
              label: "More",
              onClick: () => console.log(err),
            },
          });
        });

      close();
    },
  });

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="title"
        validators={{
          onChange: ({ value }) =>
            value.split("").length > 0 ? undefined : "Title is required",
        }}
        children={(field) => {
          return (
            <>
              <Label htmlFor={field.name}>Title</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                type="text"
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </>
          );
        }}
      />
      <form.Field
        name="releaseDate"
        validators={{
          onChange: ({ value }) => {
            if (new Date(value).toDateString() == "Invalid Date")
              return "A date is required";

            if (new Date(value) > new Date())
              return "Future dates are not allowed";

            return undefined;
          },
        }}
        children={(field) => {
          return (
            <>
              <Label htmlFor={field.name}>Release Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      new Date(field.state.value).toDateString() ==
                        "Invalid Date" && "text-muted-foreground",
                    )}
                  >
                    <FontAwesomeIcon icon={faCalendar} />
                    {new Date(field.state.value).toDateString() !=
                    "Invalid Date" ? (
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
              {/* <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                type="date"
                onChange={(e) => field.handleChange(e.target.value)}
              /> */}
              <FieldInfo field={field} />
            </>
          );
        }}
      />
      <form.Field
        name="directors"
        validators={{
          onChange: ({ value }) =>
            value.length > 0
              ? undefined
              : "At least one director or showrunner is needed.",
        }}
        children={(field) => {
          return (
            <>
              <Label htmlFor={field.name}>Directors</Label>
              {/* TODO: Needs styling to match Shadcn */}
              <DirectorSelect field={field} />
              <FieldInfo field={field} />
            </>
          );
        }}
      />
      <form.Field
        name="medium"
        children={(field) => {
          return (
            <>
              <Label htmlFor={field.name}>Format</Label>
              <Select
                defaultValue={field.state.value}
                value={field.state.value}
                onValueChange={field.handleChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Movie">Movie</SelectItem>
                    <SelectItem value="Show">Show</SelectItem>
                    <SelectItem value="Extra">Extra</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldInfo field={field} />
            </>
          );
        }}
      />
      <form.Field
        name="runtime"
        validators={{
          onChange: ({ value }) => {
            if (!value) return "A runtime is needed";
            return undefined;
          },
        }}
        children={(field) => {
          return (
            <>
              <Label htmlFor={field.name}>Runtime (in minutes)</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                value={field.state.value}
                onChange={(e) => field.handleChange(parseInt(e.target.value))}
              />
              <FieldInfo field={field} />
            </>
          );
        }}
      />
      <form.Field
        name="posterUrl"
        validators={{
          onChange: ({ value }) =>
            value.split("").length > 0
              ? undefined
              : "A poster is required (Make sure to upload it!)",
        }}
        children={(field) => {
          return (
            <>
              <Label htmlFor={field.name}>Poster</Label>
              <Input
                id={field.name}
                name={field.name}
                // value={field.state.value}
                onChange={(e) => field.handleChange(e.target.files![0].name)}
                type="file"
              />
              <FieldInfo field={field} />
            </>
          );
        }}
      />
      <form.Field
        name="characters"
        children={(field) => {
          return (
            <>
              <Label>Characters</Label>
              <CharacterSelect field={field} />
              <FieldInfo field={field} />
            </>
          );
        }}
      />
      <form.Field
        name="phase"
        validators={{
          onChange: ({ value }) => {
            if (value <= 0 || value > 6) return "Enter a valid phase number";
            if (!value) return "A phase number is needed";
            return undefined;
          },
        }}
        children={(field) => {
          return (
            <>
              <Label htmlFor={field.name}>Phase (1-6)</Label>
              <Input
                id={field.name}
                name={field.name}
                type="number"
                value={field.state.value}
                min={1}
                max={6}
                onChange={(e) => field.handleChange(parseInt(e.target.value))}
              />
              <FieldInfo field={field} />
            </>
          );
        }}
      />
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit}>
            {isSubmitting ? "..." : "Submit"}
          </Button>
        )}
      />
    </form>
  );
};

export default EntryForm;
