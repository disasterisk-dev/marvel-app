import { cn } from "@/lib/utils";
import { character } from "@/types";
import axios from "axios";
import AsyncSelect from "react-select/async";

// @ts-expect-error Can't be bothered
const CharacterSelect = ({ field }) => {
  return (
    <AsyncSelect
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
      id={field.name}
      cacheOptions={false}
      defaultOptions
      loadOptions={loadCharacters}
      onChange={(v) => {
        const values: number[] = [];
        v.forEach((i) => values.push(i.value));
        field.handleChange(values);
      }}
    />
  );
};

export default CharacterSelect;

interface characterOption {
  readonly value: number;
  readonly label: string;
}

const loadCharacters = (
  inputValue: string,
  callback: (options: characterOption[]) => void,
) => {
  axios.get(import.meta.env.VITE_API_BASE_URL + "/characters").then((res) => {
    const characters: character[] = res.data.items;

    const options: characterOption[] = [];

    characters.forEach((c) => {
      options.push({ label: c.name, value: c.id });
    });

    callback(
      options.filter((o) =>
        o.label.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase()),
      ),
    );
  });
};
