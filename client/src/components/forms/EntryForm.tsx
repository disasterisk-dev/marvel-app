import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm } from "@tanstack/react-form";
import { FieldInfo } from "./FieldInfo";
import AsyncCreatableSelect from "react-select/async-creatable";
import axios from "axios";
import { entry } from "@/types";

const EntryForm = () => {
  const form = useForm({
    defaultValues: {
      title: "",
      releaseDate: "",
      directors: [""],
    },
    onSubmit: async ({ value }) => {
      console.log(value);
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
        children={(field) => {
          return (
            <>
              <Label htmlFor={field.name}>Release Date</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                type="date"
                onChange={(e) => field.handleChange(e.target.value)}
              />
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
              <AsyncCreatableSelect
                isMulti
                cacheOptions={false}
                id={field.name}
                defaultOptions
                loadOptions={loadDirectors}
                onChange={(v) => {
                  const values: string[] = [];
                  v.forEach((i) => values.push(i.value));
                  field.handleChange(values);
                }}
              />
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

interface directorOption {
  readonly value: string;
  readonly label: string;
}

const loadDirectors = (
  inputValue: string,
  callback: (options: directorOption[]) => void,
) => {
  axios.get(import.meta.env.VITE_API_BASE_URL + "/entries").then((res) => {
    const entries: entry[] = res.data.items;
    const directors: string[] = [];

    // Filter out duplicates first
    entries.forEach((e) => {
      e.directors.forEach((d) => {
        if (!directors.includes(d)) {
          directors.push(d);
        }
      });
    });

    // convert plain strings into options for the react-select library
    const options: directorOption[] = [];

    directors.forEach((d) => {
      options.push({ label: d, value: d });
    });

    callback(
      options.filter((o) =>
        o.value.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase()),
      ),
    );
  });
};
