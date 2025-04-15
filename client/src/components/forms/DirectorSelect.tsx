import { cn } from "@/lib/utils";
import { entry } from "@/types";
import axios from "axios";
import AsyncCreatableSelect from "react-select/async-creatable";

// @ts-expect-error Can't be bothered
const DirectorSelect = ({ field }) => {
  return (
    <AsyncCreatableSelect
      classNames={{
        control: () =>
          cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive text-muted-foreground",
          ),
        valueContainer: () => "flex gap-2 text-foreground",
        multiValue: () =>
          "bg-input px-2 py-1 rounded-sm flex items-center gap-2",
        menuList: () => "bg-background border border-input rounded-md py-2",
        option: () => "p-4 hover:bg-input",
      }}
      unstyled
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
  );
};

export default DirectorSelect;

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
